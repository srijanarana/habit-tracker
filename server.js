const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// -------------------------
// Full habit list (from your file)
// -------------------------
const habitNames = [
  "Drink more water",
  "Meditate daily",
  "Walk 5,000 steps",
  "Read 10 pages",
  "Sleep before 11 PM",
  "No sugar after 7 PM",
  "Stretch for 5 minutes",
  "Practice gratitude",
  "Write a journal entry",
  "Plan tomorrow’s tasks",
  "Avoid phone after waking",
  "10-minute workout",
  "Eat one fruit a day",
  "Study for 30 minutes",
  "Limit screen time",
  "Practice deep breathing",
  "Clean workspace",
  "Learn a new skill",
  "Cook a homemade meal",
  "Take vitamins",
  "Go for a short walk",
  "No caffeine after 4 PM",
  "Track expenses",
  "Practice a hobby",
  "Listen to an educational podcast"
];

// -------------------------
// ORIGINAL-TYPE Recommendation Engine
// -------------------------
const recommendationsEngine = {
  "Drink more water": [
    "Drink 1 glass after waking",
    "Carry a bottle everywhere",
    "Set hourly hydration reminders"
  ],
  "Meditate daily": [
    "Try 5-minute breathing",
    "Use a guided meditation",
    "Do a body-scan tonight"
  ],
  "Walk 5,000 steps": [
    "Take a 10-minute walk after meals",
    "Track steps using phone/watch",
    "Walk while listening to music"
  ],
  "Read 10 pages": [
    "Read before bed",
    "Use a 10-minute timer",
    "Carry your book in your bag"
  ],
  "Sleep before 11 PM": [
    "Avoid screens after 10:30",
    "Set a fixed bedtime alarm",
    "Wind down with soft music"
  ],
  "No sugar after 7 PM": [
    "Replace dessert with fruit",
    "Brush teeth early",
    "Drink peppermint tea"
  ],
  "Stretch for 5 minutes": [
    "Do morning stretch",
    "Try desk stretching every 2 hours",
    "Follow 5-min YouTube stretch"
  ],
  "Practice gratitude": [
    "Write 3 good things",
    "Text someone your gratitude",
    "Reflect on the best part of the day"
  ],
  "Write a journal entry": [
    "Use simple prompts",
    "Journal for 5 minutes",
    "Write without judging"
  ],
  "Plan tomorrow’s tasks": [
    "Write 3 MITs",
    "Check your calendar",
    "Block time for important tasks"
  ],
  "Avoid phone after waking": [
    "Leave phone outside bedroom",
    "Stretch before using phone",
    "Use an alarm clock"
  ],
  "10-minute workout": [
    "Try a HIIT video",
    "Do squats/pushups/planks",
    "Follow Chloe Ting 10-min"
  ],
  "Eat one fruit a day": [
    "Carry fruit with you",
    "Prep fruit in a box",
    "Replace junk snacks"
  ],
  "Study for 30 minutes": [
    "Use Pomodoro 25+5",
    "Study the hardest topic first",
    "Turn off notifications"
  ],
  "Limit screen time": [
    "Set app timers",
    "Avoid doomscrolling",
    "Replace with reading"
  ],
  "Practice deep breathing": [
    "Try 4-7-8 breathing",
    "Do 2 minutes before sleep",
    "Use Calm breathing animation"
  ],
  "Clean workspace": [
    "Do a 5-min desk reset",
    "Organize cables",
    "Keep only essentials on desk"
  ],
  "Learn a new skill": [
    "Practice 15 minutes today",
    "Break skill into small steps",
    "Learn from YouTube/course"
  ],
  "Cook a homemade meal": [
    "Try a simple recipe",
    "Prepare ingredients early",
    "Cook one-pot meals"
  ],
  "Take vitamins": [
    "Keep vitamins near breakfast",
    "Set a daily reminder",
    "Take with food"
  ],
  "Go for a short walk": [
    "Take an evening stroll",
    "Walk during calls",
    "Take stairs instead of lift"
  ],
  "No caffeine after 4 PM": [
    "Switch to herbal tea",
    "Track caffeine intake",
    "Avoid late coffee"
  ],
  "Track expenses": [
    "Note expenses immediately",
    "Use an expense app",
    "Review weekly"
  ],
  "Practice a hobby": [
    "Do it for 15 minutes",
    "Keep materials ready",
    "Join an online community"
  ],
  "Listen to an educational podcast": [
    "Save episodes beforehand",
    "Listen during walks",
    "Write 1 takeaway"
  ]
};

// -------------------------
// Construct habit objects
// -------------------------
let habits = habitNames.map((name, index) => ({
  id: index + 1,
  name,
  todayDone: false,
  streak: 0,
  freezeTokens: 1,
  history: [],
  priority: 3,
  recommendations: recommendationsEngine[name] || ["No recommendations available"]
}));

// -------------------------
// Helper
// -------------------------
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// -------------------------
// Mark Done
// -------------------------
app.post("/habits/:id/today", (req, res) => {
  const habit = habits.find(h => h.id == req.params.id);
  if (!habit) return res.status(404).json({ message: "Habit not found" });

  if (!habit.todayDone) {
    habit.todayDone = true;
    habit.streak++;
    habit.history.push({ date: todayStr(), done: true });
  }

  res.json({ message: "Marked done", habit });
});

// -------------------------
// Freeze
// -------------------------
app.post("/habits/:id/freeze", (req, res) => {
  const habit = habits.find(h => h.id == req.params.id);
  if (!habit) return res.status(404).json({ message: "Habit not found" });

  if (habit.todayDone) return res.json({ message: "Already done today" });
  if (habit.freezeTokens <= 0) return res.json({ message: "No freeze tokens left" });

  habit.freezeTokens--;
  habit.todayDone = true;
  habit.history.push({ date: todayStr(), done: "freeze" });

  res.json({ message: "Freeze used", habit });
});

// -------------------------
// Health Score
// -------------------------
app.get("/habits/:id/health", (req, res) => {
  const habit = habits.find(h => h.id == req.params.id);
  if (!habit) return res.status(404).json({ message: "Habit not found" });

  const streakScore = Math.min(habit.streak * 5, 40);
  const priorityScore = habit.priority * 6;
  const consistencyScore = Math.min(habit.history.length * 2, 30);

  let healthScore = streakScore + priorityScore + consistencyScore;
  if (healthScore > 100) healthScore = 100;

  res.json({
    habit: habit.name,
    healthScore,
    breakdown: { streakScore, priorityScore, consistencyScore }
  });
});

// -------------------------
// Get All Habits
// -------------------------
app.get("/habits", (req, res) => res.json(habits));

// -------------------------
const PORT = 8500;
app.listen(PORT, () => console.log("🚀 Server running on port " + PORT));





