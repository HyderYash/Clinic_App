class DB {
  get_sql_exec = (sql_query) => {
    return new Promise(async (resolve, reject) => {
      global.connection.query(sql_query, async function (err, result) {
        if (err) reject(err + " SQL QUERY: " + sql_query);
        resolve(result);
      });
    });
  };
}

// File Export
module.exports = DB;
