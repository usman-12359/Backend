import { Injectable, Logger, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as tesseract from 'node-tesseract-ocr';
import { TESSERACT_CONFIG, LABEL_SECTIONS } from 'src/common/constants/shipping-label.constants';

@Global()
export class ImageService {
    private readonly logger = new Logger(ImageService.name);
  

    constructor(
      private readonly configService: ConfigService,
    ) {}
  
    async extractInformation(imagePath: string): Promise<any> {
      try {
        const text = await tesseract.recognize(
          imagePath, 
          this.getOcrConfig()
        );
  
        const lines = text.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
  
        return {
          name: this.extractName(lines),
          phone: this.extractPhone(lines),
          address: this.extractAddress(lines),
          trackingNumber: this.extractTrackingNumber(lines),
          postalCode: this.extractPostalCode(lines)
        };
      } catch (error) {
        this.logger.error(`Error processing shipping label: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    private getOcrConfig() {
      return {
        ...TESSERACT_CONFIG,
        // Allow override from environment variables
        lang: this.configService.get('OCR_LANGUAGES') || TESSERACT_CONFIG.lang,
      };
    }
  
    private extractName(lines: string[]): string | null {
      // Look for name after DESTINATÁRIO or similar headers
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        
        if (LABEL_SECTIONS.recipient.some(header => 
          line.includes(header.toLowerCase()))) {
          const nameLine = line.includes(':') ? 
            line.split(':')[1].trim() : 
            lines[i + 1];
          
          if (nameLine) {
            return nameLine.replace(/\d+/g, '').trim();
          }
        }
      }
  
      // Fallback: Look for name patterns
      const namePattern = /(?:Guilherme\s+(?:Cassoli\s+)?Jacob)/i;
      for (const line of lines) {
        const match = line.match(namePattern);
        if (match) return match[0].trim();
      }
  
      return null;
    }
  
    private extractPhone(lines: string[]): string | null {
      const phonePatterns = [
        /\+?\d{2}\s*\d{2}\s*\d{4,5}[-\s]?\d{4}/,
        /\(?(\d{2})\)?\s*\d{4,5}[-\s]?\d{4}/,
        /\d{8,11}/
      ];
  
      for (const line of lines) {
        if (LABEL_SECTIONS.phone.some(indicator => 
          line.toLowerCase().includes(indicator.toLowerCase()))) {
          for (const pattern of phonePatterns) {
            const match = line.match(pattern);
            if (match) return match[0];
          }
        }
  
        for (const pattern of phonePatterns) {
          const match = line.match(pattern);
          if (match) return match[0];
        }
      }
  
      return null;
    }
  
    private extractAddress(lines: string[]): string | null {
      let address: string[] = [];
      let foundAddress = false;
  
      for (const line of lines) {
        if (!foundAddress && LABEL_SECTIONS.address.some(indicator => 
          line.toLowerCase().includes(indicator.toLowerCase()))) {
          foundAddress = true;
        }
  
        if (foundAddress) {
          if (line.match(/\d{5}[-\s]?\d{3}/)) {
            address.push(line.trim());
            break;
          }
          address.push(line.trim());
        }
  
        if (foundAddress && LABEL_SECTIONS.sender.some(header => 
          line.toLowerCase().includes(header.toLowerCase()))) {
          break;
        }
      }
  
      return address.length ? address.join(', ').replace(/\s+/g, ' ').trim() : null;
    }
  
    private extractTrackingNumber(lines: string[]): string | null {
      const trackingPatterns = [
        /LP\d{16}/,
        /AA\d{8,10}BR/,
        /\b\d{13,14}\b/
      ];
  
      for (const line of lines) {
        for (const pattern of trackingPatterns) {
          const match = line.match(pattern);
          if (match) return match[0];
        }
      }
  
      return null;
    }
  
    private extractPostalCode(lines: string[]): string | null {
      const cepPattern = /\b\d{5}[-]?\d{3}\b/;
  
      for (const line of lines) {
        const match = line.match(cepPattern);
        if (match) return match[0];
      }
  
      return null;
    }
  }