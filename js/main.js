// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

// Массив для хранения данных (задач). После добавляем tasks в LocalStorage
let tasks = []

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'))
	tasks.forEach((task) => renderTask(task))
}

checkEmptyList()

// Добавляем прослушку событий на форму и запускаем функцию описанную ниже
form.addEventListener('submit', addTask)
// Добавляем функцию по удалению задач на форму
tasksList.addEventListener('click', deleteTask)
// Добавляем функцию по выполнению задач (отмечаем задачу завершенной) на форму 
tasksList.addEventListener('click', doneTask)

//! Функции
// Функция по добавлению и редактированию списка дел
function addTask(event) {
	// Отменяем отправку формы
	event.preventDefault();

	// Достаем текст задачи из поля ввода
	const taskText = taskInput.value

	// Описываем задачу в виде объекта
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	}

	// Добавляем объект в массив с задачами
	tasks.push(newTask)
	// Сохраняем список задач в хранилище браузера LocalStorage
	saveToLocalStorage()

	// Функция добавления HTML элемента на страницу
	renderTask(newTask)

	// Очищаем поле ввода и возвращаем на него фокус
	taskInput.value = ''
	taskInput.focus()

	// После добавления задачи вызываем функцию для проверки пустого списка
	checkEmptyList()
}

// Функция по удалению задачи
function deleteTask(event) {
	//Проверяем если клик был НЕ по кнопке 'Удалить'
	if (event.target.dataset.action !== 'delete') return

	// Проверяем что клик был по кнопке 'Удалить'
	const parenNode = event.target.closest('.list-group-item') // .closest() находит ближайший родительский элемент.

	// Определяем ID задачи 
	const id = Number(parenNode.id)
	//!<--- Перед удалением со страницы удалим задачу из данных (tasks) по методу поиска индекса ---------------->
	// // Находим индекс задачи в массиве
	// const index = tasks.findIndex((task) => task.id === id)
	// // Удаляем задачу из массива по индексу
	// tasks.splice(index, 1)
	//!<--- Удаляем задачу через фильтрацию массива ------------------------------------------------------------->
	tasks = tasks.filter((task) => task.id !== id)
	//!<--------------------------------------------------------------------------------------------------------->
	// Сохраняем список задач в хранилище браузера LocalStorage
	saveToLocalStorage()

	// Удаляем задачу из разметки
	parenNode.remove(); // .remove() удаляет выбранное (в нашем случае всю li)


	// После добавления задачи вызываем функцию для проверки пустого списка
	checkEmptyList()
}

// Функция по выполнению задачи
function doneTask(event) {
	//Проверяем если клик НЕ был по кнопке 'Выполнено'
	if (event.target.dataset.action !== 'done') return

	//Проверяем что клик был по кнопке 'Выполнено'
	const parentNode = event.target.closest('.list-group-item') // .closest() находит ближайший родительский элемент (в нашем случае li)

	// Определяем ID задачи 
	const id = Number(parentNode.id)

	// Находим задачу в массиве с задачами
	const task = tasks.find((task) => {
		if (task.id === id) {
			return true;
		}
	})

	// Меняем статус на обратный 
	task.done = !task.done;

	// Сохраняем список задач в хранилище браузера LocalStorage
	saveToLocalStorage()

	parentNode.querySelector('.task-title') // Находим внутри li элемент span с классом .task-title
		.classList.toggle('task-title--done') // .classList дает доступ к классам выбранного элемента. .toggle - добавляет класс, если его нет и удаляет, если есть 

}

// Функция определения пустой ли список задач или нет
function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
	}

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList')
		emptyListEl ? emptyListEl.remove() : null
	}
}

// Функция сохранения данных в Локальное хранилище нашего браузера
function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Рендер
function renderTask(task) {
	// Формируем и добавляем класс для span в разметку ниже если задача выполнена
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

	//Создаем разметку на страницу для новой задачи
	const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`

	// Добавляем задачу (разметку) на страницу
	tasksList.insertAdjacentHTML('beforeend', taskHTML)
}