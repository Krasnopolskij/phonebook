const logOut = document.getElementById('log-out');
const searchByNumber = document.getElementById('search-by-number');
const searchByName = document.getElementById('search-by-name');
const searchByDep = document.getElementById('search-by-dep');
const searchForm = document.getElementById('search-form');

let contacts = [];
let currentPage = 1;
let rowsPerPage = 10;

// запрос на получение данных с сервера
function getInfo() {
	fetch('/get-info', {
    	method: 'GET',
    	headers: {
      	'Content-Type': 'application/json',
    	},
  	})
    .then((response) => response.json())
    .then((data) => {
		contacts = data;
      	displayContacts(contacts);
      	displayPagination(contacts);
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

// заполнение таблицы
displayContacts = function (contacts, page = currentPage) {
    let table = document.getElementById('contactsTable');
    let start = (page - 1) * rowsPerPage;
    let end = start + rowsPerPage;
    let paginatedContacts = contacts.slice(start, end);
    table.innerHTML =
        '<tr><th>Имя</th><th>Номер</th><th>Email</th><th>Отдел</th></tr>';

    for (let i = 0; i < paginatedContacts.length; i++) {
        let contact = paginatedContacts[i];
        let row = table.insertRow(-1);

        row.innerHTML = `<tr>
          <td>${contact.name}</td>
          <td>${contact.phone}</td>
          <td>${contact.email}</td>
          <td>${contact.department_name}</td>
        </tr>`;
    }
   // displayPagination(contacts);
}

// показать кнопки пагинации
function displayPagination(contacts) {
    let totalPages = Math.ceil(contacts.length / rowsPerPage);
    let paginationButtons = '';

    for (let i = 1; i <= totalPages; i++) {
        paginationButtons +=
            '<button style="margin: 5px" onclick="changePage(' +
            i +
            ')">' +
            i +
            '</button>';
    }
    document.getElementById('paginationButtons').innerHTML = paginationButtons;
}

// сменить страницу в таблице
function changePage(page) {
	currentPage = page;
	displayContacts(contacts);
	displayPagination(contacts);
}


// log-out
logOut.addEventListener('click', async () => {
    await fetch('/log-out', {
        method: 'POST',
    }).then(() => (window.location.pathname = '/login'));
});

//получение логина пользователя
const login = document.cookie
    .split('; ')
    .find((row) => row.startsWith('login='))
    .split('=')[1]
    .replace('%40', '@');
document.getElementById('current-user').innerHTML = login;
console.log(login);



// обработчики для кнопок поиска
searchByNumber.addEventListener('click', () => search('phone'))
searchByName.addEventListener('click', () => search('name'))
searchByDep.addEventListener('click', () => search('department_name'))

async function search(searchType) {
	if (searchForm.value != '') {
		await fetch('/search', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				searchType: searchType,
				searchValue: searchForm.value
			})
		})
		.then((response) => response.json())
		.then((data) => {
			contacts = data;
			console.log(contacts)
			displayContacts(contacts);
			displayPagination(contacts);
		})
	}
	else {
		contacts = [];
		getInfo();
	}
}