"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cf_tracker_data";


const sections = [
  { title: "Warm-Up", items: ["Arm circles", "Torso twists", "Jog / high knees", "Side shuffles"] },
  { title: "Band Work", items: ["External rotations", "Internal rotations", "T pulls", "Y raises"] },
  { title: "Throwing", items: ["Short catch", "Build distance", "Accurate throws"] },
  { title: "Outfield Drills", items: ["Drop step", "Fly balls", "Field & throw"] },
  { title: "Speed", items: ["Short sprints", "Reaction runs", "Change direction"] },
  { title: "Strength", items: ["Squats", "Lunges", "Jumps", "Balance"] },
  { title: "Cool Down", items: ["Stretch", "Breathing"] },
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

  // LOAD from localStorage
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
  // SAVE to localStorage
  useEffect(() => {
    const data = { checked, goal, streak, lastCompleted };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [checked, goal, streak, lastCompleted]);


  const toggle = (key) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Timer
  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);


  const resetTimer = () => {
    setTimer(0);
    setRunning(false);
  };

  const completeDay = () => {
    const today = new Date().toDateString();


    if (completed >= totalItems * 0.8) {
      if (lastCompleted) {
        const prev = new Date(lastCompleted);
        const diff = (new Date(today) - prev) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          setStreak((s) => s + 1);
        } else {
          setStreak(1);
        }
      } else {
        setStreak(1);
      }
      setLastCompleted(today);
    }


    setChecked({});
  };

  const perfectDay = completed === totalItems && totalItems > 0;
  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold text-center">⚾ Daily Tracker</h1>


      {/* Goal */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-3">
          <h2 className="font-semibold">🏆 Goal of the Day</h2>
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full border rounded p-1 mt-1 text-sm"
          />
        </CardContent>
      </Card>

      {/* Score + Streak */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-3 flex justify-between text-center">
          <div>
            <div className="text-sm">Score</div>
            <div className="text-lg font-bold">{completed}/{totalItems}</div>
          </div>
          <div>
            <div className="text-sm">🔥 Streak</div>
            <div className="text-lg font-bold">{streak}</div>
          </div>
        </CardContent>
      </Card>

      {/* Perfect Day Badge */}
      {perfectDay && (
        <Card className="rounded-2xl shadow bg-green-100 border-green-400">
          <CardContent className="p-3 text-center font-semibold">
            ⭐ Perfect Day! All tasks completed!
          </CardContent>
        </Card>
      )}
      {/* Timer */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-3 text-center">
          <div className="font-semibold">⏱ Timer</div>
          <div className="text-lg">{Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}</div>
          <div className="space-x-2 mt-2">
            <Button onClick={() => setRunning(true)}>Start</Button>
            <Button onClick={() => setRunning(false)}>Pause</Button>
            <Button onClick={resetTimer}>Reset</Button>
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      {sections.map((section) => (
        <Card key={section.title} className="rounded-2xl shadow">
          <CardContent className="p-3">
            <h2 className="font-semibold mb-2">{section.title}</h2>
            {section.items.map((item, i) => {
              const key = section.title + i;
              return (
                <div key={key} className="flex items-center justify-between py-1">
                  <span>{item}</span>
                  <button
                    onClick={() => toggle(key)}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center ${checked[key] ? "bg-green-500 text-white" : "bg-white"}`}
                  >
                    {checked[key] ? "✓" : ""}
                  </button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      {/* Actions */}
      <Button onClick={completeDay} className="w-full rounded-2xl">
        ✅ Finish Day
      </Button>

      {/* Reminder */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-3 text-sm text-center">
          🔔 Reminder: Hustle every rep. Quality over quantity.
        </CardContent>
      </Card>
    </div>
  );
}
