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
      background: "#2563eb",
      color: "#fff",
      fontWeight: 600,
      marginTop: 6,
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

// ✅ ALL DRILLS WITH LINKS INCLUDED
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
