let input = document.querySelector('#taskInput');
let list = document.querySelector('#list');

// 1. On page load, pull tasks from localStorage
window.onload = () => {
  const saved = JSON.parse(localStorage.getItem('tasks')) || [];
  if (saved.length > 0) {
    // If there are saved tasks, remove the default box
    const defaultBox = document.querySelector('#box');
    if (defaultBox) defaultBox.remove();

    // Render each saved task
    saved.forEach(task => add_list(task.text, task.done));
  }
};

// 2. Save current tasks array into localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#list li').forEach(li => {
    const text = li.querySelector('h1').innerText;
    const done = li.querySelector('input[type="checkbox"]').checked;
    tasks.push({ text, done });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 3. Add a new task (or rehydrate one from storage)
function add_list(textFromStorage = null, doneFromStorage = false) {
  // Alert if empty input and not loading from storage
  if (textFromStorage === null && input.value.trim() === '') {
    alert('Please enter a task.');
    return;
  }
  // Create the <li>
  const newli = document.createElement('li');
  newli.className = "flex flex-wrap items-center h-auto w-[100%] my-1 py-3 shadow shadow-gray-200 bg-[white]";
  list.append(newli);

  // Task text
  const newh1 = document.createElement('h1');
  newh1.innerText = textFromStorage ?? input.value;
  newh1.className = "pl-5 w-[82%] h-auto text-gray-500 break-words";
  newli.append(newh1);

  // Clear input if this was a fresh entry
  if (textFromStorage === null) input.value = '';

  // Delete button
  const delbtn = document.createElement('span');
  delbtn.innerText = '❌';
  delbtn.className = 'cursor-pointer';
  newli.append(delbtn);
  delbtn.onclick = () => {
    newli.remove();
    saveTasks();
  };

  // Checkbox
  const newcheckbox = document.createElement('input');
  newcheckbox.type = 'checkbox';
  newcheckbox.className = "h-[20px] w-[20px] appearance-none rounded-full border border-gray-400 checked:border-none checked:before:content-['✔'] ml-1 flex justify-center items-center cursor-pointer";
  newli.prepend(newcheckbox);

  // Set checkbox state/text‐decoration if rehydrated
  newcheckbox.checked = doneFromStorage;
  if (doneFromStorage) {
    newh1.style.textDecoration = 'line-through';
  }

  // Toggle behavior on click
  newcheckbox.onclick = () => {
    newh1.style.textDecoration = newcheckbox.checked
      ? 'line-through'
      : 'none';
    saveTasks();
  };

  // Save after adding a task
  saveTasks();
}
