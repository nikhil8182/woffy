from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

# List to store newsletter subscriptions
subscribers = []

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
        subscribers.append(email)
        return jsonify({"success": True, "message": "Thank you for subscribing!"})
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