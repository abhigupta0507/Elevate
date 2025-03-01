import random
import string
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

def generate_otp():
    # Generate a 6-digit OTP
    
    return ''.join(random.choices(string.digits, k=6))

def send_otp_email(email, otp):
    subject = 'Account Verification OTP'
    message = f'Your OTP for account verification is: {otp}. This OTP is valid for 10 minutes.'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    
    send_mail(subject, message, email_from, recipient_list)

def is_otp_valid(user):
    # Check if OTP exists and is not expired (valid for 10 minutes)
    if not user.otp or not user.otp_created_at:
        return False
    
    expiry_time = user.otp_created_at + timedelta(minutes=10)
    return timezone.now() <= expiry_time