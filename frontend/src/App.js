import React, { useEffect, useState } from "react";

function App() {
  const [liveScore, setLiveScore] = useState("Waiting for updates...");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLiveScore(`Match ${data.matchId}: ${data.score}`);
    };
    return () => socket.close();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontSize: "2rem" }}>
      <h1>Live Cricekt Score</h1>
      <p>{liveScore}</p>
    </div>
  );
}

export default App;
