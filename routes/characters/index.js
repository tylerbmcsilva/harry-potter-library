const db			   = require('../../database');
const { Router } = require('express');

var router = new Router();

const BASE_TABLE        = 'hpcharacter';
const BASE_URL          = '/characters';
const LIST_ALL_TEMPLATE = 'characters';
const SHOW_ONE_TEMPLATE = 'character';
const ADD_EDIT_FORM     = 'character-form';

// Get all
router.get('/', (req,res,next) => {
  let context = {};
  db.listAll(BASE_TABLE).then( (data) => {
    context.characters = data;
    res.render(LIST_ALL_TEMPLATE, context);
  });
});

router.get('/add', (req,res,next) => {
  let context = {};
  res.render(ADD_EDIT_FORM, context);
});

router.post('/add', (req,res,next) => {
  let b = req.body;
  let birth_string = '';
  let death_string = '';

  if(b.birth != ""){
    let birth = new Date(b.birth);
    birth_string =`${birth.getFullYear()}-${birth.getMonth()+1}-${birth.getDate()}`;
  }
  if(b.death != "") {
    let death = new Date(b.death);
    death_string = `${death.getFullYear()}-${death.getMonth()+1}-${death.getDate()}`
  }
  db.createRow(BASE_TABLE, 'name, hometown, birth, death, description',`"${b.name}","${b.hometown}","${birth_string}","${death_string}","${b.description}"` )
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
    db.selectById(BASE_TABLE, req.params.id).then( data => context.character = data[0] ),
    db.query(`SELECT c.id, c.title FROM concentrations c
      INNER JOIN hpcharacter_concentrations hpcc ON c.id = hpcc.concentration_id
      INNER JOIN hpcharacter hpc ON hpc.id = hpcc.hpcharacter_id
      WHERE hpc.id = ${req.params.id}`).then( data => context.concentrations = data ),
    db.query(`SELECT p.id, p.name FROM pet p
      INNER JOIN hpcharacter c ON p.owner_id = c.id
      WHERE c.id = ${req.params.id}`).then( data => context.pets = data ),
    db.query(`SELECT c2.id, c2.name, r.relation FROM hpcharacter c
      INNER JOIN hpcharacter_relations r ON c.id = r.char1_id
      INNER JOIN hpcharacter c2 ON c2.id = r.char2_id
      WHERE c.id = ${req.params.id}`).then( data => context.relations = data )
  ]

  Promise.all(promise_arr)
  .then( ()=> {
    res.render(SHOW_ONE_TEMPLATE, context);
  })
  .catch( (e) => {
    console.log(e, e.stack);
    context.error = e;
    res.render(SHOW_ONE_TEMPLATE, context);
  })
});

router.get('/:id/edit', (req,res,next) => {
  let context = {};
  db.selectById(BASE_TABLE, req.params.id).then( (data) => {
    if(data.length){
      context.character = data[0];
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
  let birth = new Date(req.body.birth);
  let death = new Date(req.body.death);
  let update_vals = [ `name="${req.body.name}"`,
                      `hometown="${req.body.hometown}"`,
                      `birth="${birth.getFullYear()}-${birth.getMonth()+1}-${birth.getDate()}"`,
                      `death="${death.getFullYear()}-${death.getMonth()+1}-${death.getDate()}"`,
                      `description="${req.body.description}"`
                    ].join(',');

  db.updateRowById(BASE_TABLE, update_vals, req.body.id).then( (data) => {
    res.redirect(`/characters/${req.body.id}`);
  })
  .catch( (e) => {
    console.log(e, e.stack);
    res.redirect(BASE_URL);
  });
})

module.exports = router;
