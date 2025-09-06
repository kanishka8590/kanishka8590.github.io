/* ===============================
   Exam Management System (Front-end only)
   Storage Layout (localStorage):
   - students: [{id,name,group,pass}]
   - exams: [{id,name,date,venue,groups:[...] }]
   - submissions: [{id, examId, studentId, data:{phone,email,center}, status, submittedAt}]
   - session: {role:'admin'|'student', id:'admin'|'STU001'}
================================= */

// ---------- Helpers ----------
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);
const nowISO = () => new Date().toISOString();
const uid = (p='id') => p + '_' + Math.random().toString(36).slice(2,9);

const LS = {
  get(k, def){
    try{ return JSON.parse(localStorage.getItem(k)) ?? def; }catch{ return def; }
  },
  set(k, v){ localStorage.setItem(k, JSON.stringify(v)); },
  remove(k){ localStorage.removeItem(k); }
};

// Seed admin session helper
function requireRole(role){
  const session = LS.get('session', null);
  if(!session || session.role !== role){
    // allow admin demo on first visit of admin.html? Redirect if not.
    window.location.href = 'index.html';
  }
  return session;
}

// ---------- Session / Login ----------
function bindLogin(){
  const btn = $('#loginBtn');
  if(!btn) return;
  btn.addEventListener('click', () => {
    const role = $('#role').value.trim();
    const username = $('#username').value.trim();
    const password = $('#password').value.trim();
    const msg = $('#loginMsg');

    if(role === 'admin'){
      if(username === 'admin' && password === '12345'){
        LS.set('session', {role:'admin', id:'admin'});
        window.location.href = 'admin.html';
      } else {
        msg.textContent = 'Invalid admin credentials (hint: admin / 12345)';
      }
      return;
    }

    // student login
    const students = LS.get('students', []);
    const found = students.find(s => s.id === username && s.pass === password);
    if(found){
      LS.set('session', {role:'student', id:found.id});
      window.location.href = 'student.html';
    } else {
      msg.textContent = 'Student not found or wrong password.';
    }
  });
}

// ---------- Admin Page ----------
function bindAdmin(){
  if(document.body.dataset.page !== 'admin') return;
  const session = requireRole('admin');

  // Logout
  $('#logoutBtn').addEventListener('click', () => {
    LS.remove('session'); window.location.href = 'index.html';
  });

  // Add student
  $('#addStudentBtn').addEventListener('click', () => {
    const name = $('#studentName').value.trim();
    const id = $('#studentId').value.trim();
    const group = $('#studentGroup').value.trim();
    const pass = $('#studentPass').value.trim() || '1234';
    const msg = $('#studentMsg');

    if(!name || !id || !group){
      msg.textContent = 'Please fill name, ID and group.';
      return;
    }
    const students = LS.get('students', []);
    if(students.some(s => s.id === id)){
      msg.textContent = 'Student ID already exists.';
      return;
    }
    students.push({name,id,group,pass});
    LS.set('students', students);
    msg.textContent = '✅ Student added.';
    $('#studentName').value = $('#studentId').value = $('#studentGroup').value = '';
    renderStudents();
  });

  // Add exam
  $('#addExamBtn').addEventListener('click', () => {
    const name = $('#examName').value.trim();
    const date = $('#examDate').value;
    const venue = $('#examVenue').value.trim();
    const groupsStr = $('#examGroups').value.trim();
    const msg = $('#examMsg');

    if(!name || !date || !venue){
      msg.textContent = 'Please fill name, date, and venue.';
      return;
    }
    const groups = groupsStr ? groupsStr.split(',').map(g => g.trim()).filter(Boolean) : [];
    const exams = LS.get('exams', []);
    exams.push({id: uid('exam'), name, date, venue, groups});
    LS.set('exams', exams);
    msg.textContent = '✅ Exam created.';
    $('#examName').value = $('#examDate').value = $('#examVenue').value = $('#examGroups').value = '';
    renderExams();
    renderFilterExams();
  });

  // Refresh submissions
  $('#refreshSubsBtn').addEventListener('click', renderSubmissions);

  renderStudents();
  renderExams();
  renderFilterExams();
  renderSubmissions();
}

function renderStudents(){
  const tbody = $('#studentsTable tbody');
  const students = LS.get('students', []);
  tbody.innerHTML = '';
  students.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.name}</td>
      <td><code>${s.id}</code></td>
      <td>${s.group}</td>
      <td><button class="btn" data-del="${s.id}">Remove</button></td>
    `;
    tbody.appendChild(tr);
  });

  // delete handlers
  tbody.querySelectorAll('button[data-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-del');
      const students = LS.get('students', []).filter(x => x.id !== id);
      LS.set('students', students);
      // also remove their submissions
      const subs = LS.get('submissions', []).filter(x => x.studentId !== id);
      LS.set('submissions', subs);
      renderStudents(); renderSubmissions();
    });
  });
}

function renderExams(){
  const tbody = $('#examsTable tbody');
  const exams = LS.get('exams', []);
  tbody.innerHTML = '';
  exams.forEach(e => {
    const groups = e.groups?.length ? e.groups.join(', ') : 'All';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${e.name}</td>
      <td>${e.date}</td>
      <td>${e.venue}</td>
      <td>${groups}</td>
      <td><button class="btn" data-del="${e.id}">Remove</button></td>
    `;
    tbody.appendChild(tr);
  });

  // delete handlers
  tbody.querySelectorAll('button[data-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-del');
      const exams = LS.get('exams', []).filter(x => x.id !== id);
      LS.set('exams', exams);
      // remove related submissions
      const subs = LS.get('submissions', []).filter(x => x.examId !== id);
      LS.set('submissions', subs);
      renderExams(); renderSubmissions(); renderFilterExams();
    });
  });
}

function renderFilterExams(){
  const sel = $('#filterExam');
  const exams = LS.get('exams', []);
  sel.innerHTML = `<option value="">All Exams</option>` + exams.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
}

function renderSubmissions(){
  const tbody = $('#submissionsTable tbody');
  const subs = LS.get('submissions', []);
  const students = LS.get('students', []);
  const exams = LS.get('exams', []);
  const filterExam = $('#filterExam').value;

  tbody.innerHTML = '';
  subs
    .filter(s => !filterExam || s.examId === filterExam)
    .sort((a,b) => b.submittedAt.localeCompare(a.submittedAt))
    .forEach(s => {
      const st = students.find(x => x.id === s.studentId);
      const ex = exams.find(x => x.id === s.examId);
      const dataBrief = `Phone: ${s.data.phone}, Email: ${s.data.email}, Center: ${s.data.center}`;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${st?.name ?? '-'}</td>
        <td><code>${s.studentId}</code></td>
        <td>${ex?.name ?? '-'}</td>
        <td>${new Date(s.submittedAt).toLocaleString()}</td>
        <td>
          <span class="badge ${s.status==='accepted'?'ok':s.status==='rejected'?'warn':''}">
            ${s.status}
          </span>
        </td>
        <td>${dataBrief}</td>
        <td class="actions">
          <button class="btn" data-approve="${s.id}">Approve</button>
          <button class="btn" data-reject="${s.id}">Reject</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  // actions
  tbody.querySelectorAll('button[data-approve]').forEach(b=>{
    b.addEventListener('click',()=>{
      const id = b.getAttribute('data-approve');
      const subs = LS.get('submissions', []);
      const idx = subs.findIndex(x=>x.id===id);
      if(idx>-1){ subs[idx].status='accepted'; LS.set('submissions', subs); renderSubmissions(); alert('✅ Approved. Student will see status update.'); }
    });
  });
  tbody.querySelectorAll('button[data-reject]').forEach(b=>{
    b.addEventListener('click',()=>{
      const id = b.getAttribute('data-reject');
      const subs = LS.get('submissions', []);
      const idx = subs.findIndex(x=>x.id===id);
      if(idx>-1){ subs[idx].status='rejected'; LS.set('submissions', subs); renderSubmissions(); alert('❌ Rejected.'); }
    });
  });
}

// ---------- Student Page ----------
let selectedExamIdForForm = null;

function bindStudent(){
  if(document.body.dataset.page !== 'student') return;
  const session = requireRole('student');

  // logout
  $('#logoutBtn').addEventListener('click', () => {
    LS.remove('session'); window.location.href = 'index.html';
  });

  renderAvailableExams();
  renderMySubmissions();

  // modal controls
  $('#closeModal').addEventListener('click', closeModal);
  $('#submitFormBtn').addEventListener('click', submitExamForm);
}

function getLoggedStudent(){
  const session = LS.get('session', null);
  if(!session || session.role!=='student') return null;
  const students = LS.get('students', []);
  return students.find(s => s.id === session.id) || null;
}

function renderAvailableExams(){
  const student = getLoggedStudent();
  const exams = LS.get('exams', []);
  const list = $('#availableExams');
  list.innerHTML = '';

  const eligible = exams.filter(e => (e.groups?.length ? e.groups.includes(student.group) : true));
  if(eligible.length === 0){
    list.innerHTML = `<div class="tile"><div>No exams available for your group <strong>${student.group}</strong>.</div></div>`;
    return;
  }

  const mySubs = LS.get('submissions', []).filter(s => s.studentId === student.id);

  eligible.forEach(ex => {
    const already = mySubs.find(s => s.examId === ex.id);
    const div = document.createElement('div');
    div.className = 'tile';
    div.innerHTML = `
      <div>
        <div><strong>${ex.name}</strong></div>
        <div class="muted">${ex.date} • ${ex.venue}</div>
        <div class="muted">Groups: ${ex.groups?.length ? ex.groups.join(', ') : 'All'}</div>
      </div>
      <div class="actions">
        ${already ? `<span class="badge">Submitted</span>` :
          `<button class="btn primary" data-form="${ex.id}">Fill Form</button>`}
      </div>
    `;
    list.appendChild(div);
  });

  list.querySelectorAll('button[data-form]').forEach(btn => {
    btn.addEventListener('click', () => openForm(btn.getAttribute('data-form')));
  });
}

function openForm(examId){
  selectedExamIdForForm = examId;
  const exams = LS.get('exams', []);
  const ex = exams.find(e => e.id === examId);
  $('#modalTitle').textContent = `Exam Form • ${ex?.name ?? ''}`;
  $('#f_phone').value = ''; $('#f_email').value = ''; $('#f_center').value = '';
  $('#formMsg').textContent = '';
  $('#modal').classList.remove('hidden');
}

function closeModal(){ $('#modal').classList.add('hidden'); }

function submitExamForm(){
  const student = getLoggedStudent();
  if(!student) return;

  const phone = $('#f_phone').value.trim();
  const email = $('#f_email').value.trim();
  const center = $('#f_center').value.trim();
  const msg = $('#formMsg');

  if(!phone || !email || !center){ msg.textContent = 'Please fill all fields.'; return; }

  const subs = LS.get('submissions', []);
  // prevent duplicate submission for same exam
  if(subs.some(s => s.examId === selectedExamIdForForm && s.studentId === student.id)){
    msg.textContent = 'You have already submitted for this exam.';
    return;
  }

  subs.push({
    id: uid('sub'),
    examId: selectedExamIdForForm,
    studentId: student.id,
    data: {phone,email,center},
    status: 'pending',
    submittedAt: nowISO()
  });
  LS.set('submissions', subs);
  closeModal();
  alert('📨 Form submitted! Wait for admin approval.');
  renderAvailableExams(); renderMySubmissions();
}

function renderMySubmissions(){
  const tbody = $('#mySubsTable tbody');
  const student = getLoggedStudent();
  const subs = LS.get('submissions', []).filter(s => s.studentId === student.id);
  const exams = LS.get('exams', []);
  tbody.innerHTML = '';

  if(subs.length === 0){
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="4">No submissions yet.</td>`;
    tbody.appendChild(tr);
    return;
  }

  subs.sort((a,b)=>b.submittedAt.localeCompare(a.submittedAt))
      .forEach(s => {
        const ex = exams.find(x => x.id === s.examId);
        const tr = document.createElement('tr');
        const allowTicket = s.status === 'accepted';
        tr.innerHTML = `
          <td>${ex?.name ?? '-'}</td>
          <td><span class="badge ${s.status==='accepted'?'ok':s.status==='rejected'?'warn':''}">${s.status}</span></td>
          <td>${new Date(s.submittedAt).toLocaleString()}</td>
          <td>${allowTicket ? `<button class="btn" data-ticket="${s.id}">Download</button>` : '-'}</td>
        `;
        tbody.appendChild(tr);
      });

  tbody.querySelectorAll('button[data-ticket]').forEach(btn=>{
    btn.addEventListener('click',()=> {
      const id = btn.getAttribute('data-ticket');
      downloadHallTicket(id);
    });
  });
}

// ---------- Hall Ticket (Print to PDF) ----------
function downloadHallTicket(submissionId){
  const subs = LS.get('submissions', []);
  const s = subs.find(x => x.id === submissionId);
  if(!s || s.status!=='accepted'){ alert('Hall Ticket not available.'); return; }

  const student = getLoggedStudent();
  const exams = LS.get('exams', []);
  const ex = exams.find(x => x.id === s.examId);
  const win = window.open('', '_blank');
  const today = new Date();

  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Hall Ticket</title>
<link rel="stylesheet" href="style.css">
</head><body>
  <div class="ticket">
    <h2>📄 Examination Hall Ticket</h2>
    <div class="muted">Generated on ${today.toLocaleString()}</div>
    <hr/>
    <div class="row">
      <div><strong>Student Name:</strong><br>${student.name}</div>
      <div><strong>Student ID:</strong><br>${student.id}</div>
    </div>
    <div class="row" style="margin-top:10px">
      <div><strong>Exam:</strong><br>${ex?.name ?? '-'}</div>
      <div><strong>Date:</strong><br>${ex?.date ?? '-'}</div>
    </div>
    <div class="row" style="margin-top:10px">
      <div><strong>Venue:</strong><br>${ex?.venue ?? '-'}</div>
      <div><strong>Allotted Center:</strong><br>${s.data.center}</div>
    </div>
    <hr/>
    <div class="row">
      <div><strong>Contact:</strong><br>${s.data.phone}</div>
      <div><strong>Email:</strong><br>${s.data.email}</div>
    </div>
    <hr/>
    <p class="muted">Please arrive 30 minutes early with a valid photo ID. Electronic devices are not permitted inside the exam hall.</p>
    <div style="margin-top:16px">
      <button onclick="window.print()" class="btn primary">Print / Save as PDF</button>
    </div>
  </div>
</body></html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}

// ---------- Router ----------
(function init(){
  const page = document.body?.dataset?.page || 'login';
  if(page === 'login'){ bindLogin(); }
  if(page === 'admin'){ bindAdmin(); }
  if(page === 'student'){ bindStudent(); }
})();
