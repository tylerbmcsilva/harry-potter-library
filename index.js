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

db.createTable('hp_characters', 'id int(32) NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)')
	.then( (a) => {
		console.log(a);
	})
	.catch( (e) => {
		console.log('error', e);
	});
db.createRow('hp_characters', 'name','("Tyler McSilva")')
	.then( (a) => {
		console.log(a);
	})
	.catch( (e) => {
		console.log('error', e);
	});



app.listen(PORT, () => console.log(`Started on http://localhost:${PORT}; press Ctrl-C to terminate.`) );
