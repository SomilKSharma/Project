import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectContext from '../../context/HotelContext';
import * as api from './api'; // Import API constants

function NewBook() {
  const { changeToggle, allRoomTypes, allRoomNumbers } = useContext(ProjectContext);
  const navigate = useNavigate();
  const [roomTypeChosen, setRoomTypeChosen] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    room: '',
    start_time: '',
    end_time: '',
    total_price: ''

  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === 'start_time' || name === 'end_time' || name === 'room') {
      // Calculate total_price based on start_time, end_time, and selected room
      const startTime = new Date(newFormData.start_time);
      const endTime = new Date(newFormData.end_time);

      // Check if the start date is before today
      const today = new Date();
      if (startTime < today) {
        setValidationError('Start date must be after today.');
        setFormData({ ...formData, ["start_time"]: "", ["end_time"]: "", ["total_price"]: "" });
        return;
      } else {
        setValidationError(null);
      }

      const durationInHours = (endTime - startTime) / (1000 * 60 * 60);
      const price_type = allRoomNumbers.find((rooms) => rooms.room_number === newFormData.room);
      const price = allRoomTypes.find((roomtype) => roomtype.name === price_type.room_type);

      if (durationInHours >= 0 && price.price_per_hour) {
        const total_price = (durationInHours * price.price_per_hour).toFixed(2);
        newFormData.total_price = total_price;
        setValidationError(null);
      } else if (durationInHours < 0) {
        setValidationError('End must be after start date.');
        setFormData({ ...formData, ["start_time"]: "", ["end_time"]: "", ["total_price"]: "" });
        return;
      }
    }

    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validationError) {
      setValidationError("Can't submit form till all requirements are met.")
      return;
    }

    const requestData = {
      guest_name: formData.guest_name,
      guest_email: formData.guest_email,
      room: formData.room,
      start_time: formData.start_time,
      end_time: formData.end_time,
      total_price: formData.total_price,
    };

    fetch(api.BOOKINGS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.status === 201) {
          setSubmissionStatus('Booking Created');
          changeToggle();
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          response.text().then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const errorElement = doc.querySelector('.exception_value').innerText;
            setValidationError(errorElement);
          });
        }
      });
  };

  return (
    <div className="col-span-3 items-start justify-start flex flex-col w-full pt-12 pb-6">
      <div id="yourMessageContainerId" className="w-full items-center align-center justify-center flex flex-col px-12 pt-12 pb-6">
        <h2 className="font-bold text-xl xl:text-2xl pb-2 ">Create a New Booking</h2>
        <form onSubmit={handleSubmit} id="yourFormId" className="w-full items-start justify-start flex flex-col px-12 pt-12 pb-6">
          {validationError && <div className="text-red-600"> {validationError} </div>}
          {submissionStatus && <div className="text-green-500"> {submissionStatus} </div>}
          <br />
          <div className="relative z-0 w-full mb-6 group">
            <input type="text" value={formData.guest_name} onChange={handleChange} name="guest_name" id="guest_name" className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label htmlFor="guest_name" className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Guest Name</label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input type="email" value={formData.guest_email} onChange={handleChange} name="guest_email" id="guest_email" className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label htmlFor="guest_email" className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Guest Email</label>
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
              <option value="" disabled>Select a room type</option>
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
              <option key={'hold_dummy'} value="" disabled>Select a room</option>
              {allRoomNumbers.map((roomt) => {
                return (
                  <option
                    key={roomt.room_number}
                    value={roomt.room_number}
                    disabled={roomt.room_count === 0 || !(roomt.room_type === roomTypeChosen)}
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
              <input type="datetime-local" value={formData.start_time} onChange={handleChange} name="start_time" id="start_time" className="block py-2.5 px-0 w-full text-md text-gray-900 cursor-pointer bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label htmlFor="start_time" className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Start Time</label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input type="datetime-local" value={formData.end_time} onChange={handleChange} name="end_time" id="end_time" className="block py-2.5 px-0 w-full text-md text-gray-900 cursor-pointer bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label htmlFor="end_time" className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 cursor-pointer transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">End Time</label>
            </div>

          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input type="number" value={formData.total_price} readOnly name="total_price" id="total_price" className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label htmlFor="total_price" className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 cursor-pointer transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Total Price</label>
          </div>
          <button type="submit" className="text-black bg-[#89F8B7] hover:bg-[#09ae4e] hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
      </div>
    </div>
  );

}

export default NewBook;
