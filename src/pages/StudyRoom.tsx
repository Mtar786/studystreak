import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function StudyRoom() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Timer logic
  useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft <= 0) {
      setIsRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const formatTime = () => {
    const m = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
    const s = (secondsLeft % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStart = () => setIsRunning(true);
  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(25 * 60);
  };

  // Camera access
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Could not access camera. Please allow camera access.");
        console.error(err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>📚 Study Room</h2>

      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "320px",
            height: "240px",
            marginBottom: "1rem",
            border: "2px solid #ccc",
          }}
        />
      )}

      <div style={{ fontSize: "36px", margin: "1rem 0" }}>
        ⏳ {formatTime()}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={handleStart}>Start</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      <Link to="/">
        <button style={{ background: "#eee", padding: "0.5rem 1rem", border: "1px solid #aaa" }}>
          ← Back to Dashboard
        </button>
      </Link>
    </div>
  );
}
