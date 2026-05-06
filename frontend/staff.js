const params = new URLSearchParams(window.location.search);

const dept = params.get("dept");
const year = params.get("year");
const semester = params.get("semester");
const section = params.get("section");

let students = [];
let editId = null;

window.onload = load;

// ================= LOAD STUDENTS =================
async function load() {
  const res = await fetch(window.location.origin + `/api/students?dept=${dept}&year=${year}&semester=${semester}&section=${section}`);
  students = await res.json();
  render();
}

// ================= RENDER TABLE =================
async function render() {

  const date = document.getElementById("date").value;

  let attendanceMap = {};

  if (date) {
    for (let s of students) {
      const res = await fetch(window.location.origin + `/api/attendance/${s._id}`);
      const att = await res.json();

      const record = att.find(a => a.date === date);

      if (record) {
        attendanceMap[s._id] = record.status;
      }
    }
  }

  let html = "";

  for (let s of students) {

    const res = await fetch(window.location.origin + `/api/attendance/${s._id}`);
    const att = await res.json();

    let present = att.filter(a => a.status === "Present").length;
    let total = att.length || 1;
    let percent = Math.round((present / total) * 100);

    let selected = attendanceMap[s._id] || "";

    html += `
      <tr>
        <td>${s.name}</td>
        <td>${s.rollNo}</td>

        <td>
          <select id="st-${s._id}">
            <option value="" ${selected === "" ? "selected" : ""}>Select</option>
            <option value="Present" ${selected === "Present" ? "selected" : ""}>Present</option>
            <option value="Absent" ${selected === "Absent" ? "selected" : ""}>Absent</option>
          </select>
        </td>

        <td style="color:${percent < 75 ? 'red' : 'green'}">
          ${percent}%
        </td>

        <td>
          <button onclick="edit('${s._id}','${s.name}','${s.rollNo}')">✏️</button>
          <button onclick="del('${s._id}')" style="background:red;color:white;">🗑</button>
        </td>
      </tr>
    `;
  }

  document.getElementById("table").innerHTML = html;
}

// ================= SAVE ATTENDANCE =================
async function save() {
  const date = document.getElementById("date").value;

  if (!date) {
    alert("Select date");
    return;
  }

  for (let s of students) {
    const status = document.getElementById(`st-${s._id}`).value;
    if (!status) continue;

    await fetch(window.location.origin + "/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: s._id,
        date,
        status
      })
    });
  }

  alert("Saved ✔");
  render();
}