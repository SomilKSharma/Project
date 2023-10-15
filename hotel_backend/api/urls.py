from django.urls import path
from . import views

urlpatterns = [
    path('bookings/', views.create_booking, name='create_booking'),
    path('bookings/<int:booking_id>/', views.edit_booking, name='edit_booking'),
    path('bookings/<int:booking_id>/delete/',
         views.delete_booking, name='delete_booking'),
    path('bookings/view/all/', views.view_all_bookings, name='view_all_bookings'),
    path('bookings/view/<int:booking_id>/',
         views.view_booking, name='view_booking'),
    path('bookings/view/roomtype/', views.view_all_room_types,
         name='view_all_room_types'),
    path('bookings/view/rooms/', views.view_all_rooms,
         name='view_all_rooms'),

]
