import { useEffect, useState } from "react";

function getTodayDateStr() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export default function Dashboard() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60); // 25 min
  const [isRunning, setIsRunning] = useState(false);
  const [streak, setStreak] = useState(0);

  // Load streak from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("streak");
    const lastDate = localStorage.getItem("lastStudyDate");
    const today = getTodayDateStr();

    if (lastDate === today && saved) {
      setStreak(parseInt(saved));
    } else if (lastDate !== today && saved) {
      // Increment if user comes back on a new day
      setStreak((prev) => {
        const updated = parseInt(saved) + 1;
        localStorage.setItem("streak", updated.toString());
        localStorage.setItem("lastStudyDate", today);
        return updated;
      });
    } else {
      // First time
      localStorage.setItem("streak", "1");
      localStorage.setItem("lastStudyDate", today);
      setStreak(1);
    }
  }, []);

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

  // Format mm:ss
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

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🔥 StudyStreak Dashboard</h1>
      <p style={{ fontSize: "20px", marginTop: "1rem" }}>Streak: {streak} day(s)</p>

      <div style={{ fontSize: "36px", margin: "2rem 0" }}>
        ⏳ {formatTime()}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button onClick={handleStart}>Start</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}
