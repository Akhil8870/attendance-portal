const API = window.location.origin;

async function loadStudent() {

  const roll =
  document.getElementById("roll").value;

  if (!roll) {

    alert("Enter Roll Number");

    return;
  }

  const res = await fetch(
    `${API}/api/attendance/student/roll/${roll}`
  );

  const data = await res.json();

  if (data.error) {

    alert("Student Not Found");

    return;
  }

  const student = data.student;

  const attendance = data.attendance;

  let present =
  attendance.filter(
    a => a.status === "Present" || a.status === "OD"
  ).length;

  let absent =
  attendance.filter(
    a => a.status === "Absent"
  ).length;

  let od =
  attendance.filter(
    a => a.status === "OD"
  ).length;

  let total = attendance.length || 1;

  let percent =
  Math.round((present / total) * 100);

  let color =
  percent < 75 ? "red" : "green";

  document.getElementById(
    "studentInfo"
  ).innerHTML = `

    <div style="
      margin-top:20px;
      line-height:2;
    ">

      <h3>${student.name}</h3>

      <p>
        <b>Roll No:</b>
        ${student.rollNo}
      </p>

      <p>
        <b>Department:</b>
        ${student.dept}
      </p>

      <p>
        <b>Year:</b>
        ${student.year}
      </p>

      <p>
        <b>Semester:</b>
        ${student.semester}
      </p>

      <p>
        <b>Section:</b>
        ${student.section}
      </p>

    </div>
  `;

  document.getElementById(
    "cards"
  ).innerHTML = `

    <div class="stat-card">

      <h3>Total Days</h3>

      <p>${total}</p>

    </div>

    <div class="stat-card">

      <h3>Present</h3>

      <p style="color:green;">
        ${present}
      </p>

    </div>

    <div class="stat-card">

      <h3>Absent</h3>

      <p style="color:red;">
        ${absent}
      </p>

    </div>

    <div class="stat-card">

      <h3>OD</h3>

      <p style="color:orange;">
        ${od}
      </p>

    </div>

    <div class="stat-card">

      <h3>Attendance %</h3>

      <p style="color:${color};">
        ${percent}%
      </p>

    </div>

  `;

  let html = "";

  attendance.forEach(a => {

    let statusColor = "";

    if (a.status === "Present") {
      statusColor = "green";
    }

    else if (a.status === "Absent") {
      statusColor = "red";
    }

    else {
      statusColor = "orange";
    }

    html += `

      <tr>

        <td>${a.date}</td>

        <td style="
        color:${statusColor};
        font-weight:bold;
        ">

        ${a.status}

        </td>

        <td style="
        color:${color};
        font-weight:bold;
        ">

        ${percent}%

        </td>

      </tr>
    `;
  });

  document.getElementById(
    "history"
  ).innerHTML = html;
}