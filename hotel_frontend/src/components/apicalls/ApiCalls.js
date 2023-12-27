import { useContext, useEffect } from 'react'
import ProjectContext from '../../context/HotelContext'
import * as api from './api'; // Import API constants


function ApiCalls() {
    const { getAllBookings, toggle, getAllRoomNumbers, getAllRoomTypes } = useContext(ProjectContext);
    useEffect(() => {
        bookings();

    }, [toggle]);

    useEffect(() => {
        fetchRoomTypes();
        fetchRoomNumbers();
    }, []);

    const bookings = async () => {
        let response = await fetch(api.ALL_BOOKINGS_URL);
        let data = await response.json();
        getAllBookings(data);
    };

    const fetchRoomTypes = async () => {
        try {
            const response = await fetch(api.BOOKINGS_ROOMTYPE_URL);
            const data = await response.json();
            getAllRoomTypes(data);
        } catch (error) {
            console.error('Error fetching room types:', error);
        }
    };

    const fetchRoomNumbers = async () => {
        try {
            const response = await fetch(api.BOOKINGS_ROOMS_URL);
            const data = await response.json();
            getAllRoomNumbers(data);
        } catch (error) {
            console.error('Error fetching room numbers:', error);
        }
    };
}

export default ApiCalls;