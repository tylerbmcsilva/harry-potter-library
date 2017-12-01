const { Router } = require('express');

const adminRouter         = require('./admin');
const characterRouter     = require('./characters');
const concentrationRouter = require('./concentrations');
const housesRouter        = require('./houses');
const petsRouter          = require('./pets');
const schoolsRouter       = require('./schools');

var router = new Router();

router.get('/', (req, res) => res.render('index') );
// router.use('/admin', adminRouter);
router.use('/characters', characterRouter);
router.use('/concentrations', concentrationRouter);
router.use('/houses', housesRouter);
router.use('/pets', petsRouter);
router.use('/schools', schoolsRouter);

module.exports = router;
