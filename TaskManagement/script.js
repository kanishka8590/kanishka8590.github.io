// -------------------- Data Storage --------------------
let teamMembers = [];
let projects = [];
let tasks = [];

// -------------------- DOM Elements --------------------
const loginForm = document.getElementById("login-form");
const loginUsername = document.getElementById("username");
const loginRole = document.getElementById("role");
const dashboard = document.getElementById("dashboard");
const mainHeading = document.getElementById("main-heading");
const logoutBtn = document.getElementById("logout-btn");

const memberInput = document.getElementById("add-member-name");
const addMemberBtn = document.getElementById("add-member-btn");
const assignSelect = document.getElementById("assign-to");
const taskInput = document.getElementById("task-name");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

const projectInput = document.getElementById("project-name");
const addProjectBtn = document.getElementById("add-project-btn");
const projectList = document.getElementById("project-list");

const managerPanel = document.getElementById("manager-panel");
const leadPanel = document.getElementById("lead-panel");
const teamPanel = document.getElementById("team-panel");

// -------------------- Login (any username allowed) --------------------
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = loginUsername.value.trim();
  const role = loginRole.value;

  if (!username) {
    alert("Please enter your name");
    return;
  }

  // Hide login, show dashboard
  loginForm.parentElement.style.display = "none";
  dashboard.style.display = "block";
  mainHeading.textContent = `Task Management Tool - ${role}`;
  setupDashboard(role);
});

// -------------------- Logout --------------------
logoutBtn.addEventListener("click", () => {
  dashboard.style.display = "none";
  loginForm.parentElement.style.display = "block";
  loginUsername.value = "";
  loginRole.value = "Manager";
});

// -------------------- Setup Dashboard --------------------
function setupDashboard(role) {
  managerPanel.style.display = "none";
  leadPanel.style.display = "none";
  teamPanel.style.display = "none";

  if (role === "Manager") managerPanel.style.display = "block";
  if (role === "Team Lead") leadPanel.style.display = "block";
  if (role === "Team Member") teamPanel.style.display = "block";

  updateAssignDropdown();
  displayProjects();
  displayTasks();
}

// -------------------- Add Project --------------------
addProjectBtn.addEventListener("click", () => {
  const name = projectInput.value.trim();
  if (!name) return alert("Enter project name");
  projects.push(name);
  projectInput.value = "";
  displayProjects();
});

function displayProjects() {
  projectList.innerHTML = "";
  projects.forEach(project => {
    const div = document.createElement("div");
    div.className = "project";
    div.textContent = project;
    projectList.appendChild(div);
  });
}

// -------------------- Add Team Member --------------------
addMemberBtn.addEventListener("click", () => {
  const name = memberInput.value.trim();
  if (!name) return alert("Enter a name");
  if (!teamMembers.includes(name)) {
    teamMembers.push(name);
    updateAssignDropdown();
    memberInput.value = "";
  } else alert("Member already exists");
});

// -------------------- Update Assign Dropdown --------------------
function updateAssignDropdown() {
  assignSelect.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "Select a team member";
  assignSelect.appendChild(defaultOption);

  teamMembers.forEach(member => {
    const option = document.createElement("option");
    option.value = member;
    option.text = member;
    assignSelect.appendChild(option);
  });
}

// -------------------- Add Task --------------------
addTaskBtn.addEventListener("click", () => {
  const taskName = taskInput.value.trim();
  const assignedTo = assignSelect.value;
  if (!taskName) return alert("Enter task name");
  if (!assignedTo) return alert("Select a team member");

  tasks.push({ name: taskName, assignedTo: assignedTo, status: "Pending" });
  taskInput.value = "";
  assignSelect.value = "";
  displayTasks();
});

// -------------------- Display Tasks --------------------
function displayTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, i) => {
    const div = document.createElement("div");
    div.className = "task";
    div.setAttribute("data-status", task.status);
    div.innerHTML = `
      <strong>${task.name}</strong> - Assigned to: ${task.assignedTo}<br>
      Status: ${task.status} <button onclick="updateStatus(${i})">Next Status</button>
    `;
    taskList.appendChild(div);
  });
}

// -------------------- Update Task Status --------------------
function updateStatus(i) {
  const order = ["Pending", "In Progress", "Completed"];
  const currentIndex = order.indexOf(tasks[i].status);
  tasks[i].status = order[(currentIndex + 1) % order.length];
  displayTasks();
}

// -------------------- Initial Setup --------------------
updateAssignDropdown();
displayProjects();
displayTasks();
