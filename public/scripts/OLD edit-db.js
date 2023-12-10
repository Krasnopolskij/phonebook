const editButton = document.getElementById('edit-button');
const deleteButton = document.getElementById('delete-button');
const Swal = require('sweetalert2');
const update = require('./script_for_admin_page')

// обработчики для кнопок edit и delete
deleteButton.addEventListener('click', async () => {
    Swal.fire({
        title: 'Удалить строку из базы данных?',
        text: "Это изменение нельзя будет отменить",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#555',
        cancelButtonColor: '#555',
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена'
    })
    .then((result) => {
        if (result.isConfirmed) {
            currentEmail = window.localStorage.getItem('currentEmail')
            deleteRow(currentEmail);
        }
    })
});

async function deleteRow(currentEmail) {
    await fetch('/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: currentEmail})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        if (data.message == 'success') {
            Swal.fire({
                title: 'Удалено!',
                icon: 'success',
                confirmButtonColor: '#555'
            });
            update.displayContacts();
            update.displayPagination();
        }
        else {
            Swal.fire({
                icon: "error",
                title: "Ошибка!",
                text: "Не получилось удалить запись",
                confirmButtonColor: '#555'
            });
        }
    })
}