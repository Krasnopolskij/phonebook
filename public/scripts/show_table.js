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

fetch('/get-info', {
  method: 'GET',
  headers: {
      'Content-Type': 'application/json',
  }
})
.then(response =>  response.json())
.then(data => parseData(data))
.then(data => displayContacts(data));


// let contacts = [
//     { name: "Иван Иванов", phone: "123-45-67", email: "ivan@company.com", department: "Отдел продаж" },
//     { name: "Анастасия Рудова", phone: "123-45-84", email: "rydova@company.com", department: "Отдел продаж" },
//     { name: "Алексей Смирнов", phone: "123-45-76", email: "alex@company.com", department: "Отдел разработки" },
//     { name: "Пётр Шишкин", phone: "123-45-53", email: "petr@company.com", department: "Отдел продаж" },
//     { name: "Константин Бабкин", phone: "123-45-81", email: "kostya@company.com", department: "Отдел разработки" },
//     { name: "Фёдор Громов", phone: "123-45-82", email: "fedor@company.com", department: "Отдел разработки" },
//     { name: "Виктор Щетков", phone: "123-45-83", email: "viktor@company.com", department: "Отдел администрирования" },
//     { name: "Екатерина Романова", phone: "123-45-85", email: "romanova@company.com", department: "Отдел разработки" },
//     { name: "Роман Лебедев", phone: "123-45-86", email: "lebedev@company.com", department: "Отдел администрирования" },
//     { name: "Анна Крылова", phone: "123-45-87", email: "krylova@company.com", department: "Отдел администрирования" },
//     { name: "Харон Кузьмин", phone: "123-45-88", email: "kuzmin@company.com", department: "Отдел логистики" },
//     { name: "Лариса Голубева", phone: "123-45-89", email: "golubeva@company.com", department: "Отдел кадров" },
//     { name: "Руслан Беляев", phone: "123-45-90", email: "belyaev@company.com", department: "Отдел разработки" },
//     { name: "Борис Макаров", phone: "123-45-91", email: "makarov@company.com", department: "Отдел менеджмента" },
//     { name: "Дарья Сидорова", phone: "123-45-92", email: "sidorova@company.com", department: "Отдел разработки" },
//     { name: "Юлия Матвеева", phone: "123-45-93", email: "matveeva@company.com", department: "Отдел кадров" },
//     { name: "Григорий Лапин", phone: "123-45-94", email: "lapin@company.com", department: "Отдел разработки" }
// ];
  
let currentPage = 1;
let rowsPerPage = 10;

//изменение пагинации
function changerowsPerPage(count) {
    rowsPerPage = count;
    displayContacts(contacts);
   //displayPagination(contacts);
}

function parseData(data) {
  data.forEach(row => {
    contacts.push(JSON.parse(row));
  });
  console.log(contacts);
  return contacts;
}

function displayContacts(contacts) {
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
  displayPagination(contacts);
}
  
function displayPagination(contacts) {
let totalPages = Math.ceil(contacts.length / rowsPerPage);
let paginationButtons = '';

for (let i = 1; i <= totalPages; i++) {
    paginationButtons += '<button style="margin: 5px" onclick="changePage(' + i + ')">' + i + '</button>';
}

document.getElementById('paginationButtons').innerHTML = paginationButtons;
}
  
function changePage(page) {
currentPage = page;
displayContacts(contacts);
//displayPagination(contacts);
}

// displayContacts(contacts);
// displayPagination(contacts);