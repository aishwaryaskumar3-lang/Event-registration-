document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const event = document.getElementById("event").value;

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

    const data = await res.json();
    if (res.ok) {
      showPopup("🎉 Registration Successful!");
      showMessage(data.message, "green");
      document.getElementById("form").reset();
      loadUsers();
    } else {
      showMessage(data.message || "Server error", "red");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    showMessage("Server error", "red");
  }
});

function showMessage(text, color) {
  const msg = document.getElementById("msg");
  msg.innerText = text;
  msg.style.color = color;
}

function showPopup(text) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerText = text;
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add("show"), 100);
  setTimeout(() => popup.remove(), 2500);
}

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
        <span>${u.name} (${u.email}) - ${u.event}</span>
        <button class="delete-btn">Delete</button>
      `;
      div.querySelector("button").onclick = async () => {
        await fetch(`https://event-registration-gfy6.onrender.com/delete/${u._id}`, { method: "DELETE" });
        div.remove();
      };
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Load users error:", err);
  }
}

loadUsers();