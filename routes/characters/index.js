const db			   = require('../../database');
const { Router } = require('express');

var router = new Router();

// Get all
router.get('/', (req,res,next) => {
  let context = {};
  db.listAll('hpcharacter').then( (data) => {
    context.characters = data;
    res.render('characters', context);
  })

});

router.get('/add', (req,res,next) => {
  let context = {};
  res.render('character-form', context);
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
  db.createRow('hpcharacter', 'name, hometown, birth, death, description',`"${b.name}","${b.hometown}","${birth_string}","${death_string}","${b.description}"` )
  .then( data => res.redirect(`/characters/${data.insertId}`) )
  .catch( (e) => {
    console.log(e, e.stack);
    res.redirect('/characters');
  });
});

// Get 1
router.get('/:id', (req,res,next) => {
  let context = {};
  db.selectById('hpcharacter', req.params.id).then( (data) => {
    if(data.length){
      context.character = data[0];
      res.render('character', context);
    } else {
      context.error = "No Character Found";
      res.render('character', context);
    }
  })
  .catch( (e) => {
    console.log(e, e.stack);
    context.error = e;
    res.render('character', context);
  })

});
router.get('/:id/edit', (req,res,next) => {
  let context = {};
  db.selectById('hpcharacter', req.params.id).then( (data) => {
    if(data.length){
      context.character = data[0];
      res.render('character-form', context);
    } else {
      res.redirect('/characters');
    }
  })
  .catch( (e) => {
    console.log(e, e.stack);
    res.redirect('/characters');
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

  db.updateRowById('hpcharacter', update_vals, req.body.id).then( (data) => {
    res.redirect(`/characters/${req.body.id}`);
  })
  .catch( (e) => {
    console.log(e, e.stack);
    res.redirect('/characters');
  });
})

// Update 1
router.put('/:id',  (req,res,next) => {
  res.send('update');
});

// Delete 1
router.delete('/:id',  (req,res,next) => {
  res.send('delete');
});

module.exports = router;
