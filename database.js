const config        = require('./config');
const mysql         = require('mysql');
const { Promise }   = require('bluebird');

const db = mysql.createPool(config);

exports.createTable = (table, attributes) => {
  return new Promise( (resolve, reject) => {
    db.getConnection((err, connection) => {
      if(err) reject(err);
      connection.query(`CREATE TABLE ${table} (${attributes})  ENGINE=InnoDB;`, (error, result) => {
        connection.release();
        if(error) reject(error);
        resolve(result);
      });
    });
  });
}

exports.dropTable = (table) => {
  return new Promise( (resolve, reject) => {  db.getConnection((err, connection) => {
      if(err) reject(err);
      connection.query(`DROP TABLE IF EXISTS ${table}`, (error, result) => {
        connection.release();
        if(error) reject(error);
        resolve(result);
      });
    });
  });
}

exports.listAll = (table) => {
  return new Promise( (resolve, reject) => {
    db.getConnection( (err, connection) => {
      if(err) reject(err);
      connection.query(`SELECT * FROM ${table}`, (error, result) => {
        connection.release();
        if(error) reject(error);
        resolve(result);
      });
    });
  });
}

exports.createRow = (table, cols, values) => {
  return new Promise( (resolve, reject) => {
    db.getConnection( (err, connection) => {
      if(err) reject(err);
      connection.query(`INSERT INTO ${table} (${cols}) VALUES (${values});`, (error, result) => {
        connection.release();
        if(error) reject(error);
        resolve(result);
      });
    })
  });
}

exports.updateRowById = (table, vals, id) => {
  return new Promise( (resolve, reject) => {
    db.getConnection( (err, connection) => {
      if(err) reject(err);
      connection.query(`UPDATE ${table} SET ${vals} WHERE id = ${id};`, (error, result) => {
        connection.release();
        if(error) reject(error);
        resolve(result);
      });
    })
  });
}

exports.selectById = (table, id) => {
  return new Promise( (resolve, reject) => {
    db.getConnection( (err, connection) => {
      if(err) reject(err);
      connection.query(`SELECT * FROM ${table} WHERE id = ${id} LIMIT 1;`, (error, result) => {
        connection.release();
        if(error) reject(error);
        resolve(result);
      });
    })
  });
}

exports.deleteById = (table, id) => {
  return new Promise( (resolve, reject) => {
    db.getConnection( (err, connection) => {
      if(err) reject(err);
      connection.query(`DELETE FROM ${table} WHERE id = ${id};`, (error, result) => {
        connection.release();
        if(error) reject(error);
        resolve(result);
      });
    })
  });
}

exports.query = (query) => {
  return new Promise( (resolve, reject) => {
    db.getConnection( (err, connection) => {
      if(err) reject(err);
      connection.query( query, (error, result) => {
        connection.release();
        if(error) reject(error);
        resolve(result);
      });
    });
  });
}
