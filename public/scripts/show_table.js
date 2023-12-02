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
  

let contacts = [
    { name: "Иван Иванов", phone: "123-45-67", email: "ivan@example.com", department: "Отдел продаж" },
    { name: "Анастасия Рудова", phone: "123-45-84", email: "rydova@example.com", department: "Отдел продаж" },
    { name: "Алексей Смирнов", phone: "123-45-76", email: "alex@example.com", department: "Отдел разработки" },
    { name: "Пётр Шишкин", phone: "123-45-84", email: "petr@example.com", department: "Отдел продаж" },
    { name: "Константин Бабкин", phone: "123-45-81", email: "kostya@example.com", department: "Отдел разработки" },
    { name: "Фёдор Громов", phone: "123-45-82", email: "fedor@example.com", department: "Отдел разработки" },
    { name: "Виктор Щетков", phone: "123-45-83", email: "viktor@example.com", department: "Отдел администрирования" },
    { name: "Екатерина Романова", phone: "123-45-85", email: "romanova@example.com", department: "Отдел разработки" },
    { name: "Роман Лебедев", phone: "123-45-86", email: "lebedev@example.com", department: "Отдел администрирования" },
    { name: "Анна Крылова", phone: "123-45-87", email: "krylova@example.com", department: "Отдел администрирования" },
    { name: "Харон Кузьмин", phone: "123-45-88", email: "kuzmin@example.com", department: "Отдел логистики" },
    { name: "Лариса Голубева", phone: "123-45-89", email: "golubeva@example.com", department: "Отдел кадров" },
    { name: "Руслан Беляев", phone: "123-45-90", email: "belyaev@example.com", department: "Отдел разработки" },
    { name: "Борис Макаров", phone: "123-45-91", email: "makarov@example.com", department: "Отдел менеджмента" },
    { name: "Дарья Сидорова", phone: "123-45-92", email: "sidorova@example.com", department: "Отдел разработки" },
    { name: "Юлия Матвеева", phone: "123-45-93", email: "matveeva@example.com", department: "Отдел кадров" },
    { name: "Григорий Лапин", phone: "123-45-94", email: "lapin@example.com", department: "Отдел разработки" }
];
  
let currentPage = 1;
let rowsPerPage = 10;

//изменение пагинации
function changerowsPerPage(count) {
    rowsPerPage = count;
    displayContacts();
    displayPagination();
}

function displayContacts() {
let table = document.getElementById('contactsTable');
let start = (currentPage - 1) * rowsPerPage;
let end = start + rowsPerPage;
let paginatedContacts = contacts.slice(start, end);

table.innerHTML = '<tr><th>Имя</th><th>Номер</th><th>Email</th><th>Отдел</th></tr>';

for (let i = 0; i < paginatedContacts.length; i++) {
    let contact = paginatedContacts[i];
    let row = table.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    cell1.textContent = contact.name;
    cell2.textContent = contact.phone;
    cell3.textContent = contact.email;
    cell4.textContent = contact.department;
    }
}
  
function displayPagination() {
let totalPages = Math.ceil(contacts.length / rowsPerPage);
let paginationButtons = '';

for (let i = 1; i <= totalPages; i++) {
    paginationButtons += '<button style="margin: 5px" onclick="changePage(' + i + ')">' + i + '</button>';
}

document.getElementById('paginationButtons').innerHTML = paginationButtons;
}
  
function changePage(page) {
currentPage = page;
displayContacts();
displayPagination();
}

displayContacts();
displayPagination();