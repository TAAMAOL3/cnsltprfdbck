import React, { useState, useEffect } from "react";
import axios from "axios";

const Status = () => {
  const [dbStatus, setDbStatus] = useState("Checking...");
  const [dbMessage, setDbMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/dbXstatus")
      .then((response) => {
        if (response.data.status === 'success') {
          setDbStatus("Connected to the database");
          setDbMessage(response.data.message);
        } else if (response.data.status === 'warning') {
          setDbStatus("Connected, but no data found");
          setDbMessage(response.data.message);
        } else {
          setDbStatus("Failed to connect to the database");
          setDbMessage(response.data.message);
        }
      })
      .catch((err) => {
        setDbStatus("Failed to connect to the database");
        setDbMessage("An error occurred");
        setError(err.message);
      });
  }, []);

  return (
    <div>
      <h2>System Status</h2>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Verbunden mit:</td>
            <td>{process.env.REACT_APP_URL_HOST}</td>
          </tr>
          <tr>
            <td>Azure MySQL Host:</td>
            <td>{process.env.REACT_APP_AZURE_MYSQL_HOST}</td>
          </tr>
          <tr>
            <td>Verbunden mit Datenbank:</td>
            <td style={{ color: dbStatus === 'Connected to the database' ? 'green' : 'red' }}>
              {dbMessage}
            </td>
          </tr>
        </tbody>
      </table>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default Status;
