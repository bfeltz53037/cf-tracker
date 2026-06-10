"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "cf_tracker_data";

// Simple UI components
const Card = ({ children }) => (
  <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12, marginBottom: 10, background: "#fff" }}>{children}</div>
);
const CardContent = ({ children }) => <div>{children}</div>;
const Button = ({ children, onClick }) => (
  <button onClick={onClick} style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", background: "#2563eb", color: "#fff", fontWeight: 600 }}>{children}</button>
);

// Utility: convert "X min" to number
const getMinutes = (timeStr) => {
  const match = timeStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

// Color coding
const getColor = (intensity) => {
  if (intensity.includes("high")) return "#fecaca"; // red
  if (intensity.includes("medium")) return "#fde68a"; // yellow
  return "#bbf7d0"; // green/light
};

// Sections
const sections = [
  {
    title: "Warm-Up",
    items: [
      { name: "Arm circles", time: "1 min", reps: "10 fwd / 10 back", intensity: "light" },
      { name: "Torso twists", time: "1 min", reps: "10/side", intensity: "light" },
      { name: "Jog / high knees", time: "2 min", reps: "continuous", intensity: "light" },
      { name: "Side shuffles", time: "1 min", reps: "2x each way", intensity: "light" },
    ],
  },
  {
    title: "Band Work",
    items: [
      { name: "External rotations", time: "2 min", reps: "2x10/arm", intensity: "light resistance" },
      { name: "Internal rotations", time: "2 min", reps: "2x10/arm", intensity: "light resistance" },
      { name: "T pulls", time: "2 min", reps: "2x10", intensity: "light" },
      { name: "Y raises", time: "2 min", reps: "2x8", intensity: "light" },
    ],
  },
  {
    title: "Throwing",
    items: [
      { name: "Short catch", time: "3 min", reps: "easy throws", intensity: "light" },
      { name: "Build distance", time: "5 min", reps: "gradual", intensity: "medium" },
      { name: "Accurate throws", time: "5 min", reps: "5–10 reps", intensity: "medium" },
    ],
  },
  {
    title: "Outfield Drills",
    items: [
      { name: "Drop step", time: "3 min", reps: "5 each side", intensity: "medium" },
      { name: "Fly balls", time: "5 min", reps: "10 reps", intensity: "medium" },
      { name: "Field & throw", time: "5 min", reps: "8–10 reps", intensity: "medium" },
    ],
  },
  {
    title: "Speed",
    items: [
      { name: "Short sprints", time: "5 min", reps: "5 reps (10–20 yd)", intensity: "high" },
      { name: "Reaction runs", time: "3 min", reps: "3 reps", intensity: "high" },
      { name: "Change direction", time: "3 min", reps: "3 reps", intensity: "high" },
    ],
  },
  {
    title: "Strength",
    items: [
      { name: "Squats", time: "2 min", reps: "2x10", intensity: "medium" },
      { name: "Lunges", time: "2 min", reps: "2x8/leg", intensity: "medium" },
      { name: "Jumps", time: "2 min", reps: "3x5", intensity: "high effort" },
      { name: "Balance", time: "2 min", reps: "20 sec/leg", intensity: "light" },
    ],
  },
  {
    title: "Cool Down",
    items: [
      { name: "Stretch", time: "2 min", reps: "hold", intensity: "light" },
      { name: "Breathing", time: "1 min", reps: "deep breaths", intensity: "light" },
    ],
  },
];

export default function Tracker() {
  const [checked, setChecked] = useState({});
  const [goal, setGoal] = useState("Quick first step + accurate throws");
  const [streak, setStreak] = useState(0);
  const [lastCompleted, setLastCompleted] = useState(null);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);

  const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0);
  const completed = Object.values(checked).filter(Boolean).length;

  const totalTime = sections.reduce(
    (acc, s) => acc + s.items.reduce((sum, item) => sum + getMinutes(item.time), 0),
    0
  );

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setChecked(data.checked || {});
      setGoal(data.goal || "");
      setStreak(data.streak || 0);
      setLastCompleted(data.lastCompleted || null);
    }
  }, []);

  useEffect(() => {
    const data = { checked, goal, streak, lastCompleted };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [checked, goal, streak, lastCompleted]);

  const toggle = (key) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    let interval;
    if (running) interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const resetTimer = () => { setTimer(0); setRunning(false); };

  const completeDay = () => {
    const today = new Date().toDateString();
    if (completed >= totalItems * 0.8) {
      if (lastCompleted) {
        const prev = new Date(lastCompleted);
        const diff = (new Date(today) - prev) / (1000 * 60 * 60 * 24);
        setStreak(diff === 1 ? (s) => s + 1 : 1);
      } else setStreak(1);
      setLastCompleted(today);
    }
    setChecked({});
  };

  const perfectDay = completed === totalItems && totalItems > 0;

  return (
    <div style={{ padding: 16, maxWidth: 420, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>⚾ Daily Tracker</h1>

      <Card>
        <CardContent>
          <b>🏆 Goal of the Day</b>
          <input value={goal} onChange={(e) => setGoal(e.target.value)} style={{ width: "100%", marginTop: 6, padding: 6 }} />
        </CardContent>
      </Card>

      <Card>
        <CardContent style={{ display: "flex", justifyContent: "space-between" }}>
          <div><small>Score</small><div><b>{completed}/{totalItems}</b></div></div>
          <div><small>🔥 Streak</small><div><b>{streak}</b></div></div>
        </CardContent>
      </Card>

      <Card>
        <CardContent style={{ textAlign: "center" }}>
          <b>⏱ Estimated Workout Time: {totalTime} min</b>
        </CardContent>
      </Card>

      {perfectDay && (
        <Card>
          <CardContent style={{ textAlign: "center" }}>⭐ Perfect Day! All tasks completed!</CardContent>
        </Card>
      )}

      <Card>
        <CardContent style={{ textAlign: "center" }}>
          ⏱ {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}
          <div style={{ marginTop: 8 }}>
            <Button onClick={() => setRunning(true)}>Start</Button>
            <Button onClick={() => setRunning(false)}>Pause</Button>
            <Button onClick={resetTimer}>Reset</Button>
          </div>
        </CardContent>
      </Card>

      {sections.map((section) => (
        <Card key={section.title}>
          <CardContent>
            <b>{section.title}</b>
            {section.items.map((item, i) => {
              const key = section.title + i;
              return (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", marginTop: 6, background: getColor(item.intensity), padding: 6, borderRadius: 8 }}>
                  <span>
                    {item.name}<br />
                    <small>{item.time} • {item.reps} • {item.intensity}</small>
                  </span>
                  <button onClick={() => toggle(key)} style={{ width: 24, height: 24, borderRadius: 12 }}>
                    {checked[key] ? "✓" : ""}
                  </button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      <Button onClick={completeDay}>✅ Finish Day</Button>

      <Card>
        <CardContent style={{ textAlign: "center", fontSize: 12 }}>
          🔔 Hustle every rep. Quality over quantity.
        </CardContent>
      </Card>
    </div>
  );
}
