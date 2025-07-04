export const BOARDTYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export const getHtmlUserRegisterContent = (username, verificationLink) => {
  const htmlMailContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Trello Account</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
            margin: 0;
            padding: 0;
            background-color: #f4f4f7;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #0079BF;
            color: #ffffff;
            padding: 24px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 32px;
            line-height: 1.6;
        }
        .content p {
            margin: 0 0 24px;
        }
        .button-container {
            text-align: center;
            margin: 24px 0;
        }
        .button {
            background-color: #0079BF;
            color: #ffffff !important;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
        }
        .footer {
            background-color: #f4f4f7;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
        .footer p {
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Trello-Clone!</h1>
        </div>
        <div class="content">
            <h3>Hello ${username},</h3>
            <p>Thank you for registering. Please click the button below to verify your email address and complete your registration.</p>
            <div class="button-container">
                <a href="${verificationLink}" class="button">Verify Your Email</a>
            </div>
            <p>Sincerely,<br>The Trello-Clone Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 Trello-Clone. All rights reserved.</p>
            <p>You are receiving this email because you registered for an account on our platform.</p>
        </div>
    </div>
</body>
</html>`

  return htmlMailContent
}

