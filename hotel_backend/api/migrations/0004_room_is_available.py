# Generated by Django 4.2.6 on 2023-10-12 05:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_roomtype_room_count'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='is_available',
            field=models.BooleanField(default=True),
        ),
    ]