const API = window.location.origin;

const params = new URLSearchParams(window.location.search);

const dept = params.get("dept");
const year = params.get("year");
const semester = params.get("semester");
const section = params.get("section");

let students = [];
let editId = null;

window.onload = loadStudents;

/* ================= LOAD STUDENTS ================= */

async function loadStudents() {

  const res = await fetch(
    `${API}/api/students?dept=${dept}&year=${year}&semester=${semester}&section=${section}`
  );

  students = await res.json();

  renderTable();
}

/* ================= RENDER TABLE ================= */

async function renderTable() {

  const date = document.getElementById("date").value;

  let html = "";

  for (let s of students) {

    const res = await fetch(
      `${API}/api/attendance/${s._id}`
    );

    const attendance = await res.json();

    let selectedStatus = "";

    if (date) {
      const record = attendance.find(a => a.date === date);
      if (record) selectedStatus = record.status;
    }

    let presentCount = attendance.filter(
      a => a.status === "Present" || a.status === "OD"
    ).length;

    let total = attendance.length || 1;

    let percent = Math.round((presentCount / total) * 100);

    html += `
      <tr>

        <td>
          <input type="checkbox"
          class="rowCheck"
          data-id="${s._id}">
        </td>

        <td>${s.name}</td>

        <td>${s.rollNo}</td>

        <td>
          <select id="st-${s._id}">
            <option value="">Select</option>
            <option value="Present"
            ${selectedStatus === "Present" ? "selected" : ""}>
            Present
            </option>

            <option value="Absent"
            ${selectedStatus === "Absent" ? "selected" : ""}>
            Absent
            </option>

            <option value="OD"
            ${selectedStatus === "OD" ? "selected" : ""}>
            OD
            </option>

          </select>
        </td>

        <td style="color:${percent < 75 ? 'red' : 'green'}; font-weight:bold;">
          ${percent}%
        </td>

        <td>

          <button onclick="editStudent(
            '${s._id}',
            '${s.name}',
            '${s.rollNo}'
          )">✏️</button>

          <button class="danger-btn"
          onclick="deleteStudent('${s._id}')">
          🗑
          </button>

        </td>

      </tr>
    `;
  }

  document.getElementById("table").innerHTML = html;
}

/* ================= DATE CHANGE ================= */

document.addEventListener("change", function (e) {
  if (e.target.id === "date") {
    renderTable();
  }
});

/* ================= SELECT ALL ================= */

document.getElementById("selectAll").addEventListener("change", function () {

  const checked = this.checked;

  document.querySelectorAll(".rowCheck").forEach(cb => {
    cb.checked = checked;
  });
});

/* ================= BULK UPDATE ================= */

function bulkUpdate(status) {

  document.querySelectorAll(".rowCheck").forEach(cb => {

    if (cb.checked) {

      const id = cb.getAttribute("data-id");

      const select = document.getElementById(`st-${id}`);

      if (select) {
        select.value = status;
      }
    }
  });
}

/* ================= SAVE ATTENDANCE ================= */

async function saveAttendance() {

  const date = document.getElementById("date").value;

  if (!date) {
    alert("Select date");
    return;
  }

  for (let s of students) {

    const status =
      document.getElementById(`st-${s._id}`).value;

    if (!status) continue;

    await fetch(`${API}/api/attendance`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        studentId: s._id,
        date,
        status
      })

    });
  }

  alert("Attendance Saved ✔");

  renderTable();
}

/* ================= ADD STUDENT ================= */

function openAdd() {
  document.getElementById("addModal").style.display = "flex";
}

function closeAdd() {
  document.getElementById("addModal").style.display = "none";
}

async function addStudent() {

  const name = document.getElementById("name").value;
  const roll = document.getElementById("roll").value;

  await fetch(`${API}/api/students`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      name,
      rollNo: roll,
      dept,
      year,
      semester,
      section
    })

  });

  closeAdd();

  loadStudents();
}

/* ================= EDIT ================= */

function editStudent(id, name, roll) {

  editId = id;

  document.getElementById("ename").value = name;
  document.getElementById("eroll").value = roll;

  document.getElementById("editModal").style.display = "flex";
}

function closeEdit() {
  document.getElementById("editModal").style.display = "none";
}

async function updateStudent() {

  await fetch(`${API}/api/students/${editId}`, {

    method: "PUT",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      name: document.getElementById("ename").value,
      rollNo: document.getElementById("eroll").value
    })

  });

  closeEdit();

  loadStudents();
}

/* ================= DELETE ================= */

async function deleteStudent(id) {

  if (!confirm("Delete student?")) return;

  await fetch(`${API}/api/students/${id}`, {
    method: "DELETE"
  });

  loadStudents();
}

/* ================= EXPORT EXCEL ================= */

function exportExcel() {

  const date = document.getElementById("date").value;

  if (!date) {
    alert("Select date");
    return;
  }

  let data = [];

  students.forEach(s => {

    const status = document.getElementById(`st-${s._id}`).value;

    if (!status) return;

    data.push({
      Date: date,
      Name: s.name,
      Roll: s.rollNo,
      Status: status,
      Department: dept,
      Year: year,
      Semester: semester,
      Section: section
    });

  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Attendance");

  XLSX.writeFile(wb, `Attendance_${date}.xlsx`);
}