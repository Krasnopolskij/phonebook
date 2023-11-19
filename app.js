const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
// const jwtMethods = require('./services/jwt_methods');

const port = 8080;
const app = express(); // объект приложения

// запуск сервера
function start_server() {
    try {
        app.listen(port, () => {
            console.log(`server started at  http://localhost:${port}/login`);
            console.log(`home page:  http://localhost:${port}/home`);
        });
    } catch (error) {
        console.log(error);
    }
}

// парсеры для данных
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// отправка статических данных
app.use('/', express.static(__dirname + '/public'));

// обработчики get-запросов
app.get('/login', (request, response) => {
    response.sendFile(__dirname + '/views/login.html');
});

app.get('/registration', (request, response) => {
    response.sendFile(__dirname + '/views/registration.html');
});

app.get('/home', (request, response) => {
    try {
        //response.cookie('login', request.user.login);
        response.sendFile(__dirname + '/views/index.html');
    } catch (error) {
        console.log(error);
    }
});

// // обработка post-запроса на авторизацию
// app.post('/login', (request, response) => {
//     try {
//         const login = request.body.login;
//         const hash = request.body.password;

//         bd.checkAuth(login, hash, bdResponse => {
//             if (bdResponse.message == 'success_auth') {
//                 // генерация токена
//                 const token = jwtMethods.generateAccessToken(
//                     bdResponse.id,
//                     bdResponse.login,
//                     bdResponse.user_group
//                 );
//                 // запись токена в куки и отправка сообщения об успешной авторизации
//                 console.log('Авторизация пройдена');
//                 response.cookie('token', `Bearer ${token}`, {
//                     httpOnly: true
//                 });
//                 response.json({ message: 'success_auth'})
//             }
//             else response.json(bdResponse);
//         })    
//     } catch (error) {
//         console.log(error);
//     }
// });

// log-out
app.post('/log-out', (request, response) => {
    response.clearCookie('token');
    response.clearCookie('login');
    response.redirect('/login');
});

start_server();
