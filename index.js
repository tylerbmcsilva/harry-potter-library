const bodyParser	= require('body-parser');
const express 		= require('express');
const { Promise }	=	require('bluebird');

const PORT  = process.argv[2] || 3612;

const app 		= express();
const routes 	= require('./routes');
const db			= Promise.promisifyAll(require('./database'));

// SET VIEW ENGINE
const hbs 		= require('express-handlebars').create({
	defaultLayout:'main',
	extname: '.hbs'
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// ALLOW BODY PARSER
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// SET PUBLIC FOLDER
app.use(express.static('public'));

// ENTER WEBAPP
app.use('/', routes );

// FALLBACK
app.get('*', (req,res) => res.redirect('/') );

// ERRORS
app.use( (req,res) => res.send(404, 'Not Found') );
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500');
});


app.listen(PORT, () => console.log(`Started on http://localhost:${PORT}; press Ctrl-C to terminate.`) );
