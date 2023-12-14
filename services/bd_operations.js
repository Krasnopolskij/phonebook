const mysql = require('mysql');
const md5 = require('md5');

// данные для подключения к mysql
const pool = mysql.createPool({
	host: 'localhost',
	user: 'mysql',
	password: 'mysql',
	database: 'kursovaya',
	dateStrings: true,
});

// проверка пользователя по бд
module.exports.checkAuth = function (login, hash, callback) {
	let bdResponse;
	pool.query(
		'SELECT * FROM accounts WHERE email = ?',
		login,
		function (error, results, fields) {
			if (error) throw error;
			console.log('\nresults from bd\n', results);
			// если results не содержит данных
			if (results.length < 1) {
				bdResponse = { message: 'user_not_found' };
			}
			// если пользователь найден и хеши паролей совпали
			else if (results[0].hash == hash) {
				bdResponse = {
					message: 'success_auth',
					acc_id: results[0].acc_id,
					email: results[0].email,
					role: results[0].role,
				};
			} else {
				bdResponse = { message: 'wrong_password' };
			}
			callback(bdResponse);
		}
	);
};

module.exports.getInfo = function (callback) {
	pool.query(
		`SELECT name, phone, email, department_name  FROM staff JOIN departments ON staff.department_id=departments.id ORDER BY staff.id;`,
		function (error, results, fields) {
			if (error) {
				console.log('Ошибка');
				console.log(error);
			}
			let bdResponse = JSON.stringify(results);
			// let bdResponse = [];
			// results.forEach((row) => {
			// 	// bdResponse.push(`{name: "${row.name}", phone: "${row.phone}", email: "${row.email}", department: "${row.department_name}"}`);
			// 	bdResponse.push(
			// 		JSON.stringify({
			// 			name: row.name,
			// 			phone: row.phone,
			// 			email: row.email,
			// 			department: row.department_name,
			// 		})
			// 	);
			// });
			callback(bdResponse);
		}
	);
};

module.exports.delete = function (email, callback) {
	pool.query(
		`DELETE FROM staff WHERE email = ?;`,
		email,
		function (error, results, fields) {
			let bdResponse;
			if (error) {
				console.log('Ошибка');
				console.log(error);
				bdResponse = { message: 'error' };
			} else bdResponse = { message: 'success' };
			callback(bdResponse);
		}
	);
};

module.exports.insert = function (data, callback) {
	console.log('data to insert\n', data);
	let bdResponse;
	pool.query(
		'INSERT INTO staff (name, phone, email, department_id) VALUES (?, ?, ?, ?);',
		[data.name, data.phone, data.email, Number(data.department_id)],
		function (error, results, fields) {
			if (error) {
				console.log(error);
				bdResponse = { message: 'error' };
				callback(bdResponse);
			} else {
				pool.query(
					'INSERT INTO accounts VALUES ((SELECT id FROM staff WHERE email = ?), ?, ?, ?);',
					[data.email, data.email, data.hash, data.role],
					function (error, results, fields) {
						if (error) {
							console.log(error);
							bdResponse = { message: 'error' };
						} else bdResponse = { message: 'success' };
						callback(bdResponse);
					}
				);
			}
		}
	);
};

module.exports.edit = function (data, callback) {
	console.log('data to edit\n', data);
	let bdResponse;
	pool.query(
		'UPDATE staff SET name = ?, phone = ?, email = ?, department_id = ? WHERE email = ?',
		[
			data.name,
			data.phone,
			data.email,
			Number(data.department_id),
			data.old_email,
		],
		function (error, results, fields) {
			if (error) {
				console.log(error);
				bdResponse = { message: 'error' };
				callback(bdResponse);
			} else {
				pool.query(
					'UPDATE accounts SET email = ?, hash = ?, role = ? WHERE email = ?',
					[data.email, data.hash, data.role, data.old_email],
					function (error, results, fields) {
						if (error) {
							console.log(error);
							bdResponse = { message: 'error' };
						} else bdResponse = { message: 'success' };
						callback(bdResponse);
					}
				);
			}
		}
	);
};

module.exports.search = function (data, callback) {
	pool.query(
		`SELECT name, phone, email, department_name  FROM staff JOIN ` + 
        `departments ON staff.department_id=departments.id WHERE ` +
        `${data.searchType} LIKE '%${data.searchValue}%' ORDER BY staff.id;`,
		function (error, results, fields) {
			if (error) {
				console.log('Error!');
				console.log(error);
			}
			let bdResponse = JSON.stringify(results);
			callback(bdResponse);
		}
	);
};
