import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ParcelSaveDto, ParcelUpdateDto } from 'src/common/dtos/parcel.dto';
import { ParcelDocument, Parcel } from 'src/common/schema/parcel.schema';
import { RecipientDocument, Recipient } from 'src/common/schema/recipient.schema';
import { UnitDocument, Unit } from 'src/common/schema/unit.schema';
import { NOTIFICATION_STATUS, PARCEL_TYPE, NOTIFICATION_TYPES } from 'src/common/constants/ENUM';
import { MailService } from 'src/services/mailtrap.service';
import * as EmailTemplate from 'src/utils/email-templates';
import { WhatsAppService } from 'src/services/whatsapp.service';
import { S3Service } from 'src/services/s3.service';
import * as Fuse from 'fuse.js';

@Injectable()
export class ParcelService {

    constructor(
        @InjectModel(Parcel.name)
        private readonly parcelModel: Model<ParcelDocument>,
        @InjectModel(Recipient.name)
        private readonly recipientModel: Model<RecipientDocument>,
        @InjectModel(Unit.name)
        private readonly unitModel: Model<UnitDocument>,
        private readonly mailService: MailService,
        private readonly s3Service: S3Service,
        private readonly whatsappService: WhatsAppService,
    ) { }
    async sendTestWhatsapp() {
        await this.whatsappService.sendWhatsAppMessage("+923054580051", "Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification from the Cloud API, hosted by Meta. Thank you for taking the time to test with us.")
    }
    private async checkFortheUnit(unitAddress, condominiumID) {
        if (unitAddress) {
            const condition: any = {}
            condition.condominiumID = condominiumID
            const addressPattern = unitAddress
                .split(' ')
                .map(word => `(?=.*${word})`)
                .join('');
            condition.address = {
                $regex: addressPattern,
                $options: 'i'  // case insensitive
            }

            const unit = await this.unitModel.findOne(condition)
            return unit?.unitId ?? null
        }
        return null
    }
    private calculateLevenshteinDistance(a: string, b: string): number {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

        for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

        for (let j = 1; j <= b.length; j++) {
            for (let i = 1; i <= a.length; i++) {
                const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1, // deletion
                    matrix[j - 1][i] + 1, // insertion
                    matrix[j - 1][i - 1] + substitutionCost // substitution
                );
            }
        }
        return matrix[b.length][a.length];
    }
    private async sendNotification(parcelId: string) {
        const parcel = await this.parcelModel.findById(parcelId)
        const recipient = await this.recipientModel.findById(parcel.recipientID)
        if (recipient) {
            if (recipient.notificationType == NOTIFICATION_TYPES.EMAIL || recipient.notificationType == NOTIFICATION_TYPES.BOTH) {
                const data = EmailTemplate.parcelAtGateHouse(recipient.name);
                await this.mailService.sendMail(recipient.email, data.SUBJECT, data.HTML);
                parcel.notificationStatus = NOTIFICATION_STATUS.NOTIFIED;
                await parcel.save();
            }
            if (recipient.notificationType == NOTIFICATION_TYPES.WHATSAPP || recipient.notificationType == NOTIFICATION_TYPES.BOTH) {
                // const message = `Dear ${recipient.name}, A parcel has been recipient at the gatehouse.`
                // WhatsApp message translation
                const message = `Chegou Sua Encomenda! Acabamos de receber uma encomenda para você! Por favor, retire-a na portaria assim que tiver disponibilidade. Obrigado.`
                await this.whatsappService.sendWhatsAppMessage(recipient.whatsapp, message)
                // Send WhatsApp Notification
                parcel.notificationStatus = NOTIFICATION_STATUS.NOTIFIED;
                await parcel.save();
            }
        } else if (parcel.email) {
            const data = EmailTemplate.parcelAtGateHouse(parcel.fullName);
            await this.mailService.sendMail(parcel.email, data.SUBJECT, data.HTML);
            parcel.notificationStatus = NOTIFICATION_STATUS.NOTIFIED;
            await parcel.save();
        }
    }

    private calculateNameMatchScore(name1: string, name2: string): number {
        // Convert both names to lowercase for comparison
        name1 = name1.toLowerCase().trim();
        name2 = name2.toLowerCase().trim();

        // If names are exactly the same, return max score
        if (name1 === name2) return 100;

        // Split into words
        const words1 = name1.split(/\s+/);
        const words2 = name2.split(/\s+/);

        // For two-word names (common first and last name case)
        if (words1.length === 2 && words2.length === 2) {
            // Weight distribution: first name (40%), last name (60%)
            const firstNameWeight = 40;
            const lastNameWeight = 60;

            // First name scoring
            let firstNameScore = 0;
            const firstName1 = words1[0];
            const firstName2 = words2[0];

            if (firstName1 === firstName2) {
                // Exact match
                firstNameScore = 100;
            } else {
                const firstNameDistance = this.calculateLevenshteinDistance(firstName1, firstName2);
                const maxFirstNameLength = Math.max(firstName1.length, firstName2.length);
                // Calculate similarity as percentage (100% - percentage of different characters)
                firstNameScore = Math.max(0, 100 - (firstNameDistance / maxFirstNameLength * 100));
            }

            // Last name scoring
            let lastNameScore = 0;
            const lastName1 = words1[1];
            const lastName2 = words2[1];

            if (lastName1 === lastName2) {
                // Exact match
                lastNameScore = 100;
            } else {
                const lastNameDistance = this.calculateLevenshteinDistance(lastName1, lastName2);
                const maxLastNameLength = Math.max(lastName1.length, lastName2.length);

                // Calculate base similarity score
                const baseLastNameScore = Math.max(0, 100 - (lastNameDistance / maxLastNameLength * 100));

                // Check for prefix match (one name is shortened version of the other)
                let prefixBonus = 0;
                if (lastName1.length < lastName2.length && lastName2.startsWith(lastName1)) {
                    // Shorter name is a prefix of longer name - give bonus relative to how much of the name is matched
                    prefixBonus = 40 * (lastName1.length / lastName2.length);
                } else if (lastName2.length < lastName1.length && lastName1.startsWith(lastName2)) {
                    // Shorter name is a prefix of longer name - give bonus relative to how much of the name is matched
                    prefixBonus = 40 * (lastName2.length / lastName1.length);
                }

                // Apply prefix bonus, but cap at 100
                lastNameScore = Math.min(100, baseLastNameScore + prefixBonus);
            }

            // Calculate weighted total score
            return (firstNameScore * firstNameWeight / 100) + (lastNameScore * lastNameWeight / 100);
        }

        // For names with different word counts or more than 2 words
        // Calculate score for each word pair and use the best matches
        const wordScores = [];

        for (const word1 of words1) {
            if (word1.length <= 1) continue; // Skip very short words

            let bestScore = 0;

            for (const word2 of words2) {
                if (word2.length <= 1) continue;

                let score = 0;

                if (word1 === word2) {
                    // Exact match
                    score = 100;
                } else {
                    const distance = this.calculateLevenshteinDistance(word1, word2);
                    const maxLength = Math.max(word1.length, word2.length);
                    // Base score on similarity
                    score = Math.max(0, 100 - (distance / maxLength * 100));

                    // Check for prefix match
                    if (word1.length < word2.length && word2.startsWith(word1)) {
                        // Add bonus for prefix match
                        const prefixBonus = 40 * (word1.length / word2.length);
                        score = Math.min(100, score + prefixBonus);
                    } else if (word2.length < word1.length && word1.startsWith(word2)) {
                        // Add bonus for prefix match
                        const prefixBonus = 40 * (word2.length / word1.length);
                        score = Math.min(100, score + prefixBonus);
                    }
                }

                if (score > bestScore) {
                    bestScore = score;
                }
            }

            wordScores.push(bestScore);
        }

        // Calculate average score (if there are valid words)
        if (wordScores.length === 0) return 0;
        return wordScores.reduce((sum, score) => sum + score, 0) / wordScores.length;
    }

    private async checkForTheRecipientFuzzy(parcelData, unitID = null) {
        const condition: any = {}
        if (parcelData.condominiumID)
            condition.condominiumID = parcelData.condominiumID
        if (unitID)
            condition.unitID = unitID
        const allRecipients = await this.recipientModel.find(condition, { name: 1 });

        let matches = [];

        if (parcelData.fullName) {
            // Calculate match score for each recipient
            const scoredMatches = allRecipients.map(recipient => ({
                recipient,
                score: this.calculateNameMatchScore(recipient.name, parcelData.fullName)
            }));

            // Filter for matches with scores above threshold (e.g., 60)
            const threshold = 80;
            const validMatches = scoredMatches
                .filter(match => match.score >= threshold)
                .sort((a, b) => b.score - a.score); // Sort by score, highest first

            // Take the best matches
            matches = validMatches.map(match => match.recipient);
        }

        // Remove duplicates
        matches = Array.from(new Set(matches.map(m => m._id.toString())))
            .map(id => matches.find(m => m._id.toString() === id));

        return matches.map(m => m._id);
    }
    private async checkForTheRecipient(parcelData: any) {
        // check for the addressUnit to match with the unit 
        let unitId = await this.checkFortheUnit(parcelData.addressUnit, parcelData.condominiumID)
        // if no unitId id assigned check for the addressAppartmentNo to match with the unit 
        if (!unitId)
            unitId = await this.checkFortheUnit(parcelData.addressAppartmentNo, parcelData.condominiumID)
        // if no unitId id assigned check for the addressOther to match with the unit 
        if (!unitId)
            unitId = await this.checkFortheUnit(parcelData.addressOther, parcelData.condominiumID)

        const FrecepientMatches = await this.checkForTheRecipientFuzzy(parcelData, unitId)

        if (FrecepientMatches.length == 0) {
            return null
        }
        const condition: any = {}
        condition["_id"] = FrecepientMatches[0]._id
        condition.condominiumID = parcelData.condominiumID
        if (unitId)
            condition.unitID = unitId
        const recipient = await this.recipientModel.findOne(condition);
        return recipient;
    }
    async saveParcel(parcelSaveDto: ParcelSaveDto) {
        const recipient = await this.checkForTheRecipient(parcelSaveDto);
        const parcel = await this.parcelModel.create({
            condominiumID: parcelSaveDto.condominiumID,
            unitID: recipient ? recipient?.unitID : null,
            recipientID: recipient ? recipient._id : null,
            fullName: parcelSaveDto.fullName,
            addressCondominium: parcelSaveDto.addressCondominium,
            addressUnit: parcelSaveDto.addressUnit,
            addressAppartmentNo: parcelSaveDto.addressAppartmentNo,
            addressOther: parcelSaveDto.addressOther,
            contact: parcelSaveDto.contact,
            email: parcelSaveDto.email,
            notificationStatus: NOTIFICATION_STATUS.PENDING,
            type: (parcelSaveDto.fullName && recipient) ? PARCEL_TYPE.NOT_COLLECTED : PARCEL_TYPE.UNASSIGNED,
            registrationDate: new Date(),
            imageURL: parcelSaveDto.imageURL
        });
        // await this.sendNotification(parcel._id as string)
        const parcel_ = await this.parcelModel.findById(parcel._id)
        return parcel_
    }
    async listParcels(condominiumID, unitID = '') {
        const condition: any = {}
        if (unitID) {
            condition.unitID = unitID
        } else {
            condition.condominiumID = condominiumID
        }

        const parcels = await this.parcelModel.aggregate([
            {
                $facet: {
                    collected: [
                        {
                            $match: {
                                ...condition,
                                type: PARCEL_TYPE.COLLECTED,
                            }
                        }
                    ],
                    notCollected: [
                        {
                            $match: {
                                ...condition,
                                type: PARCEL_TYPE.NOT_COLLECTED,
                            }
                        }
                    ],
                    unassigned: [
                        {
                            $match: {
                                condominiumID: condominiumID,
                                type: PARCEL_TYPE.UNASSIGNED,
                            }
                        }
                    ]
                }
            }
        ]);
        for (let i = 0; i < parcels[0].collected.length; i++) {
            if (parcels[0].collected[i].imageURL) {
                parcels[0].collected[i].imageURL = await this.s3Service.getPreSignedUrl(
                    parcels[0].collected[i].imageURL,
                    'parcels',
                );
            }
        }
        for (let i = 0; i < parcels[0].notCollected.length; i++) {
            if (parcels[0].notCollected[i].imageURL) {
                parcels[0].notCollected[i].imageURL = await this.s3Service.getPreSignedUrl(
                    parcels[0].notCollected[i].imageURL,
                    'parcels',
                );
            }
        }
        for (let i = 0; i < parcels[0].unassigned.length; i++) {
            if (parcels[0].unassigned[i].imageURL) {
                parcels[0].unassigned[i].imageURL = await this.s3Service.getPreSignedUrl(
                    parcels[0].unassigned[i].imageURL,
                    'parcels',
                );
            }
        }
        return parcels;
    }

    async collectParcel(id: string) {
        const parcel = await this.parcelModel.findById(id);
        if (parcel) {
            parcel.type = PARCEL_TYPE.COLLECTED;
            parcel.collectionDate = (new Date()).toString();
            await parcel.save();
            const recipient = await this.recipientModel.findById(parcel.recipientID);
            if (recipient) {
                if (recipient.notificationType == NOTIFICATION_TYPES.EMAIL || recipient.notificationType == NOTIFICATION_TYPES.BOTH) {
                    const data = EmailTemplate.parcelCollected(recipient.name);
                    await this.mailService.sendMail(recipient.email, data.SUBJECT, data.HTML);
                }
                if (recipient.notificationType == NOTIFICATION_TYPES.WHATSAPP || recipient.notificationType == NOTIFICATION_TYPES.BOTH) {
                    // Send WhatsApp Notification
                }
            } else if (parcel.email) {
                const data = EmailTemplate.parcelCollected(parcel.fullName);
                await this.mailService.sendMail(recipient.email, data.SUBJECT, data.HTML);
            }
        }
    }

    async updateParcel(id: string, parcelUpdateDto: ParcelUpdateDto) {
        const parcel = await this.parcelModel.findById(id);
        let recipientUpdated = parcel && parcelUpdateDto.recipientID != parcel.recipientID
        const recipient = await this.recipientModel.findById(parcelUpdateDto.recipientID)

        parcel.unitID = parcelUpdateDto.unitID;
        parcel.recipientID = parcelUpdateDto.recipientID;
        parcel.fullName = recipient.name;
        parcel.save();

        if (recipientUpdated) {
            await this.sendNotification(id as string)
        }
        return parcel
    }
    async deleteParcel(id: string) {
        // delete parcel
        await this.parcelModel.findByIdAndDelete(id);
        return { message: 'Parcel deleted successfully' };
    }
    async associateRecipientToParcel(id, associateRecipientToParcelUpdateDto) {
        const recipient = await this.recipientModel.findById(associateRecipientToParcelUpdateDto.recipientID)
        const parcel = await this.parcelModel.findById(id)

        parcel.unitID = associateRecipientToParcelUpdateDto.unitID
        parcel.recipientID = associateRecipientToParcelUpdateDto.recipientID
        parcel.type = PARCEL_TYPE.NOT_COLLECTED
        if(recipient){
            parcel.fullName = recipient.name
            parcel.email = recipient.email
            parcel.contact = recipient.whatsapp
        }
        await parcel.save()
        await this.sendNotification(id as string)

        return { message: "Recipient assigned to the parcel" }
    }
}

