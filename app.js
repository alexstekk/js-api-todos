// Global variables
let todos = [];
let users = [];
const todoList = document.querySelector('#todo-list');
const userList = document.querySelector('#user-todo');
const form = document.querySelector('form');

// Attach Events
document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit', handleSubmit);

// Basic logic
function getUserName(userId) {
	const user = users.find((user) => user.id === userId);
	return user.name;
}
function createUserOptions({ id, name }) {
	const option = document.createElement('option');
	option.value = id;
	option.innerText = name;

	userList.append(option);
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
	status.addEventListener('change', handleTodoChange);

	const close = document.createElement('span');
	close.innerHTML = '&times;';
	close.className = 'close';
	close.addEventListener('click', handleClose);

	li.prepend(status);
	li.append(close);
}

function removeTodo(todoId) {
	todos = todos.filter((todo) => todo.id !== todoId);
	const todo = todoList.querySelector(`[data-id="${todoId}"]`);
	todo.querySelector('input').removeEventListener('change', handleTodoChange);
	todo.querySelector('.close').removeEventListener('click', handleClose);
	todo.remove();
}

// Event logic
function initApp() {
	Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
		[todos, users] = values;
		todos.forEach((todo) => printTodo(todo));
		users.forEach((user) => createUserOptions(user));
	});
}

function handleSubmit(event) {
	event.preventDefault();

	createTodo({
		userId: Number(form.user.value),
		title: form.todo.value,
		completed: false,
	});
}

function handleTodoChange() {
	const todoId = this.parentElement.dataset.id;
	const completed = this.checked;

	toggleTodoComplete(todoId, completed);
}

function handleClose() {
	const todoId = this.parentElement.dataset.id;
	deleteTodo(todoId);
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

async function createTodo(todo) {
	const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
		method: 'POST',
		body: JSON.stringify(todo),
		headers: {
			'Content-type': 'application/json',
		},
	});

	const newTodo = await response.json();
	printTodo(newTodo);
}

async function toggleTodoComplete(todoId, completed) {
	const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
		method: 'PATCH',
		body: JSON.stringify({ completed }),
		headers: {
			'Content-type': 'application/json',
		},
	});

	if (!response.ok) {
		//Error
	}
}

async function deleteTodo(todoId) {
	const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
		method: 'DELETE',
		headers: {
			'Content-type': 'application/json',
		},
	});
	if (response.ok) {
		removeTodo(todoId);
	}
}
