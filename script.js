// ===== REGISTER USER =====
document.getElementById("form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const event = document.getElementById("event")?.value;

  if (!name || !email || !event) {
    showMessage("All fields required", "red");
    return;
  }

  try {
    const res = await fetch("https://event-registration-gfy6.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, event })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Backend error:", errorData);
      showMessage("Server error", "red");
      return;
    }

    const data = await res.json();
    showPopup("🎉 Registration Successful!");
    showMessage(data.message, "green");
    document.getElementById("form").reset();
    loadUsers();

  } catch (err) {
    console.error("Fetch error:", err);
    showMessage("Server error", "red");
  }
});

// ===== LOAD USERS =====
async function loadUsers() {
  try {
    const res = await fetch("https://event-registration-gfy6.onrender.com/users");
    if (!res.ok) throw new Error("Failed to load users");
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
          if (!delRes.ok) throw new Error("Delete failed");
          div.remove();
        } catch (err) {
          console.error("Delete error:", err);
          showMessage("Delete failed", "red");
        }
      };

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Load users error:", err);
  }
}

// ===== CONTACT FORM =====
document.getElementById("contactForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("contactName")?.value;
  const email = document.getElementById("contactEmail")?.value;
  const message = document.getElementById("contactMessage")?.value;

  if (!name || !email || !message) {
    alert("All fields are required");
    return;
  }

  try {
    const res = await fetch("https://event-registration-gfy6.onrender.com/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Contact backend error:", errorData);
      alert("Server error. Try again later.");
      return;
    }

    const data = await res.json();
    alert(data.message);
    document.getElementById("contactForm").reset();

  } catch (err) {
    console.error("Contact fetch error:", err);
    alert("Server error. Try again later.");
  }
});

// ===== HELPERS =====
function showMessage(text, color) {
  const msg = document.getElementById("msg");
  if (!msg) return;
  msg.innerText = text;
  msg.style.color = color;
  msg.style.opacity = 0;
  setTimeout(() => (msg.style.opacity = 1), 100);
}

function showPopup(text) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerText = text;
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add("show"), 100);
  setTimeout(() => popup.remove(), 2500);
}

// Load users immediately on page load
loadUsers();