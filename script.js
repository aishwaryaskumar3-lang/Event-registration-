document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const event = document.getElementById("event").value;

  // ✅ Validation
  if (!name || !email) {
    showMessage("All fields required", "red");
    return;
  }

  if (!email.includes("@")) {
    showMessage("Enter valid email", "red");
    return;
  }

  if (!event) {
    showMessage("Select an event", "red");
    return;
  }

  try {
    // POST to your deployed backend
    const res = await fetch("https://event-registration-2.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, event })
    });

    const data = await res.json();

    showPopup("🎉 Registration Successful!");
    showMessage(data.message, "green");

    document.getElementById("form").reset();
    loadUsers();

  } catch {
    showMessage("Server error", "red");
  }
});

/* Elegant message */
function showMessage(text, color) {
  const msg = document.getElementById("msg");
  msg.innerText = text;
  msg.style.color = color;
  msg.style.opacity = 0;
  setTimeout(() => msg.style.opacity = 1, 100);
}

/* Success Popup */
function showPopup(text) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerText = text;

  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add("show"), 100);
  setTimeout(() => popup.remove(), 2500);
}

/* Load users */
async function loadUsers() {
  const res = await fetch("https://event-registration-2.onrender.com/users");
  const users = await res.json();

  const container = document.getElementById("users");
  container.innerHTML = "";

  users.forEach((u) => {
    const div = document.createElement("div");
    div.className = "user-item fade-in";

    div.innerHTML = `
      <span>${u.name} (${u.email})</span>
      <button class="delete-btn">Delete</button>
    `;

    div.querySelector("button").onclick = () => {
      div.classList.add("fade-out");
      setTimeout(() => div.remove(), 300);
    };

    container.appendChild(div);
  });
}

loadUsers();