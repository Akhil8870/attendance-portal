const API = window.location.origin;

async function login() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password,
      role
    })
  });

  const data = await res.json();

  if (data.msg !== "Login success") {
    alert(data.msg);
    return;
  }

  if (role === "staff") {
    location.href = "select.html";
  } else {
    location.href = "student.html";
  }
}

async function register() {

  const email = document.getElementById("remail").value;
  const password = document.getElementById("rpassword").value;
  const role = document.getElementById("rrole").value;

  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password,
      role
    })
  });

  const data = await res.json();

  alert(data.msg);

  location.href = "index.html";
}

async function forgot() {

  const email = document.getElementById("femail").value;
  const password = document.getElementById("fpassword").value;

  const res = await fetch(`${API}/api/auth/forgot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await res.json();

  alert(data.msg);

  location.href = "index.html";
}