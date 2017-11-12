const config        = require('./config');
const mysql         = require('mysql');
const { Promise }   = require('bluebird');

const db = mysql.createPool(config);

exports.createTable = (table, attributes, cb) => {
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

exports.dropTable = (table, cb) => {
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

exports.listAll = (table, cb) => {
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

exports.createRow = (table, values, cb) => {
  return new Promise( (resolve, reject) => {
    db.getConnection( (err, connection) => {
      if(err) reject(err);
      connection.query(`INSERT INTO ${table} VALUES (${values})`, (error, result) => {
        connection.release();
        if(error) reject(error);
        resolve(result);
      });
    })
  });
}

exports.query = (query, cb) => {
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
