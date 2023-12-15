const mysql = require('mysql2');
const md5 = require('md5');

// данные для подключения к mysql
const pool = mysql.createPool({
	host: 'localhost',
	user: 'mysql',
	password: 'mysql',
	database: 'kursovaya'
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

// module.exports.insert = function (data, callback) {
// 	console.log('data to insert\n', data);
// 	let bdResponse;
// 	pool.query(
// 		'INSERT INTO staff (name, phone, email, department_id) VALUES (?, ?, ?, ?);',
// 		[data.name, data.phone, data.email, Number(data.department_id)],
// 		function (error, results, fields) {
// 			if (error) {
// 				console.log(error);
// 				bdResponse = { message: 'error' };
// 				callback(bdResponse);
// 			} else {
// 				pool.query(
// 					'INSERT INTO accounts VALUES ((SELECT id FROM staff WHERE email = ?), ?, ?, ?);',
// 					[data.email, data.email, data.hash, data.role],
// 					function (error, results, fields) {
// 						if (error) {
// 							console.log(error);
// 							bdResponse = { message: 'error' };
// 						} else bdResponse = { message: 'success' };
// 						callback(bdResponse);
// 					}
// 				);
// 			}
// 		}
// 	);
// };

module.exports.insert = function (data, callback) {
	console.log('\ndata to insert\n', data);
	pool.query('START TRANSACTION;', () => {
		pool.query(
			'INSERT INTO staff (name, phone, email, department_id) VALUES (?, ?, ?, ?);',
			[
				data.name,
				data.phone, 
				data.email, 
				Number(data.department_id)
			],
			function (error, results, fields) {
				if (error) {
					pool.query('ROLLBACK;')
					console.log('\nerror in transaction: 1st query\n\n',error.sqlMessage,'\n', error.sql);
					return callback({ message: 'error' });
				}
				pool.query(
					'INSERT INTO accounts VALUES ((SELECT id FROM staff WHERE email = ?), ?, ?, ?);',
					[data.email, data.email, data.hash, data.role],
					function (error, results, fields) {
						if (error) {
							pool.query('ROLLBACK;')
							console.log('\nerror in transaction: 2nd query\n\n', error.sqlMessage,'\n', error.sql);
							return callback({ message: 'error' });
						}
						pool.query('COMMIT;')
						return callback({ message: 'success' });
					}
				);
			}
		);
	})
};

module.exports.edit = function (data, callback) {
	console.log('\ndata to edit\n', data);
	pool.query('START TRANSACTION;', () => {
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
					pool.query('ROLLBACK;')
					console.log('\nerror in transaction: 1st query\n\n',error.sqlMessage,'\n', error.sql);
					return callback({ message: 'error' });
				} 
				pool.query(
					'UPDATE accounts SET email = ?, hash = ?, role = ? WHERE email = ?',
					[
						data.email, 
						data.hash,
						data.role, 
						data.old_email
					],
					function (error, results, fields) {
						if (error) {
							pool.query('ROLLBACK;')
							console.log('\nerror in transaction: 2nd query\n\n',error.sqlMessage,'\n', error.sql);
							return callback({ message: 'error' });
						} 
						pool.query('COMMIT;')
						return callback({ message: 'success' });
					}
				);
			}
		);
	});
};

module.exports.search = function (data, callback) {
	pool.query(
		`SELECT name, phone, email, department_name  FROM staff JOIN ` +
			`departments ON staff.department_id=departments.id WHERE ` +
			`${data.searchType} LIKE '%${data.searchValue}%' ORDER BY staff.id;`,
		function (error, results, fields) {
			if (error) {
				console.log('Error!', '\n',error.sqlMessage,'\n', error.sql);
			}
			let bdResponse = JSON.stringify(results);
			callback(bdResponse);
		}
	);
};


module.exports.auth_log = function(id) {
	pool.query(
		`INSERT INTO auth_log (id) values (${id});`, 
		function (error, results, fields) {
			if (error) 
				console.log('Error!\n', error.sqlMessage,'\n', error.sql);
			else
				console.log('auth attempt was recorded\n');
		}
	)
}

module.exports.change_log = function(email, changed_by, change_type='delete') {
	pool.query('START TRANSACTION;', () => {
		let id;
		pool.query(
			`SELECT id FROM staff WHERE email = '${email}';`,
			function (error, results, fields) {
				if (error) {
					pool.query('ROLLBACK;')
					console.log('\nerror in transaction: 1st query\n\n',error.sqlMessage,'\n', error.sql);
					return;
				} 
				id = results[0].id;
				pool.query(
					'INSERT INTO change_log (id, change_type, changed_by) VALUES (?, ?, ?);',
					[
						id, 
						change_type,
						changed_by
					],
					function (error, results, fields) {
						if (error) {
							pool.query('ROLLBACK;')
							console.log('\nerror in transaction: 2nd query\n\n',error.sqlMessage,'\n', error.sql);
							return;
						} 
						pool.query('COMMIT;')
						console.log(`\nchange (${change_type}) was recorded\n`);
					}
				);
			}
		);
	});
}