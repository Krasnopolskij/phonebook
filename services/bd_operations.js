const mysql = require('mysql');
const md5 = require('md5');
const fs = require('fs');

// данные для подключения к mysql (удалённый сервер на db4free.net)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'mysql',
    password: 'mysql',
    database: 'kursovaya',
    dateStrings: true
});

// проверка пользователя по бд
module.exports.checkAuth = function (login, hash, callback) {
    let bdResponse;
    pool.query(
        'SELECT * FROM accounts WHERE email = ?',
        login,
        function (error, results, fields) {
            if (error) throw error;
            console.log('results\n', results)
            // если results не содержит данных
            if (results.length < 1) {
                bdResponse = { message: 'user_not_found' };
            }
            // если пользователь найден и хеши паролей совпали
            else if (results[0].hash == hash) {
                //fixAuth(results);  
                bdResponse = { 
                    message: 'success_auth',
                    id: results[0].id,
                    login: results[0].login
                    //ser_group: results[0].user_group
                 };
            } else {
                bdResponse = { message: 'wrong_password' };
            }
            callback(bdResponse);
        }
    );
}


module.exports.getInfo = function(callback)
{
    pool.query(
        `SELECT name, phone, email, department_name  FROM staff JOIN departments ON staff.department_id=departments.id ORDER BY staff.id;`,
        function (error, results, fields) {
            if (error) {
                console.log('Ошибка');
                console.log(error);
            }
            let bdResponse = []
            results.forEach(row => {
                // bdResponse.push(`{name: "${row.name}", phone: "${row.phone}", email: "${row.email}", department: "${row.department_name}"}`);
                bdResponse.push(JSON.stringify({
                    name: row.name,
                    phone: row.phone,
                    email: row.email,
                    department: row.department_name
                }))
            });
            callback(bdResponse);
        }
    );
}



// // фиксация времени успешной авторизации в бд
// function fixAuth(results) {
//     date = new Date();
//     pool.query(
//         'INSERT INTO auth_statistics (id, login, auth_time) VALUES (?, ?, ?);',
//         [results[0].id, results[0].login, date],
//         // callback для отладки
//         function (error, results, fields) {
//             if (error) {
//                 console.log('Ошибка записи в auth_statistics');
//                 console.log(error);
//             }
//             console.log('Попытка авторизации зафиксирована');
//         }
//     );
// }

// // фиксация в бд загрузки файла
// module.exports.fixUpload = function(id, filedata) {
//     date = new Date();
//     pool.query(
//         'INSERT INTO uploaded_files (user_id, original_name, loading_time, hash) VALUES (?, ?, ?, ?);',
//         [
//             id,
//             filedata.originalname,
//             date,
//             md5(fs.readFileSync(filedata.path, 'utf-8')),
//         ],
//         // callback для отладки
//         function (error, results, fields) {
//             if (error) {
//                 console.log('Ошибка записи в uploaded_files');
//                 console.log(error);
//             }
//             console.log('Загрузка файла зафиксирована');
//         }
//     );
// }

// // фиксация в бд скачивания файла
// module.exports.fixDownload = function(id, filename) {
//     date = new Date();
//     let is_processed = false;
//     pool.query(
//         // проверяем, есть ли файл в таблице обработанных
//         `SELECT new_filename FROM processed_files WHERE new_filename='${filename}'`,
//         function (error, results, fields) {
//             if (error) {
//                 console.log('Ошибка проверки наличия в processed_files');
//                 console.log(error);
//             }
//             if (results.length != 0) {
//                 is_processed = true
//             }
//             pool.query(
//                 'INSERT INTO downloaded_files (user_id, filename, download_time, is_processed) VALUES (?, ?, ?, ?);',
//                 [id, filename, date, is_processed],
//                 // callback для отладки
//                 function (error, results, fields) {
//                     if (error) {
//                         console.log('Ошибка записи в downloaded_files');
//                         console.log(error);
//                     }
//                     console.log('Скачивание файла зафиксировано');
//                 }
//             );
//         }
//     );
// }

// // фиксация в бд обработки файла
// module.exports.fixProcessing = function(id, filename) {
//     date = new Date();
//     hash = md5(fs.readFileSync(`./file_storage/processed/${filename}`, 'utf-8'))
//     pool.query(
//         'INSERT INTO processed_files (user_id, processing_date, new_filename, hash, week) \
//         VALUES (?, ?, ?, ?, WEEK(processing_date, 1));',
//         [id, date, filename, hash],
//         // callback для отладки
//         function (error, results, fields) {
//             if (error) {
//                 console.log('Ошибка записи в processed_files');
//                 console.log(error);
//             }
//             console.log('Обработка файла зафиксирована');
//         }
//     );
// }

// //получение статистики для пользователей группы B
// module.exports.requestStatisticsForB = function(id, callback)
// {
//     let bdResponse=[];
//     pool.query(
//         `SELECT week, COUNT(*) AS count FROM processed_files WHERE user_id=${id} GROUP BY week ORDER BY week DESC`,
//         function (error, results, fields) {
//             if (error) {
//                 console.log('Ошибка');
//                 console.log(error);
//             }
//             let total = 0;
//             results.forEach(row => {
//                 bdResponse.push(`За <b>${row.week}</b> неделю обработано файлов: ${row.count}`);
//                 total += row.count;
//             });
//             bdResponse.unshift(`Всего вы обработали файлов: ${total}`);
//             callback(bdResponse);
//         }
//     );
// }

//получение статистики для пользователей группы A
// module.exports.requestStatisticsForA = function(id, callback)
// {
//    let logins=[]
//    let ident=[]
//    let bdResponse=[];
//     pool.query(
//         `SELECT id, login FROM accounts`,
//         function (error, results, fields) {
//             if (error) {
//                 console.log('Ошибка');
//                 console.log(error);
//             }
//             for (let i = 0; i < results.length; i++) {
//                 ident.push(results[i].id)
//                 logins[ident[i]] = results[i].login
//             }
//             pool.query(
//                 `SELECT user_id, week, COUNT(*) AS count FROM processed_files GROUP BY week, user_id ORDER BY week DESC`,
//                 function (error, results, fields) {
//                     if (error) {
//                         console.log('Ошибка');
//                         console.log(error);
//                     }
//                     let total = [];
//                     results.forEach(row => {
//                         bdResponse.push(`За <b>${row.week}</b> неделю <b>${logins[row.user_id]}</b> обработал(а) файлов: ${row.count}`);
//                         if (typeof total[row.user_id] === 'undefined')
//                             total[row.user_id] = row.count
//                         else 
//                             total[row.user_id] += row.count
//                     })
//                     for(let i=0; i<ident.length; i++)
//                     bdResponse.unshift(`<b>${logins[ident[i]]}</b>  всего обработал(а) файлов: ${total[ident[i]]}`);
//                     callback(bdResponse)
//                 }
//             );
//         }
//     );
// }