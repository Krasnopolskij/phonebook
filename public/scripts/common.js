const contextMenu = document.getElementById("context-menu");
const logOut = document.getElementById("log-out");
const editButton = document.getElementById("edit-button");
const deleteButton = document.getElementById("delete-button");
const insertButton = document.getElementById("new-row");
const Swal = require("sweetalert2");
const md5 = require('md5');

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
