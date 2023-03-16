from flask_wtf import Form
from wtforms import StringField, SelectField, SubmitField, validators, PasswordField, SearchField

class RegisterForm(Form):
    submit = SubmitField('Signup')

class LoginForm(Form):
    submit = SubmitField('Login')