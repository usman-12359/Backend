export const welcomeEmail = (name: string, condominiumId: string) => {
  return {
    SUBJECT: `Chegou Sua Encomenda – Boas-vindas! 🎉`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda – Boas Vindas e Instruções de Acesso</title>
        </head>
        <body>
          <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
            <div style="padding: 0 15px;">
                <p>Prezado(a) administrador(a) do ${name},</p>
                <p>É um prazer tê-lo(a) conosco no Chegou Sua Encomenda!</p>
                <p>Parabéns por dar um grande passo para simplificar a vida dos condôminos do ${name}!</p>
                <br/>
                <p>Agora você faz parte de um sistema pensado para simplificar e agilizar a gestão de encomendas com praticidade e segurança.</p>
                <p>Qualquer dúvida, crítica, elogio ou sugestão, sinta-se à vontade para nos contatar pelo e-mail suporte@chegousuaencomenda.com.br.</p>
                <br/>
                <p>Seja muito bem-vindo(a)!</p>
                <br/>
                <p>Atenciosamente,</p>
                <p>Equipe Chegou Sua Encomenda</p>
            </div>
            <p><br></p>
            <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
              Copyright &copy; Chegou Sua Encomenda. Todos os Direitos Reservados
            </div>
          </div>
        </body>
        </html>
        `,
  };
};
export const adminVerificationEmailOnSubscriberSignup = (name: string) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Registro com Sucesso`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Registro com Sucesso</title>
        </head>
        <body>
          <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
            <div style="padding: 0 15px;">
                <p>Olá,/p>
                <p>Obrigado por se tornar um membro da nossa equipe! Estamos muito felizes em ter você conosco.</p>
                <p>Sua conta foi criada com sucesso. Nossa equipe irá verificar o pagamento e ativar sua conta</p>
                <p><strong> Obrigado,</strong><br/>Chegou Sua Encomenda</p>
            </div>
            <p><br></p>
            <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
              Copyright &copy; Chegou Sua Encomenda. Todos os Direitos Reservados
            </div>
          </div>
        </body>
        </html>
        `,
  };
};

export const accountApprovalEmail = (name: string) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - E-mail de aprovação de conta`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - E-mail de aprovação de conta</title>
        </head>
        <body> <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
            <div style="padding: 0 15px;">
                <p>Olá,/p>
                <p>Sua conta foi aprovada pelo administrador. Por favor, faça o login na conta usando seu ID de e-mail.</p>
                <p><strong> Obrigado,</strong><br/>Chegou Sua Encomenda</p>
            </div>
            <p><br></p>
            <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
              Copyright &copy; Chegou Sua Encomenda. Todos os Direitos Reservados
            </div>
          </div>
        </body>
        </html>
        `,
  };
};
export const verifyEmail = (name: string, otp: number) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Verifique Seu Email por OTP`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Verifique Seu Email por OTP</title>
        </head>
        <body> <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
            <div style="padding: 0 15px;">
                <p>Olá,</p>
                <p>Seu código de verificação é <strong>${otp}</strong></p>
                <p>Insira o código para confirmar seu registro.</p>
                <p><strong> Obrigado,</strong><br/>Chegou Sua Encomenda</p>
            </div>
            <p><br></p>
            <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
              Copyright &copy; Chegou Sua Encomenda. Todos os Direitos Reservados
            </div>
          </div>
        </body>
        </html>
        `,
  };
};

export const setNewPassword = (name: string, url: string) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Definir Sua Senha`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Definir Sua Senha</title>
        </head>
        <body> <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
            <div style="padding: 0 15px;">
                <p>Olá,/p>
                <p>Obrigado por se tornar um membro da nossa equipe! Estamos muito felizes em ter você conosco.</p>
                <p>Para definir sua senha, por favor clique <strong><a href=${url} target="_blank">aqui</a></strong></p>
                <p><strong> Obrigado,</strong><br/>Chegou Sua Encomenda</p>
            </div>
            <p><br></p>
            <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
              Copyright &copy; Chegou Sua Encomenda. Todos os Direitos Reservados
            </div>
          </div>
        </body>
        </html>
        `,
  };
};

export const forgotPassword = (name: string, otp: string) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Esqueceu a Senha`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Esqueceu a Senha</title>
        </head>
        <body> <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
            <div style="padding: 0 15px;">
                <p>Olá,/p>
                <p>Seu código OTP é <strong>${otp}</strong>.</p>
                <p><strong> Obrigado,</strong><br/>Chegou Sua Encomenda</p>
            </div>
            <p><br></p>
            <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
              Copyright &copy; Chegou Sua Encomenda. Todos os Direitos Reservados
            </div>
          </div>
        </body>
        </html>
        `,
  };
};

export const accountVerified = (name: string) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Conta Verificada`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Conta Verificada</title>
        </head>
        <body> 
          <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
              <div style="padding: 0 15px;">
                  <p>Olá,/p>
                  <p>Obrigado por se tornar um membro da nossa equipe! Estamos muito felizes em ter você conosco.</p>
                  <p><strong>Sua conta foi verificada.</strong></p>
                  <p><strong> Obrigado,</strong><br/>Chegou Sua Encomenda</p>
              </div>
              <p><br></p>
              <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
                Copyright &copy; Chegou Sua Encomenda. Todos os Direitos Reservados
              </div>
          </div>
        </body>
        </html>
        `,
  };
};
export const parcelAtGateHouse = (name: string) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Aviso de Recebimento`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Aviso de Recebimento</title>
        </head>
        <body> 
          <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
              <div style="padding: 0 15px;">
                  <p>Olá ${name},</p>
                  <p>Acabamos de receber uma encomenda para voce! Por favor, retire-a na portaria assim que tiver disponibilidade.</p>
                  <p><strong> Obrigado,</strong><br/>Chegou Sua Encomenda</p>
              </div>
              <p><br></p>
              <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
                Copyright &copy; Chegou Sua Encomenda. Todos os Direitos Reservados
              </div>
          </div>
        </body>
        </html> 
        `,
  };
};
export const parcelCollected = (name: string) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Parcela coletada`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Parcela coletada</title>
        </head>
        <body> 
          <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
              <div style="padding: 0 15px;">
                  <p>Olá ${name},/p>
                  <p>Você retirou sua encomenda na portaria.</p>
                  <p><strong> Obrigado,</strong><br/>Chegou Sua Encomenda</p>
              </div>
              <p><br></p>
              <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
                Copyright &copy; Chegou Sua Encomenda. Todos os Direitos Reservados
              </div>
          </div>
        </body>
        </html>
        `,
  };
}
export const contactQueryReceived = (name: string) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Consulta enviada`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Consulta enviada</title>
        </head>
        <body> <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
           <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
            <div style="padding: 0 15px;">
                <p>Olá ${name},/p>
                <p>Sua consulta foi recebida. Um de nossos representantes entrará em contato em breve.</p>
                <p><strong> Obrigado,</strong><br/>Chegou Sua Encomenda</p>
            </div>
            <p><br></p>
            <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
              Copyright &copy; Chegou Sua Encomenda. Todos os Direitos Reservados
            </div>
          </div>
        </body>
        </html>
        `,
  };
}
export const contactQueryReceivedAdmin = (data: any) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Consulta enviada`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Consulta enviada</title>
        </head>
        <body> <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
            <div style="padding: 0 15px;">
                <p>Olá,/p>
                <p>Você recebeu uma nova consulta. Seguem os detalhes:</p>
                <p>
                    <strong>Nome: </strong> ${data.firstName} ${data.lastName} <br/>
                    <strong>Email: </strong> ${data.email} <br/>
                    <strong>Contato: </strong> ${data.contact}</p>
                <p><strong>Consulta: </strong> ${data.query}
                </p>
                <p><strong> Obrigado,</strong><br/>Chegou Sua Encomenda</p>
            </div>
            <p><br></p>
            <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
              Copyright &copy; Chegou Sua Encomenda. Todos os Direitos Reservados
            </div>
          </div>
        </body>
        </html>
        `,
  };
}
