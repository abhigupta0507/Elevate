from django.core.mail import send_mail
send_mail(
    'Test Email',
    'This is a test message.',
    'Elevate <abhishekgupta39585@gmail.com>',
    ['abhishekguptakherla@gmail.com'],  # Replace with your email address for testing
    fail_silently=False,
)
