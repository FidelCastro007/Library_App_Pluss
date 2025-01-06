import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from "./axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Reports() {
  const [bookGenres, setBookGenres] = useState([]);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await axios.get("/books");
        const genres = response.data.reduce((acc, book) => {
          acc[book.genre] = (acc[book.genre] || 0) + 1;
          return acc;
        }, {});

        setBookGenres(Object.entries(genres));
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBookData();
  }, []);

  const chartData = {
    labels: bookGenres.map((genre) => genre[0]),
    datasets: [
      {
        label: 'Books by Genre',
        data: bookGenres.map((genre) => genre[1]),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="report-container">
      <h2>Books by Genre</h2>
      <Bar data={chartData} />
    </div>
  );
}

export default Reports;
