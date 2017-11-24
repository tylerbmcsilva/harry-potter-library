const db			   = require('../../database');
const { Router } = require('express');

var router = new Router();

const BASE_TABLE        = 'pet';
const BASE_URL          = '/pets';
const LIST_ALL_TEMPLATE = 'pets';
const SHOW_ONE_TEMPLATE = 'pet';
const ADD_EDIT_FORM     = 'pet-form';

// Get all
router.get('/', (req,res,next) => {
  let context = {};
  db.listAll(BASE_TABLE).then( (data) => {
    context.pets = data;
    res.render(LIST_ALL_TEMPLATE, context);
  });
});

router.get('/add', (req,res,next) => {
  let context = {
    owner_id: req.query.owner_id
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
  console.log(req);
  let b = req.body;
  if(!b.owner_id){
    res.render(ADD_EDIT_FORM, {error: "No Owner..."});
  } else {
    db.createRow(BASE_TABLE, 'name,type,age,description,owner_id',
    `"${b.name}","${b.type}",${b.age ? b.age : "NULL"},"${b.description}",${b.owner_id}` )
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
  db.query(`SELECT o.name AS owner_name, p.*  FROM ${BASE_TABLE} p
    INNER JOIN hpcharacter o ON p.owner_id = o.id
    WHERE p.id = ${req.params.id}`)
    .then( (data) => {
      if(data.length){
        context.data = data[0];
        res.render(SHOW_ONE_TEMPLATE, context);
      } else {
        context.error = "No Pet Found";
        res.render(SHOW_ONE_TEMPLATE, context);
      }
    })
    .catch( (e) => {
      console.log(e, e.stack);
      context.error = e;
      res.render(SHOW_ONE_TEMPLATE, context);
    })
});

router.get('/:id/edit', (req,res,next) => {
  let context = {};
  let promise_arr = [
    db.listAll('hpcharacter').then(data => context.characters = data),
    db.selectById(BASE_TABLE, req.params.id).then(data => context.pet = data[0])
  ]
  Promise.all(promise_arr)
  .then( () => {
    if (context.pet) {
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
                      `type="${req.body.type}"`,
                      `age=${req.body.age ? req.body.age : "NULL" }`,
                      `owner_id="${req.body.owner_id}"`,
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
