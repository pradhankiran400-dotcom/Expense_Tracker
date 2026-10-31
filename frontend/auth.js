
const API = "http://127.0.0.1:8000";

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

const message = document.getElementById("message");

function showMessage(text, isError = true) {
  message.textContent = text;
  message.style.color = isError ? "#dc5252" : "#16a36a";
}

// Registration
if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value
    };

    try {
      const response = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Registration failed");
      }

      showMessage("Account created! Please login.", false);

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);

    } catch (error) {
      showMessage(error.message);
    }
  });
}

// Login
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = {
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value
    };

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Login failed");
      }

      // Learning-project approach:
      localStorage.setItem("access_token", result.access_token);

      window.location.href = "index.html";

    } catch (error) {
      showMessage(error.message);
    }
  });
}
