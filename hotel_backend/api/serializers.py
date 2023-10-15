from rest_framework.serializers import ModelSerializer
from .models import *


class RoomTypeSerializer(ModelSerializer):
    class Meta:
        model = RoomType
        fields = ['name', 'price_per_hour', 'room_count']


class RoomSerializer(ModelSerializer):
    class Meta:
        model = Room
        fields = ['room_number', 'room_type']


class BookingSerializer(ModelSerializer):
    class Meta:
        model = Booking
        fields = ['guest_name', 'guest_email', 'room',
                  'start_time', 'end_time', 'total_price', 'id']
