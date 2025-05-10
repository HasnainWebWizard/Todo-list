let input = document.querySelector('#taskInput');
let list = document.querySelector('#list');

// On page load, load tasks from localStorage
window.onload = () => {
  let saved = JSON.parse(localStorage.getItem('tasks')) || [];
  if (saved.length > 0) {
    let defaultBox = document.querySelector('#box');
    if (defaultBox) defaultBox.remove(); // Remove the default task if there are saved tasks

    saved.forEach(task => add_list(task.text, task.done)); // Add saved tasks
  }
  taskscounter(); // Ensure task counter is updated on page load
};

function saveTasks() {
  let tasks = [];
  document.querySelectorAll('#list li').forEach(li => {
    const text = li.querySelector('h1').innerText;
    const done = li.querySelector('input[type="checkbox"]').checked;
    tasks.push({ text, done });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showPopup(popupId) {
  const popup = document.getElementById(popupId);
  popup.style.opacity = '1';
  setTimeout(() => {
    popup.style.opacity = '0';
  }, 1500); // Hide the popup after 1.5 seconds
}

function add_list(textFromStorage = null, doneFromStorage = false) {
  const isManual = textFromStorage === null;

  if (isManual && input.value.trim() === '') {
    alert('Please enter a task.');
    return;
  }

  let newli = document.createElement('li');
  newli.className = "flex flex-wrap items-center h-auto w-[100%] my-1 py-3 shadow shadow-gray-200 bg-[white]";
  list.append(newli);

  let newh1 = document.createElement('h1');
  newh1.innerText = textFromStorage ?? input.value;
  newh1.className = "pl-5 w-[82%] h-auto text-gray-500 break-words";
  newli.append(newh1);

  if (isManual) {
    input.value = '';
    showPopup('popup'); // ✅ Only shows popup on manual add
  }

  let delbtn = document.createElement('span');
  delbtn.innerText = '❌';
  delbtn.className = 'cursor-pointer';
  newli.append(delbtn);
  delbtn.onclick = () => {
    newli.remove();
    saveTasks();
    taskscounter();
    showPopup('remove-popup'); // Show "Task Removed" popup
  };

  let newcheckbox = document.createElement('input');
  newcheckbox.type = 'checkbox';
  newcheckbox.className = "h-[20px] w-[20px] appearance-none rounded-full border border-gray-400 checked:border-none checked:before:content-['✔'] ml-1 flex justify-center items-center cursor-pointer";
  newli.prepend(newcheckbox);

  newcheckbox.checked = doneFromStorage;
  if (doneFromStorage) {
    newh1.style.textDecoration = 'line-through';
  }

  newcheckbox.onclick = () => {
    newh1.style.textDecoration = newcheckbox.checked ? 'line-through' : 'none';
    saveTasks();
    taskscounter();
  };

  saveTasks();
  taskscounter();
}

function taskscounter() {
  let taskcounter = document.querySelector('#taskcounter');
  let taskItems = document.querySelectorAll('#list li');
  let totalTasks = taskItems.length;

  // Check if the default task is still there
  const defaultTask = document.querySelector('#box');
  if (defaultTask) {
    totalTasks -= 1; // Don't count the default task
  }

  taskcounter.textContent = totalTasks;
}

// Ensure the default task checkbox works properly
const defaultTaskCheckbox = document.querySelector('#box_check');
const defaultTaskText = document.querySelector('#box_h1');
if (defaultTaskCheckbox) {
  defaultTaskCheckbox.addEventListener('click', () => {
    if (defaultTaskCheckbox.checked) {
      defaultTaskText.style.textDecoration = 'line-through';
    } else {
      defaultTaskText.style.textDecoration = 'none';
    }
    saveTasks(); // Save the state of tasks
    taskscounter(); // Update task counter
  });
}

taskscounter(); // Initial task counter update
