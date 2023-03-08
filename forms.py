from flask_wtf import Form
from wtforms import StringField, SelectField, SubmitField, validators, ValidationError, PasswordField

class RegisterForm(Form):
    name = StringField('Name', [validators.DataRequired('Please enter your name.')])
    email = StringField('Email', [validators.DataRequired('Please enter your email address.'), validators.Email('Please '+
    'enter your email address.')])
    password = PasswordField('Password', [validators.DataRequired('Please set a password.'),
    validators.Length(min=8, max=12, message='Password must be at least 8 characters long.')])
    user = SelectField('Signup as:', choices=[('std', 'Student'), ('stf', 'Staff'), ('vis', 'Visitor')])
    submit = SubmitField('Signup')