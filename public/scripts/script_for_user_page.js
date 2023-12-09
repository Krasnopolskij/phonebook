const logOut = document.getElementById('log-out');

//удалить, це не потрiбно
function searchContacts() {
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    table = document.getElementById('contactsTable');
    tr = table.getElementsByTagName('tr');

    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName('td');
        for (let j = 0; j < td.length; j++) {
            let cell = td[j];
            if (cell) {
                txtValue = cell.textContent || cell.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = '';
                    break;
                } else {
                    tr[i].style.display = 'none';
                }
            }
        }
    }
}

let contacts = [];
let currentPage = 1;
let rowsPerPage = 10;

// запрос на получение данных с сервера
fetch('/get-info', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
})
    .then((response) => response.json())
    .then((data) => parseData(data))
    .then((data) => displayContacts(data));

//изменение пагинации
function changerowsPerPage(count) {
    rowsPerPage = count;
    displayContacts(contacts);
}

// преобразование строк в массиве в объекты js
function parseData(data) {
    data.forEach((row) => {
        contacts.push(JSON.parse(row));
    });
    return contacts;
}

// заполнение таблицы
displayContacts = function (contacts) {
    let table = document.getElementById('contactsTable');
    let start = (currentPage - 1) * rowsPerPage;
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
          <td>${contact.department}</td>
        </tr>`;
    }
    displayPagination(contacts);
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

function changePage(page) {
    currentPage = page;
    displayContacts(contacts);
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
