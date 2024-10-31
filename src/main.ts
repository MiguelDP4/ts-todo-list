type Task = {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  active: boolean;
}

type Project = {
  id: number;
  name: string;
  tasks: Array<Task>;
  deadline: Date;
  active: boolean;
}

const sevenDaysFromNow: Date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
let selectedProjectId: number = 1;
let selectedProjectIndex: number = 0;
const projects: Array<Project> = [
  {
    id: 1,
    name: `Project 1`,
    tasks: [{
      id: 1,
      name: "Task 1",
      description: "Description",
      completed: false,
      active: true
    }],
    deadline: sevenDaysFromNow,
    active: true
  }
];

const projectsListDisplay = document.getElementById('projects');

const updateProjectsListDisplay = () => {
  if(projectsListDisplay) {
    projectsListDisplay.innerHTML = '';
    projects.forEach((project) => {
      const newLi = document.createElement('li');
      newLi.innerHTML = `Project ${project.id}`
      newLi.addEventListener('click', () => {
        selectedProjectId = project.id;
        selectedProjectIndex = project.id - 1;
        updateProjectDisplay();
      });
      if(project.active) {
        projectsListDisplay.append(newLi);
      }
    })
  }
}

const projectDisplay = document.getElementById('project-display');

const toggleTaskCompleted = (taskId: number, taskCard: HTMLDivElement) => {
    const task = projects[selectedProjectIndex].tasks.find(task => task.id === taskId);
    if(task) {
      if(task.completed){
        taskCard.classList.remove("completed");
      } else {
        taskCard.classList.add("completed");
      }
      task.completed = !task.completed;
    }
}

const addTaskToCurrentProject = () => {
  let lastId: number = 0;
  const currentProject = projects[selectedProjectIndex];
  const tasks = currentProject.tasks;
  if(tasks.length) lastId = tasks[tasks.length - 1].id;
  const newTask: Task = {
    id: lastId + 1,
    name: `Task ${lastId + 1}`,
    description: "Description",
    completed: false,
    active: true
  };
  currentProject.tasks.push(newTask);
  updateProjectDisplay();
}

const createTaskCard = (task: Task) => {
  const newTaskDiv = document.createElement('div');
  newTaskDiv.classList.add("task");
  if(task.completed) newTaskDiv.classList.add("completed");
  const taskHeader = document.createElement('div');
  taskHeader.classList.add("task-header");
  const taskTitle = document.createElement('h4');
  taskTitle.innerHTML = task.name;
  taskTitle.id = `task-title-${task.id}`;
  const doneTaskCheckbox = document.createElement('input');
  doneTaskCheckbox.type = "checkbox";
  doneTaskCheckbox.id = `done-task-${task.id}`;
  doneTaskCheckbox.addEventListener('click', () => toggleTaskCompleted(task.id, newTaskDiv));
  if(task.completed) doneTaskCheckbox.setAttribute("checked", "true");
  taskHeader.append(taskTitle);
  taskHeader.append(doneTaskCheckbox);
  newTaskDiv.append(taskHeader);
  const taskDescription = document.createElement('div');
  taskDescription.id = `task-description-${task.id}`;
  taskDescription.classList.add("task-description");
  taskDescription.innerHTML = task.description;
  newTaskDiv.append(taskDescription);
  return newTaskDiv;
}

const updateProjectDisplay = () => {
  const proj = projects[selectedProjectIndex];
  if(projectDisplay && proj) {
    projectDisplay.innerHTML = '';
    const projectHeader = document.createElement('div');
    projectHeader.classList.add("project-header");
    const title = document.createElement('h3');
    title.innerHTML = proj.name;
    const newTask = document.createElement('button');
    newTask.innerHTML = "+ New Task";
    newTask.classList.add("new-task");
    newTask.addEventListener('click', addTaskToCurrentProject);
    projectHeader.append(title);
    projectHeader.append(newTask);
    projectDisplay.append(projectHeader);
    const taskContainer = document.createElement('div');
    taskContainer.classList.add("task-container");
    proj.tasks.forEach(task => taskContainer.append(createTaskCard(task)))
    projectDisplay.append(taskContainer);
  }
}

const addProject = () => {
  let lastId = 0;
  if(projects.length) 
    lastId = projects[projects.length - 1].id;

  const newProject: Project = {
    id: lastId + 1,
    name: `Project ${lastId + 1}`,
    tasks: [],
    deadline: sevenDaysFromNow,
    active: true
  }
  projects.push(newProject);
  updateProjectsListDisplay();
}

const addProjectsButton = document.getElementById('new-project');
if(addProjectsButton) addProjectsButton.addEventListener('click', addProject);
const clearButton = document.getElementById('clear-button');
if(clearButton) clearButton.addEventListener('click', () => {
  projects.splice(0,projects.length);
  selectedProjectIndex = 0;
  selectedProjectId = 1;
  updateProjectsListDisplay();
  if(projectDisplay) projectDisplay.innerHTML=`<h3>Create and select a project</h3>`
})

updateProjectsListDisplay();
updateProjectDisplay();