import React, { useState } from "react";

function App() {
  const [randomNumber, setRandomNumber] = useState(null);

  const regenerateNumber = async () => {
    try {
      const response = await fetch(`/regenerate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRandomNumber(data.randomNumber);
      } else {
        console.error("Failed to regenerate number");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Random Number Generator</h1>
      <button onClick={regenerateNumber} style={buttonStyle}>
        Regenerate Random Number
      </button>
      {randomNumber !== null && (
        <div style={{ marginTop: "20px" }}>
          <h2>Current Random Number:</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{randomNumber}</p>
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
};

export default App;
