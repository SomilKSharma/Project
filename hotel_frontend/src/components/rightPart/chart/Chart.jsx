import React, { useContext } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import ProjectContext from "../../../context/HotelContext";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

// Constants
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Function to get month-wise data for the chart
const getPastAndFutureMonthYearLabels = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const labels = [];

  // Generate labels for the past 3 months
  for (let i = 2; i >= 0; i--) {
    const month = (currentMonth - i + 12) % 12; // Ensure the month is within 0 to 11 range
    labels.push(`${months[month]} ${currentYear}`);
  }

  // Generate labels for the next 3 months
  for (let i = 1; i <= 3; i++) {
    const month = (currentMonth + i) % 12; // Ensure the month is within 0 to 11 range
    const year = currentYear + Math.floor((currentMonth + i) / 12); // Adjust year if needed
    labels.push(`${months[month]} ${year}`);
  }

  return labels;
};

const getPastAndFutureMonthYearWiseData = (allBookings) => {
  const monthYearData = {};


  allBookings.forEach((booking) => {
    const bookingDate = new Date(booking.start_time);
    const year = bookingDate.getFullYear();
    const month = bookingDate.getMonth();

    if (!monthYearData[year]) {
      monthYearData[year] = Array.from({ length: 12 }, () => 0);
    }

    monthYearData[year][month]++;
  });

  const labels = getPastAndFutureMonthYearLabels();

  const data = labels.map((label) => {
    const [month, year] = label.split(' ');
    return monthYearData[parseInt(year)]?.[months.indexOf(month)] || 0;
  });

  return {
    labels,
    datasets: [
      {
        fill: true,
        label: "Month-Year-wise Bookings",
        data,
        borderColor: "rgb(1, 152, 117,0.5)",
        backgroundColor: "rgba(104, 195, 163,0.05)",
      },
    ],
  };
};


// Chart options
export const options = {
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        stepSize: 1, // Set the step size to 1 to ensure integer ticks
      },
    },
  },
};

// Component for displaying the chart
function Chart() {
  const { allBookings } = useContext(ProjectContext);
  const chartData = getPastAndFutureMonthYearWiseData(allBookings);

  return <Line data={chartData} options={options} height="50px" width="200px" style={{ marginTop: "50px", marginBottom: "20px" }} />;
}

export default Chart;
