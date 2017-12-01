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
  db.listAll('house')
  .then( (data) => {
    context.houses = data;
    res.render(ADD_EDIT_FORM, context);
  })
  .catch( (e) => {
    console.log(e, e.stack);
    res.redirect(BASE_URL);
  });
});

router.post('/add', (req,res,next) => {
  let b = req.body;
  let birth_string = "NULL";
  let death_string = "NULL";

  if(b.birth !== ""){
    let birth = new Date(b.birth);
    birth_string =`${birth.getFullYear()}-${birth.getMonth()+1}-${birth.getDate()}`;
  }
  if(b.death !== "") {
    let death = new Date(b.death);
    death_string = `${death.getFullYear()}-${death.getMonth()+1}-${death.getDate()}`
  }
  db.createRow(BASE_TABLE, 'name, hometown, birth, death, description, house_id',`"${b.name}","${b.hometown}","${birth_string}","${death_string}","${b.description}",${b.house_id ? b.house_id : "NULL"}` )
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
      WHERE c.id = ${req.params.id}`).then( data => context.relations = data ),
    db.query(`SELECT s.name AS school_name, s.id AS school_id, h.name AS house_name, h.id AS house_id FROM house h
      INNER JOIN hpcharacter c ON c.house_id = h.id
      INNER JOIN school s ON s.id = h.school_id
      WHERE c.id = ${req.params.id}`).then( data => context.school = data[0] )
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

router.get('/:id/delete', (req,res,next) => {
  let context = {};
  let promise_arr = [
    db.selectById(BASE_TABLE, req.params.id).then( data => context.character = data[0] ),
    db.query(`SELECT p.id, p.name FROM pet p
      INNER JOIN hpcharacter c ON p.owner_id = c.id
      WHERE c.id = ${req.params.id}`).then( data => context.pets = data )
  ]

  Promise.all(promise_arr)
  .then( ()=> {
    res.render('character-delete', context);
  })
  .catch( (e) => {
    console.log(e, e.stack);
    context.error = e;
    res.redirect('/characters')
  })
});

router.post('/:id/delete', (req,res,next) => {
  db.deleteById(BASE_TABLE, req.params.id)
  .then( (data) => {
    res.redirect('/characters');
  })
  .catch( (e) => {
    console.log(e, e.stack);
    res.redirect('/characters')
  });
});

router.get('/:id/edit', (req,res,next) => {
  let context = {};
  let promise_arr = [
    db.listAll('house').then( (data) => context.houses = data ),
    db.selectById(BASE_TABLE, req.params.id).then( (data) => context.character = data[0] )
  ]
  Promise.all(promise_arr)
  .then( () => {
    res.render(ADD_EDIT_FORM, context);
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
                      `description="${req.body.description}"`,
                      `house_id="${req.body.house_id ? req.body.house_id : "NULL"}"`
                    ].join(',');

  db.updateRowById(BASE_TABLE, update_vals, req.body.id).then( (data) => {
    res.redirect(`/characters/${req.body.id}`);
  })
  .catch( (e) => {
    console.log(e, e.stack);
    res.redirect(BASE_URL);
  });
});

router.get('/:id/add-concentration', (req,res,next) => {
  let context = {};
  db.listAll('concentrations').then( data => {
    context.concentrations = data;
    res.render('character-add-concentration', context);
  })
  .catch( (e) => {
    console.log(e, e.stack);
    res.redirect(BASE_URL);
  });
});

router.post('/:id/add-concentration', (req,res,next) => {
  db.createRow('hpcharacter_concentrations', 'hpcharacter_id,concentration_id',
    `${req.params.id},${req.body.concentration_id}`)
    .then( data => {
      res.redirect(`${BASE_URL}/${req.params.id}`)
    })
});

router.get('/:id/add-relation', (req,res,next) => {
  let context = {};
  db.listAll('hpcharacter').then( data => {
    context.characters = data;
    res.render('character-add-relation', context);
  })
  .catch( (e) => {
    console.log(e, e.stack);
    res.redirect(BASE_URL);
  });
});

function inverseRelation(r) {
  switch(r) {
    case "Parent":
      return "Child";
      break;
    case "Child":
      return "Parent";
      break;
    case "Spouse":
      return "Spouse";
      break;
    case "Sibling":
      return "Sibling";
      break;
    default:
      return;
  }
}

router.post('/:id/add-relation', (req,res,next) => {
  let inverse = inverseRelation(req.body.relation);
  db.query(`INSERT INTO hpcharacter_relations (char1_id,char2_id,relation) VALUES (${req.params.id},${req.body.char2_id},"${req.body.relation}"),(${req.body.char2_id},${req.params.id},"${inverse}")`)
    .then( data => {
      res.redirect(`${BASE_URL}/${req.params.id}`)
    })
    .catch( (e) => {
      console.log(e, e.stack);
      res.redirect(BASE_URL);
    });
});

module.exports = router;
