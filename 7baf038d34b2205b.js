pool.beginTransaction(function (err) {
    if (err) {
      return pool.rollback(function () {
        console.log(err);
        res.sendStatus(400);
      });
    }
    pool.query(
      sqlSelectPerformance1,
      [id, id, id, id],
      function (err, results) {
        if (err) {
          return pool.rollback(function () {
            console.log(err);
            res.sendStatus(400);
          });
        }
        res1 = results;
        pool.query(sqlSelectPerformance2, [id], function (err, results) {
          if (err) {
            return pool.rollback(function () {
              console.log(err);
              res.sendStatus(400);
            });
          }
          res2 = results;
          pool.commit(function (err) {
            if (err) {
              return pool.rollback(function () {
                console.log(err);
                res.sendStatus(400);
              });
            }