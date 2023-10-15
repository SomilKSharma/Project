from django.db import models
from decimal import Decimal
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings


class RoomType(models.Model):
    name = models.CharField(max_length=50, unique=True)
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    room_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


class Room(models.Model):
    room_number = models.CharField(max_length=10, unique=True)
    room_type = models.ForeignKey(
        RoomType, to_field='name', on_delete=models.CASCADE)

    def __str__(self):
        return self.room_number


@receiver(post_save, sender=Room)
@receiver(post_delete, sender=Room)
def update_room_count(sender, instance, **kwargs):
    room_type = instance.room_type

    room_count = Room.objects.filter(room_type=room_type).count()

    RoomType.objects.filter(id=room_type.id).update(room_count=room_count)


class Booking(models.Model):
    id = models.AutoField(primary_key=True)
    guest_name = models.CharField(max_length=100, default='XX', null=False)
    guest_email = models.EmailField(null=False, default='xx@xx.xx')
    room = models.ForeignKey(
        Room, to_field='room_number', on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    total_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f"Booking #{self.id} for {self.room.room_number}"

    def save(self, *args, **kwargs):
        room_type = self.room.room_type
        price_per_hour = room_type.price_per_hour

        hours_booked = Decimal(
            (self.end_time - self.start_time).total_seconds() / 3600)

        if hours_booked <= 0:
            raise ValueError("End time must be greater than start time.")

        self.total_price = price_per_hour * hours_booked

        if Booking.objects.filter(room=self.room, start_time__lt=self.end_time, end_time__gt=self.start_time).exclude(pk=self.pk).exists():
            raise ValueError(
                "Overlapping bookings for the same room are not allowed.")

        super().save(*args, **kwargs)

        # Send an email to the user
        # subject = 'Booking Confirmation'
        # message = f'Your booking for Room {self.room.room_number} has been confirmed.'
        # from_email = settings.DEFAULT_FROM_EMAIL
        # recipient_list = [self.guest_email]

        # send_mail(subject, message, from_email, recipient_list)

    def is_cancellable(self):
        current_time = timezone.now()
        time_difference = self.start_time - current_time

        if time_difference >= timezone.timedelta(hours=48):
            return True, 'Complete Refund'
        elif timezone.timedelta(hours=24) <= time_difference < timezone.timedelta(hours=48):
            return True, '50% Refund'
        else:
            return True, 'No Refund'
