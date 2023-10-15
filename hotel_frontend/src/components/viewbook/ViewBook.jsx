import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewBook = () => {
  const navigate = useNavigate();

  const handleEditClick = (booking) => {
    // Use the booking ID to construct the route and navigate to it
    navigate(`/editBook/${booking.id}`);
  };

  const [book, setBook] = useState([]);
  const [filters, setFilters] = useState({
    room: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    bookings();
  }, []);

  const bookings = async () => {
    let response = await fetch('http://127.0.0.1:8000/bookings/view/all/');
    let data = await response.json();
    setBook(data);
  };

  const filterBookings = () => {
    const filteredBookings = book.filter((booking) => {
      // Check if the room, start date, and end date match the filter values
      const roomMatch = booking.room.toLowerCase().includes(filters.room.toLowerCase());
      const startDateMatch = booking.start_time.includes(filters.startDate);
      const endDateMatch = booking.end_time.includes(filters.endDate);

      return roomMatch && startDateMatch && endDateMatch;
    });

    return filteredBookings;
  };

  return (
    <div className="px-5 py-5 justify-center col-span-10">
      <h1 className="font-bold text-xl xl:text-2xl pb-2">View Bookings</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="hidden sm:table-cell px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Room
              </th>
              <th scope="col" className="hidden sm:table-cell px-6 py-3">
                Start
              </th>
              <th scope="col" className="hidden sm:table-cell px-6 py-3">
                End
              </th>
            </tr>
          </thead>
          <tbody>
            {filterBookings().map((booking, index) => (
              // Render filtered bookings
              <tr
                key={index}
                className="bg-white cursor-pointer border-b dark:bg-gray-800 dark:border-gray-700"
                onClick={() => handleEditClick(booking)}
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {booking.guest_name.toLowerCase()}
                </td>
                <td className="hidden sm:table-cell px-6 py-4">{booking.guest_email}</td>
                <td className="px-6 py-4">{booking.room}</td>
                <td className="hidden sm:table-cell px-6 py-4">
                  {new Date(booking.start_time).toLocaleString()}
                </td>
                <td className="hidden sm:table-cell px-6 py-4">
                  {new Date(booking.end_time).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="font-bold text-l xl:text-xl pt-10 pb-2">Filter Fields</h3>
      {/* Add filter input fields */}
      <div className="m-4">
        <input
          type="text"
          placeholder="Room"
          value={filters.room}
          onChange={(e) => setFilters({ ...filters, room: e.target.value })}
          className="w-64 px-2 py-1 rounded border border-gray-300 m-2"
        />
        <input
          type="text"
          placeholder="Start Date YYYY-MM-DD"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          className="w-64 px-2 py-1 rounded border border-gray-300 m-2"
        />
        <input
          type="text"
          placeholder="End Date YYYY-MM-DD"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          className="w-64 px-2 py-1 rounded border border-gray-300 m-2"
        />
      </div>
    </div>
  );
};

export default ViewBook;
