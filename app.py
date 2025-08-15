from flask import Flask, render_template, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Email configuration
MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
MAIL_USERNAME = os.getenv('MAIL_USERNAME')
MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', MAIL_USERNAME)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        data = request.get_json()
        recipient = data.get('email', 'phuccb04@gmail.com')
        subject = data.get('subject', 'Happy Birthday')
        
        # Send email
        success = send_mail(recipient, subject)
        
        if success:
            return jsonify({'success': True, 'message': 'Email sent successfully!'})
        else:
            return jsonify({'success': False, 'message': 'Failed to send email'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

def send_mail(to, subject):
    msg = MIMEMultipart()
    msg['From'] = MAIL_DEFAULT_SENDER
    msg['To'] = to
    msg['Subject'] = subject
    # NHAY SO SERIAL VA SO THE CAO
    cardNumber = "1234-5678-9012-3456"
    cardSerial = "1234567890123456"
    # 
    body = f"""
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 30px;">
    <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 30px;">
      <h2 style="color: #4CAF50; text-align: center;">🎉 Chúc mừng bạn! 🎉</h2>
      <p>Xin chào <b>{to}</b>,</p>
      <p>Chúng tôi rất vui được thông báo rằng bạn đã nhận được phần thưởng:</p>
      <div style="background: #e3fcec; border-left: 5px solid #4CAF50; padding: 16px; margin: 20px 0;">
        <b>1 thẻ cào điện thoại mệnh giá <span style="color: #e91e63;">2 tỏi</span></b>
      </div>
      <p style="margin-bottom: 8px;">Mã thẻ cào của bạn:</p>
      <div style="font-size: 1.3em; letter-spacing: 2px; background: #f1f1f1; padding: 12px; border-radius: 6px; text-align: center; margin-bottom: 20px;">
        <b>{cardNumber}</b>
      </div>
      <p style="margin-bottom: 8px;">Mã serial thẻ cào của bạn:</p>
      <div style="font-size: 1.3em; letter-spacing: 2px; background: #f1f1f1; padding: 12px; border-radius: 6px; text-align: center; margin-bottom: 20px;">
        <b>{cardSerial}</b>
      </div>
      <p>Chúc mừng bạn đã tham gia và nhận được phần thưởng này!</p>
      <p style="text-align: center; margin-top: 30px;">Snvv! </p>
    </div>
  </body>
</html>
"""
    msg.attach(MIMEText(body, 'html'))
    
    try:
        server = smtplib.SMTP(MAIL_SERVER, MAIL_PORT)
        if MAIL_USE_TLS:
            server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_DEFAULT_SENDER, to, msg.as_string())
        server.quit()
        print(f"Mail sent to {to} successfully.")
        return True
    except Exception as e:
        print(f"Failed to send mail: {e}")
        return False

if __name__ == '__main__':
    app.run(debug=True)