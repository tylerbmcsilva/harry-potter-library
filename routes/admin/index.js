const db			    = require('../../database');
const { Promise } = require('bluebird');
const { Router }  = require('express');

const router      = new Router();

router.use( (req, res, next) => {
  console.log('middleware');
  next();
});

router.get('/', (req,res,next) => {
  res.send('admin area');
})

// Get all
router.get('/reset-all-tables',(req,res,next) => {
  let dropTables = [
    db.dropTable('hp_characters')
  ];
  let createTables = [
    db.createTable('hp_characters', 'id int(32) PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL')
  ];
  let addData = [
    db.createRow('hp_characters', '`Tyler McSilva`')
  ]
  Promise.all(dropTables)
    .then(
      Promise.all(createTables)
        .then(
          Promise.all(addData)
          .then(
            res.send('success')
          )
        )
      );
});

// Create 1
router.post('/',(req,res,next) => {
  res.send('create');
});

// Get 1
router.get('/:id',(req,res,next) => {
  res.send('get');
});

// Update 1
router.put('/:id', (req,res,next) => {
  res.send('update');
});

// Delete 1
router.delete('/:id', (req,res,next) => {
  res.send('delete');
});

module.exports = router;
