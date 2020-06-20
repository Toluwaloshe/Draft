from flask import Flask, render_template, json

# Create an instance of our Flask app.
app = Flask(__name__)

# Set route
@app.route('/')
def index():
    
    # Return the template with the teams list passed in
    return render_template('index.html')

@app.route('/summary')
def index():
    
    # Return the template with the teams list passed in
    return render_template('summary.html')

@app.route('/participation')
def index():
    
    # Return the template with the teams list passed in
    return render_template('participation.html')

@app.route('/gdp')
def index():
    
    # Return the template with the teams list passed in
    return render_template('gdp.html')

if __name__ == "__main__":
    app.run(debug=True)
