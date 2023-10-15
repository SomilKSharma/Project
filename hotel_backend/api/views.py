from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Room, Booking, RoomType
from .serializers import BookingSerializer, RoomTypeSerializer, RoomSerializer



@api_view(['POST'])
def create_booking(request):
    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
        booking = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Create view for editing a booking
@api_view(['PUT'])
def edit_booking(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)
    serializer = BookingSerializer(booking, data=request.data, partial=True)
    if serializer.is_valid():
        booking = serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Create view for deleting a booking
@api_view(['DELETE'])
def delete_booking(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)
    if booking.is_cancellable()[0]:
        
        message = booking.is_cancellable()[1]
        booking.delete()
        return Response({"message": message}, status=status.HTTP_200_OK)
    return Response("Cannot cancel the booking.", status=status.HTTP_400_BAD_REQUEST)

# Create view for viewing all bookings
@api_view(['GET'])
def view_all_bookings(request):
    current_time = timezone.now()
    bookings = Booking.objects.filter(end_time__gte=current_time)
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def view_all_room_types(request):
    room_types = RoomType.objects.all()

    room_type_data = RoomTypeSerializer(
        room_types, many=True).data  # Use the appropriate serializer

    return Response(room_type_data)


@api_view(['GET'])
def view_all_rooms(request):
    # Query all rooms
    rooms = Room.objects.all()

  
    room_data = RoomSerializer(rooms, many=True).data

    return Response(room_data)


# Create view for viewing a specific booking
@api_view(['GET'])
def view_booking(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)
    serializer = BookingSerializer(booking)
    return Response(serializer.data)
