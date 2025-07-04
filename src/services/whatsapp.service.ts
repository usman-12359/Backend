// whatsapp.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsAppService {

  private readonly apiUrl = process.env.ZENVIA_API_URL;
  private readonly apiToken = process.env.ZENVIA_API_TOKEN;
  cleanPhoneNumber(phone) {
    return phone.replace(/\D/g, '');
  }
  async sendWhatsAppMessage(to: string, message: string): Promise<void> {
    to = this.cleanPhoneNumber(`${to}`)
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          "from": "suporte140",
          "to": to,
          "contents": [
            {
              "type": "text",
              "text": message
            }
          ]
        },
        {
          headers: {
            "X-API-TOKEN": this.apiToken,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log("🚀 ~ WhatsAppService ~ sendWhatsAppMessage ~ response:", response)
    } catch (error) {
      console.error(
        'Error sending WhatsApp message:',
        error.response?.data || error.message,
      );
    }
  }
}
