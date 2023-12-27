import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectContext from '../../context/HotelContext';

function EditBook() {
  const { allBookings, changeToggle, allRoomTypes, allRoomNumbers } = useContext(ProjectContext);
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [formData, setFormData] = useState(undefined);
  const [roomTypeChosen, setRoomTypeChosen] = useState('');
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    setFormData({ ...allBookings.filter(book => book.id == bookingId)[0] })
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === 'start_time' || name === 'end_time' || name === 'room') {
      const startTime = new Date(newFormData.start_time);
      const endTime = new Date(newFormData.end_time);
      const durationInHours = (endTime - startTime) / (1000 * 60 * 60);
      const price_type = allRoomNumbers.find((rooms) => rooms.room_number === newFormData.room);
      const price = allRoomTypes.find((roomtype) => roomtype.name === price_type.room_type);

      if (durationInHours >= 0 && price.price_per_hour) {
        const total_price = (durationInHours * price.price_per_hour).toFixed(2);
        newFormData.total_price = total_price;
      }
    }

    setFormData(newFormData);
  };

  const deleteBook = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/bookings/${bookingId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setValidationError(data.message);
        changeToggle();
        setTimeout(() => {
          navigate('/viewBook');
        }, 2000);
      } else {
        console.error('Failed to delete the booking.');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      guest_name: formData.guest_name,
      guest_email: formData.guest_email,
      room: formData.room,
      start_time: formData.start_time,
      end_time: formData.end_time,
      total_price: formData.total_price,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/bookings/${bookingId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setValidationError('Booking updated successfully');
        changeToggle();
        setTimeout(() => {
          navigate('/viewBook');
        }, 2000);
      } else {
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const errorElement = doc.querySelector('.exception_value').innerText;
        setValidationError(errorElement);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (

    <div className="col-span-3 items-start justify-start flex flex-col w-full pt-12 pb-6">
      <div id="yourMessageContainerId" className="w-full items-center align-center justify-center flex flex-col px-12 pt-12 pb-6" >
        <h2 className="font-bold text-xl xl:text-2xl pb-2">Edit Booking</h2>
        <div className="col-span-3 items-start justify-start flex flex-col w-full">
          {formData ? (
            <form onSubmit={handleSubmit} className="w-full items-start justify-start flex flex-col px-12 pb-6">
              {validationError && <div className="text-red-600">{validationError}</div>}
              <br />
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  value={formData.guest_name}
                  onChange={handleChange}
                  name="guest_name"
                  id="guest_name"
                  className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label htmlFor="guest_name" className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Guest Name
                </label>
              </div>
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="email"
                  value={formData.guest_email}
                  onChange={handleChange}
                  name="guest_email"
                  id="guest_email"
                  className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label htmlFor="guest_email" className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Guest Email
                </label>
              </div>
              <div className="relative z-0 w-full mb-6 group">
                <select
                  value={roomTypeChosen}
                  onChange={(e) => setRoomTypeChosen(e.target.value)}
                  name="room_type"
                  id="room_type"
                  className="block cursor-pointer py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                >
                  <option value="" disabled>
                    Select a room type
                  </option>
                  {allRoomTypes.map((roomt) => (
                    <option key={roomt.name} value={roomt.name} disabled={roomt.room_count === 0}>
                      Type {roomt.name} - ₹{roomt.price_per_hour}/Hour
                    </option>
                  ))}
                </select>
                <label
                  htmlFor="room_type"
                  className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Room Type
                </label>
              </div>
              <div className="relative z-0 w-full mb-6 group">
                <select
                  value={formData.room}
                  onChange={handleChange}
                  name="room"
                  id="room"
                  className="block cursor-pointer py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                >
                  <option value="" disabled>
                    Select a room
                  </option>
                  {allRoomNumbers.map((roomt) => {
                    const isRoomTypeMatch = roomt.room_type === roomTypeChosen;
                    return (
                      <option
                        key={roomt.room_number}
                        value={roomt.room_number}
                        disabled={roomt.room_count === 0 || !isRoomTypeMatch}
                      >
                        {roomt.room_number}
                      </option>
                    );
                  })}
                </select>
                <label
                  htmlFor="room"
                  className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Room
                </label>
              </div>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-6 group">
                  {console.log(formData)}
                  <input
                    type="datetime-local"
                    value={formData.start_time?.replace(/:\d{2}Z$/, '')}
                    onChange={handleChange}
                    name="start_time"
                    id="start_time"
                    className="block py-2.5 px-0 w-full text-md text-gray-900 cursor-pointer bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="start_time"
                    className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Start Time
                  </label>
                </div>
                <div className="relative z-0 w-full mb-6 group">
                  <input
                    type="datetime-local"
                    value={formData.end_time?.replace(/:\d{2}Z$/, '')}
                    onChange={handleChange}
                    name="end_time"
                    id="end_time"
                    className="block py-2.5 px-0 w-full text-md text-gray-900 cursor-pointer bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="end_time"
                    className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 cursor-pointer transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    End Time
                  </label>
                </div>
              </div>
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="number"
                  value={formData.total_price}
                  readOnly
                  name="total_price"
                  id="total_price"
                  className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="total_price"
                  className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 cursor-pointer transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Total Price
                </label>
              </div>
              <div className='flex space-x-3'>
                <button
                  type="submit"
                  className="text-black bg-[#89F8B7] hover:bg-[#09ae4e] hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover-bg-blue-700 dark:focus-ring-blue-800"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={deleteBook}
                  className="text-white bg-[#e12f29] hover:bg-[#f1f6f3] hover-text-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover-bg-blue-700 dark:focus-ring-blue-800"
                >
                  Delete
                </button>
              </div>
            </form>
          ) : (
            <p>Loading booking data...</p>
          )}

        </div>
      </div >
    </div >
  );
}

export default EditBook;
