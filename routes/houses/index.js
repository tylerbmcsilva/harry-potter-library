const db			   = require('../../database');
const { Router } = require('express');

var router = new Router();

const BASE_TABLE        = 'house';
const BASE_URL          = '/houses';
const LIST_ALL_TEMPLATE = 'houses';
const SHOW_ONE_TEMPLATE = 'house';
const ADD_EDIT_FORM     = 'house-form';

// Get all
router.get('/', (req,res,next) => {
  let context = {};
  db.listAll(BASE_TABLE).then( (data) => {
    context.houses = data;
    res.render(LIST_ALL_TEMPLATE, context);
  });
});

router.get('/add', (req,res,next) => {
  let context = {
    school_id: req.query.school_id
  };
  db.listAll('hpcharacter')
  .then(data => {
    context.characters = data;
    res.render(ADD_EDIT_FORM, context)
  })
  .catch( (e) => {
    console.log(e, e.stack);
    res.redirect(BASE_URL);
  });
});

router.post('/add', (req,res,next) => {
  let b = req.body;
  if(!b.school_id){
    res.render(ADD_EDIT_FORM, {error: "No School ID"});
  } else {
    db.createRow(BASE_TABLE, 'name,animal,description,founder_id,school_id',`"${b.name}","${b.animal}","${b.description}",${b.founder_id},${b.school_id}` )
    .then( data => res.redirect(`${BASE_URL}/${data.insertId}`) )
    .catch( (e) => {
      console.log(e, e.stack);
      res.redirect(BASE_URL);
    });
  }
});

// Get 1
router.get('/:id', (req,res,next) => {
  let context = {};
  let promise_arr = [
    db.query(`SELECT s.name AS school_name, c.name AS founder_name, b.*  FROM ${BASE_TABLE} b
      INNER JOIN school s ON b.school_id = s.id
      INNER JOIN hpcharacter c ON b.founder_id = c.id
      WHERE b.id = ${req.params.id}`).then( data => context.data = data[0] ),
    db.query(`SELECT c.id, c.name FROM hpcharacter c
      INNER JOIN house h ON c.house_id = h.id
      WHERE h.id = ${req.params.id}`).then( (data) => context.characters = data )
  ];

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
  let promise_arr = [
    db.listAll('hpcharacter').then(data => context.characters = data),
    db.selectById(BASE_TABLE, req.params.id).then(data => context.house = data[0])
  ]
  Promise.all(promise_arr)
  .then( () => {
    if (context.house) {
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
                      `animal="${req.body.animal}"`,
                      `founder_id="${req.body.founder_id}"`,
                      `school_id="${req.body.school_id}"`,
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
