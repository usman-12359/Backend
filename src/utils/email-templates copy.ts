export const adminVerificationEmailOnSubscriberSignup = (name: string) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Registration Success`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Registration Success</title>
        </head>
        <body>
          <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
            <div style="padding: 0 15px;">
                <p>Hi<strong> ${name},</strong></p>
                <p>Thank you for becoming a member of our team! We're excited to have you on board.</p>
                <p>Your account has been successfully created. Our team will verify the payment and activate your account</p>
                <p><strong>Best regards,</strong><br/>The Chegou Sua Encomenda Team</p>
            </div>
            <p><br></p>
            <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
              Copyright &copy; Chegou Sua Encomenda. All Rights Reserved
            </div>
          </div>
        </body>
        </html>
        `,
  };
};
export const verifyEmail = (name: string, otp: number) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Verify Your email by OTP`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Verify Your email by OTP</title>
        </head>
        <body> <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
            <div style="padding: 0 15px;">
                <p>Hi<strong> ${name},</strong></p>
                <p>Thank you for becoming a member of our team! We're excited to have you on board.</p>
                <p>Your OTP is <strong>${otp}</strong>.
                Verify Your email by OTP.</p>
                <p><strong>Best regards,</strong><br/>The Chegou Sua Encomenda Team</p>
            </div>
            <p><br></p>
            <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
              Copyright &copy; Chegou Sua Encomenda. All Rights Reserved
            </div>
          </div>
        </body>
        </html>
        `,
  };
};

export const setNewPassword = (name: string, url: string) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Set Your Password`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Set Your Password</title>
        </head>
        <body> <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
            <div style="padding: 0 15px;">
                <p>Hi<strong> ${name},</strong></p>
                <p>Thank you for becoming a member of our team! We're excited to have you on board.</p>
                <p>To set your password please click <strong><a href=${url} target="_blank">here</a></strong></p>
                <p><strong>Best regards,</strong><br/>The Chegou Sua Encomenda Team</p>
            </div>
            <p><br></p>
            <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
              Copyright &copy; Chegou Sua Encomenda. All Rights Reserved
            </div>
          </div>
        </body>
        </html>
        `,
  };
};

export const forgotPassword = (name: string, otp: string) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Forgot Password`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Forgot Password</title>
        </head>
        <body> <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
            <div style="padding: 0 15px;">
                <p>Hi<strong> ${name},</strong></p>
                <p>Your OTP is <strong>${otp}</strong>.
                <p><strong>Best regards,</strong><br/>The Chegou Sua Encomenda Team</p>
            </div>
            <p><br></p>
            <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
              Copyright &copy; Chegou Sua Encomenda. All Rights Reserved
            </div>
          </div>
        </body>
        </html>
        `,
  };
};

export const accountVerified = (name: string) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Account Verified`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Account Verified</title>
        </head>
        <body> 
          <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
              <div style="padding: 0 15px;">
                  <p>Hi<strong> ${name},</strong></p>
                  <p>Thank you for becoming a member of our team! We're excited to have you on board.</p>
                  <p><strong>Your account has been verified.</strong>.</p>
                  <p><strong>Best regards,</strong><br/>The Chegou Sua Encomenda Team</p>
              </div>
              <p><br></p>
              <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
                Copyright &copy; Chegou Sua Encomenda. All Rights Reserved
              </div>
          </div>
        </body>
        </html>
        `,
  };
};
export const parcelAtGateHouse = (name: string) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Parcel Notification`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Parcel Notification</title>
        </head>
        <body> 
          <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
              <div style="padding: 0 15px;">
                  <p>Hi<strong> ${name},</strong></p>
                  <p>Acabamos de receber uma encomenda para voce! Por favor, retire-a na portaria assim que tiver disponibilidade.</p>
                  <p><strong> Obrigado,</strong><br/>Chegou Sua Encomenda</p>
              </div>
              <p><br></p>
              <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
                Copyright &copy; Chegou Sua Encomenda. All Rights Reserved
              </div>
          </div>
        </body>
        </html>
        `,
  };
};
export const parcelCollected = (name: string) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Parcel Collected`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Parcel Collected</title>
        </head>
        <body> 
          <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
              <div style="padding: 0 15px;">
                  <p>Hi<strong> ${name},</strong></p>
                  <p>You have collected the parcel from the gatehouse.</p>
                  <p><strong>Best regards,</strong><br/>The Chegou Sua Encomenda Team</p>
              </div>
              <p><br></p>
              <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
                Copyright &copy; Chegou Sua Encomenda. All Rights Reserved
              </div>
          </div>
        </body>
        </html>
        `,
  };
}
export const contactQueryReceived = (name: string) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Query Submitted`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Verify Your email by OTP</title>
        </head>
        <body> <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
           <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
            <div style="padding: 0 15px;">
                <p>Hi<strong> ${name},</strong></p>
                <p>Your query has been recieved. One of our representative will contact you soon.</p>
                <p><strong>Best regards,</strong><br/>The Chegou Sua Encomenda Team</p>
            </div>
            <p><br></p>
            <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
              Copyright &copy; Chegou Sua Encomenda. All Rights Reserved
            </div>
          </div>
        </body>
        </html>
        `,
  };
}
export const contactQueryReceivedAdmin = (data: any) => {
  return {
    SUBJECT: `Chegou Sua Encomenda - Query Received`,
    HTML: `
        <html>
        <head>
            <meta charset="utf-8">
            <title>Chegou Sua Encomenda - Verify Your email by OTP</title>
        </head>
        <body> <div style="background-color: #fbfbfb; color: #222; font-size: 16px; line-height: 22px; margin: auto; max-width: 600px; position: relative; width: 100%;">
            <div style="background-size: cover; padding: 30px 0px 30px; text-align: center; width: 100%;background: #F36B31;">
              <!--<img src="${process.env.EMAIL_LOGO_URL}" alt="Logo">-->
              <h2 style="color:white; margin:auto;font-family: sans-serif;">Chegou Sua Encomenda</h2>
            </div>
            <div style="padding: 0 15px;">
                <p>Hi</p>
                <p>You have received a contact query. Following are the details</p>
                <p>
                    <strong>Name: </strong> ${data.firstName} ${data.lastName} <br/>
                <strong>Email: </strong> ${data.email} <br/>
                <strong>Contact: </strong> ${data.contact}</p>
                <p><strong>Query: </strong> ${data.query}
                </p>
                <p><strong>Best regards,</strong><br/>The Chegou Sua Encomenda Team</p>
            </div>
            <p><br></p>
            <div style="background-color: #F36B31; color: #fff; font-family: sans-serif; font-size: 13px; padding: 10px 20px 10px; text-align: center;">
              Copyright &copy; Chegou Sua Encomenda. All Rights Reserved
            </div>
          </div>
        </body>
        </html>
        `,
  };
}
