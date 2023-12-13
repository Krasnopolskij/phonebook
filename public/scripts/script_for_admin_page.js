const contextMenu = document.getElementById("context-menu");
const logOut = document.getElementById("log-out");
const editButton = document.getElementById("edit-button");
const deleteButton = document.getElementById("delete-button");
const insertButton = document.getElementById("new-row");
const Swal = require("sweetalert2");
const md5 = require('md5');

const common = require("./common")

let contacts = [];
let currentPage = 1;
let rowsPerPage = 10;

// запрос на получение данных с сервера
function getInfo() {
	fetch("/get-info", {
    	method: "GET",
    	headers: {
      	"Content-Type": "application/json",
    	},
  	})
    .then((response) => response.json())
    .then((data) => parseData(data))
    .then((data) => {
      	displayContacts(data);
      	displayPagination(data);
      	changePage(currentPage);
    });
}
getInfo();

//изменение пагинации
function changerowsPerPage(count) {
	rowsPerPage = count;
	displayContacts(contacts, 1);
	displayPagination(contacts);
}

// преобразование строк в массиве в объекты js
function parseData(data) {
	data.forEach((row) => {
		contacts.push(JSON.parse(row));
	});
	return contacts;
}

// заполнение таблицы
displayContacts = function (contacts, page = currentPage) {
	let table = document.getElementById("contactsTable");
	let start = (page - 1) * rowsPerPage;
	let end = start + rowsPerPage;
	let paginatedContacts = contacts.slice(start, end);
	table.innerHTML =
		"<tr><th>Имя</th><th>Номер</th><th>Email</th><th>Отдел</th></tr>";

	for (let i = 0; i < paginatedContacts.length; i++) {
		let contact = paginatedContacts[i];
		let row = table.insertRow(-1);

		row.innerHTML = `<tr>
			<td>${contact.name}</td>
			<td>${contact.phone}</td>
			<td>${contact.email}</td>
			<td>
				<div class="td-with-button">
				<div>${contact.department} </div>
				<button class="show-context-menu" type="button"></button>
				</div>
			</td>
			</tr>`;
		const button = row.getElementsByClassName("show-context-menu")[0]; // добавленная выше в innerHTML кнопка
    	button.onclick = (event) => showContextMenu(event);
    	button.disabled = true;

    	// отображение/скрытие кнопки меню при наведении на строку
    	row.addEventListener("mouseover", () => {
      		button.style.visibility = "visible";
      		button.disabled = false;

			// храним данные из строки в localStorage
			window.localStorage.setItem("currentName", row.childNodes[1].textContent);
			window.localStorage.setItem("currentPhone", row.childNodes[3].textContent);
      		window.localStorage.setItem("currentEmail", row.childNodes[5].textContent);
			window.localStorage.setItem("currentDepartment", row.childNodes[7].textContent);
    	});
		row.addEventListener("mouseout", () => {
			button.style.visibility = "hidden";
			button.disabled = true;
		});
  	}
};

// показать контекстное меню
function showContextMenu(event) {
	contextMenu.style.left = String(Number(event.pageX) - 100) + "px";
	contextMenu.style.top = event.pageY + "px";
	contextMenu.style.display = "block";
}

contextMenu.addEventListener(
  	"mouseleave",
  	() => (contextMenu.style.display = "none")
);

// показать кнопки пагинации
function displayPagination(contacts) {
	let totalPages = Math.ceil(contacts.length / rowsPerPage);
	let paginationButtons = "";

	for (let i = 1; i <= totalPages; i++) {
		paginationButtons += `<button class="display-pagination-but" style="margin: 5px">${i}</button>`;
	}
	document.getElementById("paginationButtons").innerHTML = paginationButtons;
	displayPagBut = Object.values(
		document.getElementsByClassName("display-pagination-but")
	);
  	displayPagBut.forEach((button) => {
    	button.addEventListener("click", () =>
      		changePage(Number(button.textContent))
    	);
  	});
}

// сменить страницу в таблице
function changePage(page) {
	currentPage = page;
	displayContacts(contacts);
	displayPagination(contacts);
}

// log-out
logOut.addEventListener("click", async () => {
	await fetch("/log-out", {
		method: "POST",
	}).then(() => (window.location.pathname = "/login"));
});

//получение логина пользователя
const login = document.cookie
	.split("; ")
	.find((row) => row.startsWith("login="))
	.split("=")[1]
	.replace("%40", "@");
document.getElementById("current-user").innerHTML = login;
console.log(login);

// обработчики для кнопок изменения кол-ва строк на странице
changeRowsButtons = Object.values(
  	document.getElementsByClassName("change-rows-but")
);
changeRowsButtons.forEach((button) => {
	button.addEventListener("click", () => {
		changerowsPerPage(Number(button.textContent));
	});
});

// обработчики для кнопок edit и delete
deleteButton.addEventListener("click", async () => {
  	Swal.fire({
		title: "Удалить строку из базы данных?",
		text: "Это изменение нельзя будет отменить",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#555",
		cancelButtonColor: "#555",
		confirmButtonText: "Удалить",
		cancelButtonText: "Отмена",
		})
		.then((result) => {
			if (result.isConfirmed) {
				currentEmail = window.localStorage.getItem("currentEmail");
				deleteRow(currentEmail);
			}
  		});
});

editButton.addEventListener('click', () => insertData(
	'Редактирование записи',
	'Запись отредактирована!',
	'Не удалось завершить редактирование',
	'edit',
	true
));

// запрос на удаление строки и отбработка ответа (для deleteButton)
async function deleteRow(currentEmail) {
  	await fetch("/delete", {
    	method: "POST",
    	headers: {
      	"Content-Type": "application/json",
    	},
    	body: JSON.stringify({ email: currentEmail }),
  	})
    .then((response) => response.json())
    .then((data) => {
      	console.log(data.message);
      	if (data.message == "success") {
			Swal.fire({
			title: "Удалено!",
			icon: "success",
			confirmButtonColor: "#555",
			});
        	contacts = [];
        	getInfo();
      } else {
        	Swal.fire({
				icon: "error",
				title: "Ошибка!",
				text: "Не получилось удалить запись",
				confirmButtonColor: "#555",
        	});
      	}
    });
}

// обработчик для кнопки вставки данных
insertButton.addEventListener('click', () => insertData(
	'Введите данные нового сотрудника',
	'Запись добавлена!',
	'Не удалось добавить запись',
	'insert'
));

// функция для вставки / обновления данных (исп. в обработчиках)
async function insertData(mainTitle, successTitle, errorTitle, type, showData=false) {
	let currentName, currentPhone, currentEmail, currentDepartment
	if (showData) {
		currentName = window.localStorage.getItem('currentName');
		currentPhone = window.localStorage.getItem('currentPhone');
		currentEmail = window.localStorage.getItem('currentEmail');
		currentDepartment = window.localStorage.getItem('currentDepartment');
	}
	else {
		currentName = ''; 
		currentPhone = '';
		currentEmail = ''; 
		currentDepartment = ''; 
	}

	const { value: formValues } = await Swal.fire({
		title: mainTitle,
		html: `
		<input id="swal-input1" class="swal2-input" value="${currentName}" placeholder="Имя" required>
		<input id="swal-input2" class="swal2-input" value="${currentPhone}" placeholder="Телефон" required>
		<input id="swal-input3" class="swal2-input" value="${currentEmail}" type="email" placeholder="E-MAIL" required>
		<input id="swal-input4" class="swal2-input" type="password" placeholder="Пароль для аккаунта" required>
		<select class="swal2-select" id="swal-select" name="departments">
			<option value="1">Отдел продаж</option>
			<option value="2">Отдел финансов</option>
			<option value="3">Отдел разработки</option>
			<option value="4">Отдел администрирования</option>
			<option value="5">Отдел логистики</option>
			<option value="6">Отдел менеджмента</option>
			<option value="7">Отдел безопасности</option>
			<option value="8">Отдел кадров</option>
		</select>
		<br><br>
		<input id="swal-input6" name="is_admin" value=1 type="checkbox">
		<label for="swal-input5">Учётная запись администратора</label>
		`,
		confirmButtonColor: "#555",
		showCancelButton: true,
		cancelButtonColor: "#555",
		cancelButtonText: "Отмена",
		focusConfirm: false,
		preConfirm: () => {
			return [
				{
				name: document.getElementById("swal-input1").value,
				phone: document.getElementById("swal-input2").value,
				email: document.getElementById("swal-input3").value,
				hash: md5(document.getElementById("swal-input4").value),
				role: "user",
				department_id: document.getElementById("swal-select").value,
				type: type,
				old_email: window.localStorage.getItem('currentEmail')
				},
				document.getElementById("swal-input6"),
			];
	  	},
	});
	if (formValues) {
	  	if (formValues[1].checked) {
		  	formValues[0].role = "admin";
	  	}
	  	await fetch('/insert-edit', {
			method: "POST",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify(formValues[0]),
	  	})
		.then((response) => response.json())
		.then((data) => {
		  console.log(data.message);
		  if (data.message == "success") {
				Swal.fire({
				  title: successTitle,
				  icon: "success",
				  confirmButtonColor: "#555",
				});
			contacts = [];
			getInfo();
		  } 
		  else {
				Swal.fire({
				  icon: "error",
				  title: errorTitle,
				  text: "Возможно, введены некорректные данные, или они дублируются в базе",
				  confirmButtonColor: "#555",
				});
		  	}
		});
	}	
}