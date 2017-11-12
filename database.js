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
      connection.query(`INSERT INTO ${table} (${cols}) VALUES ${values}`, (error, result) => {
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
      connection.query( (error, result) => {
        connection.release();
        if(error) reject(error);
        resolve(result);
      });
    });
  });
}
