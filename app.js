const express = require('express');
const cookieParser = require('cookie-parser');
const jwtMethods = require('./services/jwt_methods');
const bd = require('./services/bd_operations');

const port = 8000;
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

app.get('/get-info', (request, response) => {
    bd.getInfo(bdResponse => {
        // console.log(JSON.stringify(bdResponse));
        response.send(bdResponse);
    })
});

app.get('/home', jwtMethods.decodeAccessToken, (request, response) => {
    try {
        response.cookie('login', request.user.login);
        if (request.user.role == 'admin') {
            response.sendFile(__dirname + '/views/home-admin.html');
        }
        else {
            response.sendFile(__dirname + '/views/home.html');
        }
        
        console.log('\nrequest.user (decoded token):\n',request.user)
    } catch (error) {
        console.log(error);
    }
});

// обработка post-запроса на авторизацию
app.post('/login', (request, response) => {
    try {
        console.log('\nreques body:\n', request.body)
        const login = request.body.login;
        const hash = request.body.password;

        bd.checkAuth(login, hash, bdResponse => {
            if (bdResponse.message == 'success_auth') {
                console.log('\nbdResponse\n', bdResponse)
                // генерация токена
                const token = jwtMethods.generateAccessToken(
                    bdResponse.acc_id,
                    bdResponse.email,
                    bdResponse.role
                );
                // запись токена в куки и отправка сообщения об успешной авторизации
                console.log('\nSuccessful authorization!');
                response.cookie('token', `Bearer ${token}`, {
                    httpOnly: true
                });
                response.json({ message: 'success_auth'});
                bd.auth_log(bdResponse.acc_id);
            }
            else response.json(bdResponse);
        })    
    } catch (error) {
        console.log(error);
    }
});

// log-out
app.post('/log-out', (request, response) => {
    response.clearCookie('token');
    response.clearCookie('login');
    response.redirect('/login');
});

// обработка запроса на удаление строк
app.post('/delete', jwtMethods.decodeAccessToken, (request, response) => {
    email = request.body.email;
    bd.delete(email, bdResponse => {
        console.log(bdResponse);
        response.json(bdResponse);
    })
})

// обработка запроса на добавление/редактирование строк
app.post('/insert-edit', jwtMethods.decodeAccessToken, (request, response) => {
    // проверка присланных данных
    let is_valid = validate(request.body.name, request.body.phone, request.body.email);

    if (!is_valid || request.body.hash == 'd41d8cd98f00b204e9800998ecf8427e')
        response.json({message: 'error'})
    else {
        if (request.body.type == 'insert') {
            bd.insert(request.body, bdResponse => {
                response.json(bdResponse);
                // фиксация в change_log
                if (bdResponse.message == 'success')
                    bd.change_log(request.body.email, request.user.id, request.body.type);
            });
        }
        else {
            bd.edit(request.body, bdResponse => {
                response.json(bdResponse);
                // фиксация в change_log
                if (bdResponse.message == 'success')
                    bd.change_log(request.body.email, request.user.id, request.body.type);
            });
        }
    }
})

app.post('/search', jwtMethods.decodeAccessToken, (request, response) => {
    bd.search(request.body, bdResponse => {
        console.log('от базы\n', bdResponse);
        response.send(bdResponse);
    })
})

function validate(name, phone, email) {
    let nameReg = /^[а-яА-ЯёЁ]+ [а-яА-ЯёЁ]+$/;
    let phoneReg = /^[1-9]{3}-[1-9]{2}-[1-9]{2}$/;
    let emailReg = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+/;
    let name_is_valid = nameReg.test(name);
    let phone_is_valid = phoneReg.test(phone);
    let email_is_valid = emailReg.test(email);
    if (!name_is_valid) console.log('invalid name');
    if (!phone_is_valid) console.log('invalid phone');
    if (!email_is_valid) console.log('invalid email');
    return name_is_valid && phone_is_valid && email_is_valid;
}

start_server();