from flask import Flask, render_template, request, flash
from forms import RegisterForm

app = Flask(__name__, template_folder='templates')
app.secret_key = 'some key'

@app.route('/')
def index():
    return render_template('index.html')

#registration form
@app.route('/signup', methods = ['GET', 'POST'])
def signup():
    form = RegisterForm()
    if request.method == 'POST':
        if form.validate() == False:
            flash('All fields are required!')
            return render_template('signup.html', form = form)
        else:
            return render_template('app.html')
    elif request.method == 'GET':
        return render_template('signup.html', form = form)

#search
@app.route('/search', methods = ['POST', 'GET'])
def search():
    form = RegisterForm()
    # if request.method == 'POST':
    return render_template('app.html', form = form)
    # return render_template('index.html')

if __name__==('__main__'):
    app.run(debug=True)
