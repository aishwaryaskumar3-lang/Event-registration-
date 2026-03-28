// Form submission
document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const event = document.getElementById("event").value;

  // Validation
  if (!name || !email || !event) {
    showMessage("All fields required", "red");
    return;
  }

  if (!email.includes("@")) {
    showMessage("Enter valid email", "red");
    return;
  }

  try {
    const res = await fetch("https://event-registration-gfy6.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, event })
    });

    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      console.error("Failed to parse JSON:", parseErr);
      showMessage("Server error", "red");
      return;
    }

    if (!res.ok) {
      console.error("Backend error:", data);
      showMessage(data.message || "Server error", "red");
      return;
    }

    showPopup("🎉 Registration Successful!");
    showMessage(data.message, "green");
    document.getElementById("form").reset();
    loadUsers();

  } catch (err) {
    console.error("Fetch error:", err);
    showMessage("Server error", "red");
  }
});

// Show messages
function showMessage(text, color) {
  const msg = document.getElementById("msg");
  msg.innerText = text;
  msg.style.color = color;
  msg.style.opacity = 0;
  setTimeout(() => msg.style.opacity = 1, 100);
}

// Success popup
function showPopup(text) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerText = text;
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add("show"), 100);
  setTimeout(() => popup.remove(), 2500);
}

// Load all users
async function loadUsers() {
  try {
    const res = await fetch("https://event-registration-gfy6.onrender.com/users");
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
      div.querySelector("button").onclick = async () => {
        try {
          const delRes = await fetch(`https://event-registration-gfy6.onrender.com/delete/${u._id}`, { method: "DELETE" });
          const delData = await delRes.json();
          showMessage(delData.message, "green");
          div.classList.add("fade-out");
          setTimeout(() => div.remove(), 300);
        } catch {
          showMessage("Delete error", "red");
        }
      };
      container.appendChild(div);
    });

  } catch (err) {
    console.error("Load users error:", err);
    showMessage("Server error", "red");
  }
}

// Initial load
loadUsers();