const md5 = require('md5');
const Swal = require('sweetalert2')
const subminButton = document.getElementById('login');

// начинаем прослушивать событие нажатия на кнопку
subminButton.addEventListener('click', async event => {
    const { value: formValues } = Swal.fire({
        title: "Вход в систему",
        html: `
          <input id="swal-input1" class="swal2-input" type="email" placeholder="E-MAIL" required>
          <input id="swal-input2" class="swal2-input" type="password" placeholder="Пароль" required>
        `,
        confirmButtonColor: "#555",
        focusConfirm: false,
        preConfirm: async () => {
            let dataForSend =JSON.stringify({
                login: document.getElementById("swal-input1").value,
                password: md5(document.getElementById("swal-input2").value)
            });
            //хеширование пароля и отправка данных
            const response = await sendData(dataForSend);
            response.json().then(data => responseProcessing(data));
        }
    });
});

// функция отправляет данные в виде json с помощью post
async function sendData(data) {
    return await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data,
    });
}

// обработка ответа от сервера
function responseProcessing(response) {
    console.log(response); // для отладки
    if (response.message === 'success_auth') {
        Swal.fire({
            icon: "success",
            title: "Авторизация пройдена!",
            showConfirmButton: true,
            confirmButtonColor: "#555",
        //    timer: 1500
        })
        .then((result) => {
            if (result.isConfirmed) {
                window.location.pathname = '/home';
            }
        });
    } else if (response.message === 'wrong_password') {
        Swal.fire({
            icon: "error",
            title: "Авторизация не пройдена!",
            text: "Неверный пароль",
            confirmButtonColor: "#555",
            });
    } else {
        Swal.fire({
            icon: "error",
            title: "Авторизация не пройдена!",
            text: "Такого пользователя не существует",
            confirmButtonColor: "#555",
        });
    }
}
