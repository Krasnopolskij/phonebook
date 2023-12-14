connection.beginTransaction(function (err) {
    if (err) {
      return connection.rollback(function () {
        console.log(err);
        res.sendStatus(400);
      });
    }
    connection.query(
      sqlSelectPerformance1,
      [id, id, id, id],
      function (err, results) {
        if (err) {
          return connection.rollback(function () {
            console.log(err);
            res.sendStatus(400);
          });
        }
        res1 = results;
        connection.query(sqlSelectPerformance2, [id], function (err, results) {
          if (err) {
            return connection.rollback(function () {
              console.log(err);
              res.sendStatus(400);
            });
          }
          res2 = results;
          connection.commit(function (err) {
            if (err) {
              return connection.rollback(function () {
                console.log(err);
                res.sendStatus(400);
              });
            }