const db			   = require('../../database');
const { Router } = require('express');

var router = new Router();

const BASE_TABLE        = 'concentrations';
const BASE_URL          = '/concentrations';
const LIST_ALL_TEMPLATE = 'concentrations';
const SHOW_ONE_TEMPLATE = 'concentration';
const ADD_EDIT_FORM     = 'concentration-form';

// Get all
router.get('/', (req,res,next) => {
  let context = {};
  db.listAll(BASE_TABLE).then( (data) => {
    context.concentrations = data;
    res.render(LIST_ALL_TEMPLATE, context);
  });
});

router.get('/add', (req,res,next) => {
  let context = {};
  res.render(ADD_EDIT_FORM, context);
});

router.post('/add', (req,res,next) => {
  let b = req.body;
  db.createRow(BASE_TABLE, 'title,description',`"${b.title}","${b.description}"` )
  .then( data => res.redirect(`${BASE_URL}/${data.insertId}`) )
  .catch( (e) => {
    console.log(e, e.stack);
    res.redirect(BASE_URL);
  });
});

// Get 1
router.get('/:id', (req,res,next) => {
  let context = {};
  db.selectById(BASE_TABLE, req.params.id).then( (data) => {
    if(data.length){
      context.concentration = data[0];
      res.render(SHOW_ONE_TEMPLATE, context);
    } else {
      context.error = "No Concentration Found";
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
  db.selectById(BASE_TABLE, req.params.id).then( (data) => {
    if(data.length){
      context.concentration = data[0];
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
  let update_vals = [ `title="${req.body.title}"`,
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
