# Generated by Django 5.1.1 on 2024-10-29 04:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('community', '0006_communitypost_liked_by'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='communitypost',
            name='likes',
        ),
    ]
