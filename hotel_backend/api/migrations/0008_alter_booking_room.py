# Generated by Django 4.2.6 on 2023-10-13 07:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_remove_booking_cancellation_policy'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking',
            name='room',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.room', to_field='room_number'),
        ),
    ]
