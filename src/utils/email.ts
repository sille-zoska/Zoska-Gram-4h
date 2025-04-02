import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email using SendGrid
 */
export const sendEmail = async ({ to, subject, html }: SendEmailProps): Promise<boolean> => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY is not defined in environment variables');
      return false;
    }

    if (!process.env.EMAIL_FROM) {
      console.error('EMAIL_FROM is not defined in environment variables');
      return false;
    }

    const msg = {
      to,
      from: process.env.EMAIL_FROM,
      subject,
      html,
    };

    // If we're in development mode, log the email content instead of sending
    if (process.env.NODE_ENV === 'development' && process.env.DISABLE_EMAIL_SENDING === 'true') {
      console.log('Email sending disabled in development. Would have sent:');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Verification Code:', html.match(/<div class="code">(.*?)<\/div>/)?.[1] || 'Code not found');
      return true;
    }

    await sgMail.send(msg);
    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);

    // Define proper type for SendGrid error
    interface SendGridError {
      response?: {
        status: number;
        body: unknown;
        headers: Record<string, string>;
      };
    }

    // Type guard to check if error is SendGrid error
    const isSendGridError = (err: unknown): err is SendGridError => {
      return typeof err === 'object' && err !== null && 'response' in err;
    };

    // Log more detailed error information if available
    if (isSendGridError(error) && error.response) {
      console.error('SendGrid error details:', {
        status: error.response.status,
        body: error.response.body,
        headers: error.response.headers
      });
    }

    return false;
  }
};

/**
 * Generates HTML content for verification email
 */
export const generateVerificationEmailHTML = (code: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Overovací kód pre ZoškaGram</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 40px 30px;
          background: linear-gradient(to bottom right, #ffffff, #fafafa);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }
        .header {
          text-align: center;
          padding: 0 0 32px;
          border-bottom: 1px solid #eaeaea;
          margin-bottom: 32px;
        }
        .logo-container {
          display: inline-block;
          position: relative;
          margin-bottom: 24px;
        }
        .logo {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(45deg, #FF385C, #1DA1F2);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }
        .beta-badge {
          display: inline-block;
          background: linear-gradient(45deg, #FF385C, #1DA1F2);
          color: white;
          font-size: 12px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 12px;
          position: absolute;
          top: -8px;
          right: -24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        .code-container {
          margin: 32px 0;
          text-align: center;
          padding: 24px;
          background: linear-gradient(135deg, rgba(255,56,92,0.03), rgba(29,161,242,0.03));
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }
        .code {
          font-size: 40px;
          font-weight: 700;
          letter-spacing: 12px;
          color: #1a1a1a;
          padding: 16px 24px;
          background-color: white;
          border-radius: 12px;
          display: inline-block;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 0, 0, 0.08);
        }
        .message {
          margin: 24px 0;
          font-size: 16px;
          color: #4a4a4a;
          text-align: center;
          padding: 0 24px;
        }
        .warning {
          font-size: 14px;
          color: #666;
          text-align: center;
          padding: 16px 24px;
          background-color: rgba(255, 56, 92, 0.05);
          border-radius: 8px;
          margin: 24px 0;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 14px;
          color: #666;
          padding-top: 24px;
          border-top: 1px solid #eaeaea;
        }
        .highlight {
          color: #1DA1F2;
          font-weight: 600;
        }
        .button {
          display: inline-block;
          padding: 14px 28px;
          background: linear-gradient(45deg, #FF385C, #1DA1F2);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        @media (max-width: 600px) {
          .container {
            margin: 20px;
            padding: 30px 20px;
          }
          .code {
            font-size: 32px;
            letter-spacing: 8px;
            padding: 12px 16px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-container">
            <div class="logo">ZoškaGram</div>
            <span class="beta-badge">BETA</span>
          </div>
        </div>
        
        <div class="message">
          <strong>Vitajte v ZoškaGram!</strong><br>
          Na dokončenie registrácie zadajte tento overovací kód:
        </div>
        
        <div class="code-container">
          <div class="code">${code}</div>
        </div>
        
        <div class="warning">
          ⚠️ Tento kód je platný 30 minút. Ak ste si účet nevytvorili, môžete túto správu ignorovať.
        </div>
        
        <div class="message">
          S pozdravom,<br>
          <span class="highlight">Tím ZoškaGram</span>
        </div>
        
        <div class="footer">
          &copy; ${new Date().getFullYear()} ZoškaGram. Všetky práva vyhradené.
        </div>
      </div>
    </body>
    </html>
  `;
}; 