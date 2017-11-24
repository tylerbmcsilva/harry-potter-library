const db			   = require('../../database');
const { Router } = require('express');

var router = new Router();

const BASE_TABLE        = 'school';
const BASE_URL          = '/schools';
const LIST_ALL_TEMPLATE = 'schools';
const SHOW_ONE_TEMPLATE = 'school';
const ADD_EDIT_FORM     = 'school-form';

// Get all
router.get('/', (req,res,next) => {
  let context = {};
  db.listAll(BASE_TABLE).then( (data) => {
    context.schools = data;
    res.render(LIST_ALL_TEMPLATE, context);
  });
});

router.get('/add', (req,res,next) => {
  let context = {};
  res.render(ADD_EDIT_FORM, context);
});

router.post('/add', (req,res,next) => {
  let b = req.body;
  db.createRow(BASE_TABLE, 'name,yearfounded,location,description',`"${b.name}","${b.yearfounded}","${b.location}","${b.description}"` )
  .then( data => res.redirect(`${BASE_URL}/${data.insertId}`) )
  .catch( (e) => {
    console.log(e, e.stack);
    res.redirect(BASE_URL);
  });
});

// Get 1
router.get('/:id', (req,res,next) => {
  let context = {};
  let promise_arr = [
    db.selectById(BASE_TABLE, req.params.id).then((data) => context.school = data[0]),
    db.query(`SELECT h.id, h.name FROM house h
      INNER JOIN school s ON s.id = h.school_id
      WHERE s.id = ${req.params.id}`).then((data) => context.houses = data ),
      db.query(`SELECT c.id, c.name FROM hpcharacter c
        INNER JOIN house h ON c.house_id = h.id
        INNER JOIN school s ON s.id = h.school_id
        WHERE s.id = ${req.params.id}`).then( (data) => context.characters = data )
  ]
  Promise.all(promise_arr)
  .then( () => {
    res.render(SHOW_ONE_TEMPLATE, context);
  })
  .catch( (e) => {
    console.log(e, e.stack);
    context.error = e;
    res.render(SHOW_ONE_TEMPLATE, context);
  });


});

router.get('/:id/edit', (req,res,next) => {
  let context = {};
  db.selectById(BASE_TABLE, req.params.id).then( (data) => {
    if(data.length){
      context.school = data[0];
      res.render(ADD_EDIT_FORM, context);
    } else {
      res.redirect(BASE_URL);
    }
  })
  .catch( (e) => {
    console.log(e, e.stack);
    res.redirect(BASE_URL);
  })
});

router.post('/:id/edit', (req,res,next) => {
  let update_vals = [ `name="${req.body.name}"`,
                      `yearfounded="${req.body.yearfounded}"`,
                      `location="${req.body.location}"`,
                      `description="${req.body.description}"`
                    ].join(',');

  db.updateRowById(BASE_TABLE, update_vals, req.body.id)
  .then( data => res.redirect(`${BASE_URL}/${req.body.id}`) )
  .catch( (e) => {
    console.log(e, e.stack);
    res.redirect(BASE_URL);
  });
})

module.exports = router;
