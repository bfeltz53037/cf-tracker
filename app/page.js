"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "cf_tracker_data";

// UI Components
const Card = ({ children }) => (
  <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12, marginBottom: 10, background: "#fff" }}>
    {children}
  </div>
);

const CardContent = ({ children }) => <div>{children}</div>;

const Button = ({ children, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%",
      padding: 12,
      borderRadius: 12,
      border: "none",
      background: "#16a34a",
      color: "#fff",
      fontWeight: 600,
      marginTop: 8,
    }}
  >
    {children}
  </button>
);

// Helpers
const getMinutes = (timeStr) => {
  const match = timeStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

const getColor = (intensity) => {
  if (intensity.includes("high")) return "#fecaca";
  if (intensity.includes("medium")) return "#fde68a";
  return "#bbf7d0";
};

// ✅ TRAINING PLAN
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
      {
        name: "External rotations",
        time: "2 min",
        reps: "2x10/arm",
        intensity: "light resistance",
        link: "https://www.youtube.com/watch?v=ybNV36DoRfY",
      },
      {
        name: "Internal rotations",
        time: "2 min",
        reps: "2x10/arm",
        intensity: "light resistance",
        link: "https://www.youtube.com/watch?v=ZXncuZKonas",
      },
      {
        name: "T pulls",
        time: "2 min",
        reps: "2x10",
        intensity: "light",
        link: "https://www.youtube.com/watch?v=JObYtU7Y7ag",
      },
      {
        name: "Y raises",
        time: "2 min",
        reps: "2x8",
        intensity: "light",
        link: "https://www.youtube.com/watch?v=dZCqXOO0QVU",
      },
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
      {
        name: "Drop step",
        time: "3 min",
        reps: "5 each side",
        intensity: "medium",
        link: "https://www.youtube.com/watch?v=qvwkdxepqTk",
      },
      {
        name: "Fly balls",
        time: "5 min",
        reps: "10 reps",
        intensity: "medium",
        link: "https://www.youtube.com/watch?v=nnE7K4A4Vg4",
      },
      {
        name: "Field & throw",
        time: "5 min",
        reps: "8–10 reps",
        intensity: "medium",
        link: "https://www.youtube.com/watch?v=ynikkQcF3Ec",
      },
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
];

// ✅ MAIN COMPONENT
export default function Tracker() {
  const [checked, setChecked] = useState({});
  const [streak, setStreak] = useState(0);
  const [lastCompleted, setLastCompleted] = useState(null);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setChecked(data.checked || {});
      setStreak(data.streak || 0);
      setLastCompleted(data.lastCompleted || null);
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ checked, streak, lastCompleted })
    );
  }, [checked, streak, lastCompleted]);

  const toggle = (key) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0);
  const completed = Object.values(checked).filter(Boolean).length;

  const totalTime = sections.reduce(
    (acc, s) => acc + s.items.reduce((sum, item) => sum + getMinutes(item.time), 0),
    0
  );

  // ✅ STREAK LOGIC
  const completeDay = () => {
    const today = new Date().toDateString();

    if (completed >= totalItems * 0.8) {
      if (lastCompleted) {
        const prev = new Date(lastCompleted);
        const diff = (new Date(today) - prev) / (1000 * 60 * 60 * 24);
        setStreak(diff === 1 ? streak + 1 : 1);
      } else {
        setStreak(1);
      }
      setLastCompleted(today);
    }

    setChecked({});
  };

  return (
    <div style={{ padding: 16, maxWidth: 420, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>⚾ Daily Tracker</h1>

      {/* Stats */}
      <Card>
        <CardContent style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <small>✅ Progress</small>
            <div><b>{completed}/{totalItems}</b></div>
          </div>
          <div>
            <small>🔥 Streak</small>
            <div><b>{streak}</b></div>
          </div>
        </CardContent>
      </Card>

      {/* Time */}
      <Card>
        <CardContent style={{ textAlign: "center" }}>
          ⏱ Estimated Workout Time: <b>{totalTime} min</b>
        </CardContent>
      </Card>

      {/* Sections */}
      {sections.map((section) => (
        <Card key={section.title}>
          <CardContent>
            <b>{section.title}</b>

            {section.items.map((item, i) => {
              const key = section.title + i;

              return (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 6,
                    background: getColor(item.intensity),
                    padding: 6,
                    borderRadius: 8,
                  }}
                >
                  <span>
                    <b>{item.name}</b><br />
                    <small>{item.time} • {item.reps} • {item.intensity}</small>

                    {item.link && (
                      <div>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 12,
                            color: "#2563eb",
                            fontWeight: 600,
                          }}
                        >
                          ▶ Watch Drill
                        </a>
                      </div>
                    )}
                  </span>

                  <button
                    onClick={() => toggle(key)}
                    style={{ width: 24, height: 24, borderRadius: 12 }}
                  >
                    {checked[key] ? "✓" : ""}
                  </button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      {/* Finish */}
      <Button onClick={completeDay}>✅ Finish Day</Button>

      {/* Motivation */}
      <Card>
        <CardContent style={{ textAlign: "center", fontSize: 12 }}>
          🔔 Hustle every rep. Quality over quantity.
        </CardContent>
      </Card>
    </div>
  );
}
