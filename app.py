from flask import Flask, render_template, request, flash, redirect, url_for
from forms import RegisterForm, LoginForm
from flask_sqlalchemy import SQLAlchemy
import os
from sqlalchemy.sql import func
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_required, current_user, login_user, LoginManager, UserMixin, logout_user

SECRET_KEY = os.urandom(32)
basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__, template_folder='templates')
app.config['SQLALCHEMY_DATABASE_URI'] =\
        'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] =SECRET_KEY

#Initialise the DataBase
db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)

#Create User Model
class Users(db.Model, UserMixin):
    id= db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String(100), nullable=False)
    email= db.Column(db.String(100), nullable=False, unique=True)
    password= db.Column(db.String(225), nullable=False)
    age=db.Column(db.Integer)
    created_at = db.Column(db.DateTime(timezone=True),
                        server_default=func.now())
    userType= db.Column(db.String(20), nullable=False)

#Create Search Model
class Search(db.Model, UserMixin):
    searchid= db.Column(db.Integer, primary_key=True)
    original_destination= db.Column(db.String(200), nullable=False)
    target_destination= db.Column(db.String(200), nullable=False, unique=True)

#Create Feedback Model
class Feedback(db.Model, UserMixin):
    post_id= db.Column(db.Integer, primary_key=True)
    user_feedback= db.Column(db.Text)

@login_manager.user_loader
def user_loader(user_id):
    return Users.query.get(user_id)

@app.route('/')
def index():
    return render_template('index.html')

#registration form
@app.route('/signup', methods = ['GET', 'POST'])
def signup():
    form = RegisterForm()
    try:
        if request.method == 'POST':
            name = request.form.get('name')
            email = request.form.get('email')
            password = request.form.get('password')
            user_type = request.form.get('user_type')
            age=request.form.get('age')

            user = Users.query.filter_by(email=email).first() # if this returns a user, then the email already exists in database
            user_n = Users.query.filter_by(name=name).first() # if this returns a user, then the username already exists in database

            if user or user_n: # if a user exist, reload page
                flash('User already exists')
                return redirect(url_for('signup'))
            elif len(password) < 8:
                flash('password must be at least 8 characters.')
                return redirect(url_for('signup'))
            else:
                # create a new user with the form data. Hash the password.
                new_user = Users(email=email, name=name, age=age, password=generate_password_hash(password, method='sha256'), userType=user_type)

                # add the new user to the database
                db.session.add(new_user)
                db.session.commit()
                return redirect(url_for('login'))
    except:
        db.session.rollback()
    finally:
        db.session.close()
        
    return render_template('signup.html', form = form)

@app.route('/login', methods=['POST', 'GET'])
def login():
    form = LoginForm()
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = Users.query.filter_by(email=email).first()

        # check if user exists
        # take the user-supplied password, hash it, and compare it to the hashed password in the database
        if not user or not check_password_hash(user.password, password):
            flash('Wrong login details, try again.')
            return redirect(url_for('login')) # if the user doesn't exist or password is wrong, reload the page
        else:
            login_user(user, remember=True)
            return redirect(url_for('search'))
    return render_template('login.html', form=form)

#search
@app.route('/search', methods = ['POST', 'GET'])
@login_required
def search():
    # if request.method == 'POST':
    return render_template('app.html', name=current_user.name)
    # return render_template('index.html')

@app.route('/create-feedback/', methods=('GET', 'POST'))
def create_feedback():
	if request.method == 'POST':
		text = request.form.get('textarea')
		feedback = Feedback(user_feedback=text)
		db.session.add(feedback)
		db.session.commit()

		return redirect(url_for('search'))

	return render_template('feedback.html')

@app.route('/viewfeed')
def viewfeed():
    feedbacks = Feedback.query.all()
    return render_template('viewfeed.html', feedbacks=feedbacks)

@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name, email=current_user.email, 
        user_type=current_user.userType, age=current_user.age, created_at=current_user.created_at)

@app.route("/logout", methods=["GET"])
@login_required
def logout():
    """Logout current user."""
    if request.method == 'GET':
        try:
            user = current_user
            user.authenticated = False
            db.session.add(user)
            db.session.commit()
            logout_user()
            return redirect(url_for("login.html"))
        except:
            db.session.rollback()
        finally:
            db.session.close()
    return redirect(url_for('search'))

if __name__==('__main__'):
    app.run(debug=True)
