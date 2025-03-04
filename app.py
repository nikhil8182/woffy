from flask import Flask, render_template

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True, port=5001)
else:
    # For production with gunicorn
    # This will be used when deployed to Render
    app.config['PREFERRED_URL_SCHEME'] = 'https'
    
# Configure for production
import os
port = int(os.environ.get("PORT", 5000))