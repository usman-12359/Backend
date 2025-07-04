import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Anthropic } from '@anthropic-ai/sdk';
import { Subscriber } from 'src/common/schema/subscriber.schema';
import { Condominium } from 'src/common/schema/condominium.schema';
import { Unit } from 'src/common/schema/unit.schema';
import { Admin } from 'src/common/schema/admin.schema';
import { PLAN_STATUS } from 'src/common/constants/ENUM';
import { FileUploadDto } from 'src/common/dtos/fileUpload.dto';
import { S3Service } from 'src/services/s3.service';
import { ParcelService } from 'src/modules/parcel/services/parcel.service';
import { randomUUID } from 'crypto';
import axios from 'axios';
import * as sharp from 'sharp';

@Injectable()
export class OcrService {

    constructor(
        @InjectModel(Subscriber.name) private subscriberModel: Model<Subscriber>,
        @InjectModel(Admin.name) private adminModel: Model<Admin>,
        @InjectModel(Condominium.name) private condominiumModel: Model<Condominium>,
        @InjectModel(Unit.name) private unitModel: Model<Unit>,

        private readonly s3Service: S3Service,
        private readonly parcelService: ParcelService,
    ) { }
    async checkForUserSubscription(user) {
        const subscriber = await this.subscriberModel.findOne({ email: user.email });
        if (!subscriber) {
            const checkAdmin = await this.adminModel.findOne({ email: user.email });
            if (!checkAdmin) {
                // Error messages translations
                throw new BadRequestException('Usuário não está inscrito no serviço');
            } else {
                return checkAdmin
            }
        }
        if (
            (
                subscriber.planStatus != PLAN_STATUS.ACTIVE
            )
            ||
            (
                subscriber.planExpirationDate && new Date() > subscriber.planExpirationDate
            )
        ) {
            throw new BadRequestException('Assinatura ainda não está ativa. Por favor, entre em contato com o administrador');
        }
        return subscriber;
    }
    async compressAndUploadImageTos3Bucket(body: FileUploadDto) {
        const { file } = body;

        // Compress the image using sharp
        const compressedBuffer = await sharp(file.buffer)
            .resize(800)
            // .resize(800, 800, { // Max dimensions while maintaining aspect ratio
            //     fit: 'inside',
            //     withoutEnlargement: true
            // })
            .jpeg({ quality: 60 }) // Compress with 80% quality
            .toBuffer();

        // Create a file object that matches the S3Service expectations
        const compressedFile = {
            buffer: compressedBuffer,
            originalname: file.originalname || `compressed-${randomUUID()}.jpg`,
            mimetype: 'image/jpeg',
            size: compressedBuffer.length,
            fileType: {
                ext: '.jpg',
                mime: 'image/jpeg'
            }
        };

        const parcelImage = await this.s3Service.uploadFile(
            compressedFile,
            randomUUID(),
            'parcels',
        );
        const parcelImageLink = await this.s3Service.getPreSignedUrl(
            parcelImage?.uuid,
            'parcels',
        );
        const extension = parcelImage.fileType.ext
        return { parcelImage, parcelImageLink, extension: "jpeg" }
    }
    async uploadImageTos3Bucket(body: FileUploadDto) {
        const { file } = body;
        const parcelImage = await this.s3Service.uploadFile(
            file,
            randomUUID(),
            'parcels',
        );
        const parcelImageLink = await this.s3Service.getPreSignedUrl(
            parcelImage?.uuid,
            'parcels',
        );
        const extension = parcelImage.fileType.ext
        return { parcelImage, parcelImageLink, extension }
    }
    async anthropicApiCall(media_type, imageBase64) {
        const maxRetries = 5;
        let retries = 0;
        let response;

        const anthropic = new Anthropic({
            apiKey: process.env.CLAUDE_API_KEY
        });
        while (retries < maxRetries) {
            try {
                response = await anthropic.messages.create({
                    model: 'claude-3-5-sonnet-20240620',
                    max_tokens: 600,
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'image',
                                    source: {
                                        type: 'base64',
                                        media_type: media_type,
                                        data: imageBase64
                                    }
                                },
                                {
                                    type: 'text',
                                    text: 'Rotate the image to portrait first and then extract only the recipient details from the image as a JSON object and ignore the sender/shipper. For the address I need to get the unit what is something like apto 13. The json format should be as follows {fullname:"", address:{condominum:"",unit:"", appartmentNo:"",other:""},contact:"", email:""} Provide only the json so that it can be parsed.'
                                }
                                // {
                                //     type: 'text',
                                //     text: 'Rotate the image to portrait first and then extract only the recipient details from the image as a JSON object and ignore the sender/shipper. The json format should be as follows {fullname:"", address:{condominum:"",unit:"", appartmentNo:"",other:""},contact:"", email:""} Provide only the json so that it can be parsed'
                                // }
                            ]
                        }
                    ],
                });
                break; // Exit loop if successful
            } catch (error) {
                if (error?.error?.type === 'overloaded_error' && retries < maxRetries - 1) {
                    // Calculate delay with exponential backoff
                    const delay = Math.pow(2, retries) * 1000; // 1s, 2s, 4s, 8s, 16s
                    await new Promise(resolve => setTimeout(resolve, delay));
                    retries++;
                } else {
                    throw error; // Re-throw if it's not an overload error or we've exhausted retries
                }
            }
        }
        return response
    }
    async extractInformation(body: FileUploadDto, user: any, subscriberId: string): Promise<any> {
        const subscriber = await this.subscriberModel.findOne({
            _id: new Types.ObjectId(subscriberId)
        })
        const condominium = await this.condominiumModel.findOne({
            _id: new Types.ObjectId(subscriber.condominium)
        })
        try {
            await this.checkForUserSubscription(user);
            const { parcelImage, parcelImageLink, extension } = await this.compressAndUploadImageTos3Bucket(body)

            const imageBase64 = await this.convertLocalImageToBase64(parcelImageLink);
            let media_type: "image/jpeg" | "image/png" | "image/gif" | "image/webp" = "image/jpeg"; // Default to JPEG
            if (extension === '.png' || extension === 'png') {
                media_type = "image/png";
            } else if (extension === '.jpg' || extension === '.jpeg' || extension === 'jpg' || extension === 'jpeg') {
                media_type = "image/jpeg";
            } else if (extension === '.gif' || extension === 'gif') {
                media_type = "image/gif";
            } else if (extension === '.webp' || extension === 'webp') {
                media_type = "image/webp";
            }

            const response: any = await this.anthropicApiCall(media_type, imageBase64)

            let jsonResponse = {};
            const textContent = response?.content?.find(block => block.type === 'text');
            if (textContent && 'text' in textContent) {
                const start = textContent.text.indexOf('{');
                const end = textContent.text.lastIndexOf('}') + 1;
                const jsonStr = textContent.text.substring(start, end);

                // Check if the JSON string is valid
                if (start !== -1 && end !== -1 && jsonStr) {
                    jsonResponse = JSON.parse(jsonStr);
                } else {
                    jsonResponse = {
                        "fullname": "",
                        "address": {
                            "condominum": "",
                            "unit": "",
                            "appartmentNo": "",
                            "other": ""
                        },
                        "contact": "",
                        "email": ""
                    }
                }
            }
            const parcel = await this.parcelService.saveParcel(
                {
                    condominiumID: (condominium as any)?.condominiumID,
                    unitID: '',
                    fullName: (jsonResponse as any)?.fullname,
                    addressCondominium: (jsonResponse as any)?.address?.condominum,
                    addressUnit: (jsonResponse as any)?.address?.condominum,
                    addressAppartmentNo: (jsonResponse as any)?.address?.condominum,
                    addressOther: (jsonResponse as any)?.address?.condominum,
                    contact: (jsonResponse as any)?.contact,
                    email: (jsonResponse as any)?.email,
                    imageURL: parcelImage.uuid
                }
            )
            // return { ...jsonResponse, imageURL: parcelImage.uuid }
            return { parcelId: parcel._id, unitId: parcel.unitID, recipientId: parcel.recipientID }
        } catch (error) {
            console.error('API request failed:', error);
            const { parcelImage } = await this.compressAndUploadImageTos3Bucket(body)
            const parcel = await this.parcelService.saveParcel(
                {
                    condominiumID: (condominium as any)?.condominiumID,
                    unitID: '',
                    fullName: '',
                    addressCondominium: '',
                    addressUnit: '',
                    addressAppartmentNo: '',
                    addressOther: '',
                    contact: '',
                    email: '',
                    imageURL: parcelImage.uuid
                }
            )
            return { parcelId: parcel._id, unitId: parcel.unitID, recipientId: parcel.recipientID  }
            // return {
            //     "fullname": "",
            //     "address": {
            //         "condominum": "",
            //         "unit": "",
            //         "appartmentNo": "",
            //         "other": ""
            //     },
            //     "contact": "",
            //     "email": "",
            //     "imageURL": parcelImage.uuid
            // }
            // Note: You have unreachable code here - throwing after a return statement
            // throw new BadRequestException(error);
        }
    }

    async convertLocalImageToBase64(imageUrl: string): Promise<string> {
        // Fetch image from URL
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
        });

        // Convert buffer to base64
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        return base64Image;
    }
}

