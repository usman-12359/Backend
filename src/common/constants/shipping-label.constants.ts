// shipping-label.config.ts
export const TESSERACT_CONFIG = {
    lang: 'por+eng',
    oem: 1,
    psm: 3,
};

export const LABEL_SECTIONS = {
    recipient: ['DESTINATÁRIO', 'To:', 'Recebedor:', 'Recebido por:'],
    sender: ['REMETENTE', 'Remetente:', 'From:'],
    phone: ['Tel:', 'Telefone:', 'Phone:'],
    address: ['Address:', 'Endereço:', 'Rua', 'Avenida']
} as const;