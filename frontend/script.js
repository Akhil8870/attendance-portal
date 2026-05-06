async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const res = await fetch(window.location.origin + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  alert(data.msg);

  if (data.msg === "Login success ✔") {

    // IMPORTANT FIX: use backend role
    if (data.role === "staff") {
      window.location.href = "/select.html";
    } else {
      window.location.href = "/student.html";
    }
  }
}