// Global variables
let todos = [];
let users = [];
const todoList = document.querySelector('#todo-list');

// Attach Events
document.addEventListener('DOMContentLoaded', initApp);

// Basic logic
function getUserName(userId) {
	const user = users.find((user) => user.id === userId);
	return user.name;
}
function printTodo({ id, userId, title, completed }) {
	const li = document.createElement('li');
	li.className = 'todo-item';
	li.dataset.id = id;
	li.innerHTML = `<span>${title} <small>(${getUserName(userId)})</small></span>`;
	todoList.prepend(li);

	const status = document.createElement('input');
	status.type = 'checkbox';
	status.checked = completed;

	const close = document.createElement('span');
	close.innerHTML = '&times;';
	close.className = 'close';

	li.prepend(status);
	li.append(close);
}

// Event logic
function initApp() {
	Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
		[todos, users] = values;
		todos.forEach((todo) => printTodo(todo));
	});
}

// Async logic
async function getAllTodos() {
	const response = await fetch('https://jsonplaceholder.typicode.com/todos');
	const data = await response.json();

	return data;
}

async function getAllUsers() {
	const response = await fetch('https://jsonplaceholder.typicode.com/users');
	const data = await response.json();

	return data;
}
