const API = "http://localhost:8500";

async function loadHabits() {
  const res = await fetch(`${API}/habits`);
  const data = await res.json();

  const habitList = document.getElementById("habitList");
  habitList.innerHTML = "";

  data.forEach(habit => {
    const card = document.createElement("div");
    card.className = "habit-card";

    card.innerHTML = `
      <div class="habit-name">${habit.name}</div>
      <div class="habit-info">Streak: ${habit.streak} days • Freeze Tokens: ${habit.freezeTokens}</div>

      <div class="recommend-box">
        <b>Recommendations:</b><br>
        ${habit.recommendations.map(r => `• ${r}`).join("<br>")}
      </div>

      <button class="done-btn" onclick="markDone(${habit.id})">Mark Done</button>
      <button class="freeze-btn" onclick="useFreeze(${habit.id})">Use Freeze</button>
      <button class="health-btn" onclick="showHealth(${habit.id})">Health Score</button>
    `;

    habitList.appendChild(card);
  });
}

async function markDone(id) {
  await fetch(`${API}/habits/${id}/today`, { method: "POST" });
  loadHabits();
}

async function useFreeze(id) {
  await fetch(`${API}/habits/${id}/freeze`, { method: "POST" });
  loadHabits();
}

async function showHealth(id) {
  const res = await fetch(`${API}/habits/${id}/health`);
  const data = await res.json();
  alert(`${data.habit} → Health Score: ${data.healthScore}/100`);
}

loadHabits();





