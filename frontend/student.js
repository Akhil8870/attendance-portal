const API = "/api";

async function loadStudent() {
  const roll = document.getElementById("roll").value;

  if (!roll) {
    alert("Enter roll number");
    return;
  }

  const res = await fetch(`${API}/student/roll/${roll}`);
  const data = await res.json();

  if (data.error) {
    alert("Student not found");
    return;
  }

  const student = data.student;
  const att = data.attendance;

  let present = att.filter(a => a.status === "Present").length;
  let absent = att.filter(a => a.status === "Absent").length;
  let total = att.length || 1;

  let percent = Math.round((present / total) * 100);
  let color = percent < 75 ? "red" : "green";

  // =====================
  // STUDENT INFO
  // =====================
  document.getElementById("info").innerHTML = `
    <h3>${student.name}</h3>
    <p>Roll No: ${student.rollNo}</p>
    <p>Year: ${student.year} | Sem: ${student.semester} | Section: ${student.section}</p>
  `;

  // =====================
  // CARDS
  // =====================
  document.getElementById("cards").innerHTML = `
    <div class="card-box">
      <h3>Total</h3>
      <p>${total}</p>
    </div>

    <div class="card-box">
      <h3>Present</h3>
      <p style="color:green">${present}</p>
    </div>

    <div class="card-box">
      <h3>Absent</h3>
      <p style="color:red">${absent}</p>
    </div>

    <div class="card-box">
      <h3>Attendance %</h3>
      <p style="color:${color}">${percent}%</p>
    </div>
  `;

  // =====================
  // TABLE (NO HEADER HERE ❌ FIXED)
  // =====================
  let html = "";

  att.forEach(a => {
    html += `
      <tr>
        <td>${a.date}</td>
        <td style="color:${a.status === "Present" ? "green" : "red"}">
          ${a.status}
        </td>
        <td>${percent}%</td>
      </tr>
    `;
  });

  document.getElementById("history").innerHTML = html;
}

// =====================
// NAVIGATION
// =====================
function goHome() {
  window.location.href = "index.html";
}

function logout() {
  alert("Logged out ✔");
  window.location.href = "index.html";
}