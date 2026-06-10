"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "cf_tracker_data";

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
      background: "#2563eb",
      color: "#fff",
      fontWeight: 600,
      marginTop: 6,
    }}
  >
    {children}
  </button>
);

const getMinutes = (timeStr) => {
  const match = timeStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

const getColor = (intensity) => {
  if (intensity.includes("high")) return "#fecaca";
  if (intensity.includes("medium")) return "#fde68a";
  return "#bbf7d0";
};

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
        link: "https://www.youtube.com/watch?v=F3n6k0HnXgQ",
      },
      {
        name: "Internal rotations",
        time: "2 min",
        reps: "2x10/arm",
        intensity: "light resistance",
        link: "https://www.youtube.com/watch?v=VdXW9rT4s2M",
      },
      {
        name: "T pulls",
        time: "2 min",
        reps: "2x10",
        intensity: "light",
        link: "https://www.youtube.com/watch?v=9wZ0Z8b3w9g",
      },
      {
        name: "Y raises",
        time: "2 min",
        reps: "2x8",
        intensity: "light",
        link: "https://www.youtube.com/watch?v=Z9K9s8zO0bQ",
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
        link: "https://www.youtube.com/watch?v=7rAdbVEWEik",
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
];

export default function Tracker() {
  const [checked, setChecked] = useState({});

  const toggle = (key) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ padding: 16, maxWidth: 420, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>⚾ Daily Tracker</h1>

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
                    <b>{item.name}</b>
                    <br />
                    <small>
                      {item.time} • {item.reps} • {item.intensity}
                    </small>

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
    </div>
  );
}
