const md5 = require('md5');
const form = document.getElementById('login-form');
const button = document.getElementById('button');

// начинаем прослушивать событие отправки данных из формы
form.addEventListener('submit', async event => {
    //прерываем автоматическую передачу данных из формы и блокируем кнопку
    event.preventDefault();
    button.disabled = true;

    document.getElementById('warning').innerHTML =
        'Авторизация...';
    const dataJson = serializeForm(event.target);
    const hashJSON = hashData(dataJson);

    //отправка данных
    const response = await sendData(hashJSON);
    response.json().then(data => inputResult(data));
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

// из формы достаются данные и преобразуются в json для отправки
function serializeForm(form) {
    const { elements } = form;
    const array = Array.from(elements);

    return JSON.stringify({
        login: array[0].value,
        password: array[1].value,
    });
}

// функция хеширования
function hashData(dataJSON) {
    let parseData = JSON.parse(dataJSON);
    const hash = md5(parseData.password);
    parseData.password = hash;
    return JSON.stringify(parseData);
}

// обработка ответа от сервера
function inputResult(responseFromServer) {
    console.log(responseFromServer); // для отладки
    if (responseFromServer.message === 'success_auth') {
        document.getElementById('warning').innerHTML = ' ';
        window.location.pathname = '/home';
    } else if (responseFromServer.message === 'wrong_password') {
        document.getElementById('warning').innerHTML = 'Неверный пароль';
    } else {
        document.getElementById('warning').innerHTML =
            'Пользователя не существует';
    }
    button.disabled = false;
}
