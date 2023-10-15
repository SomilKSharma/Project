# Generated by Django 4.2.6 on 2023-10-12 05:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_remove_room_is_available'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='cancellation_policy',
            field=models.CharField(choices=[('FULL', 'Full Refund'), ('PARTIAL', '50% Refund'), ('NO', 'No Refund')], default='NO', max_length=10),
        ),
    ]
