from flask import Flask, render_template, request, jsonify
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

app = Flask(__name__)

# List to store newsletter subscriptions
subscribers = []

# Email configuration
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USER = os.environ.get('EMAIL_USER', 'woffy@onwords.in')
EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD', '')
EMAIL_FROM = os.environ.get('EMAIL_FROM', 'woffy@onwords.in')

def send_confirmation_email(recipient_email):
    """Send a confirmation email to new subscribers"""
    # Only attempt to send if we have credentials
    if not EMAIL_PASSWORD:
        print("Email password not set. Skipping confirmation email.")
        return False
        
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = EMAIL_FROM
        msg['To'] = recipient_email
        msg['Subject'] = "Welcome to Woffy.ai Newsletter!"
        
        # Email body
        body = f"""
        <html>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                <h1 style="color: #7b68ee; margin-bottom: 20px;">Thank You for Subscribing!</h1>
                
                <p>Hello from Woffy.ai,</p>
                
                <p>Thank you for subscribing to our newsletter. We're excited to keep you updated on our journey to bring Woffy.ai to life!</p>
                
                <p>You'll receive updates about:</p>
                <ul>
                    <li>Development progress</li>
                    <li>New features</li>
                    <li>Launch information</li>
                    <li>Early access opportunities</li>
                </ul>
                
                <p>Follow us on Instagram: <a href="https://www.instagram.com/woffy.ai" style="color: #7b68ee; text-decoration: none;">@woffy.ai</a></p>
                
                <p style="margin-top: 30px;">Warm regards,<br>The Woffy.ai Team</p>
            </div>
        </body>
        </html>
        """
        
        # Attach HTML content
        msg.attach(MIMEText(body, 'html'))
        
        # Connect to server and send
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Failed to send confirmation email: {e}")
        return False

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/features')
def features():
    return render_template('features.html')

@app.route('/roadmap')
def roadmap():
    return render_template('roadmap.html')

@app.route('/subscribe', methods=['POST'])
def subscribe():
    email = request.form.get('email')
    if email and email not in subscribers:
        # Add to subscribers list
        subscribers.append(email)
        
        # Send confirmation email
        email_sent = send_confirmation_email(email)
        
        if email_sent:
            return jsonify({"success": True, "message": "Thank you! Confirmation email sent."})
        else:
            return jsonify({"success": True, "message": "Subscribed! (Email delivery inactive)"})
            
    elif email in subscribers:
        return jsonify({"success": True, "message": "You're already subscribed!"})
    else:
        return jsonify({"success": False, "message": "Invalid email address"})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
else:
    # For production with gunicorn
    # This will be used when deployed to Render
    app.config['PREFERRED_URL_SCHEME'] = 'https'
    
# Configure for production
port = int(os.environ.get("PORT", 5000))