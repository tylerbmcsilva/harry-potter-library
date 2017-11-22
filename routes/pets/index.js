const db			   = require('../../database');
const { Router } = require('express');

var router = new Router();

// Get all
router.get('/', (req,res,next) => {
  res.render('pets');
});

// Create 1
router.post('/', (req,res,next) => {
  res.send('create');
});

// Get 1
router.get('/:id', (req,res,next) => {
  res.send('get');
});

// Update 1
router.put('/:id',  (req,res,next) => {
  res.send('update');
});

// Delete 1
router.delete('/:id',  (req,res,next) => {
  res.send('delete');
});

module.exports = router;
