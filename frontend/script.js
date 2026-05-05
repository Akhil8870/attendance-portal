async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role })
  });

  const data = await res.json();

  alert(data.msg);

  if (data.msg === "Login success ✔") {

    if (role === "staff") {
      window.location.href = "select.html";
    } else {
      window.location.href = "student.html";
    }
  }
}