const bodyParser	= require('body-parser');
const express 		= require('express');
const { Promise }	=	require('bluebird');

const PORT  = process.argv[2] || 3612;

const app 		= express();
const routes 	= require('./routes');
const db			= Promise.promisifyAll(require('./database'));

// var x = db.createTable('characters', 'id int(11) NOT NULL AUTO_INCREMENT,name varchar(255) NOT NULL,PRIMARY KEY (id)');
// console.log(x);
// db.createRow('characters', '`Tyler McSilva`');
// console.log(db.listAll('characters'));

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

app.use('/', routes );

// app.get('/reset-table',function(req,res,next){
//   var context = {};
//   db.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
//     var createString = "CREATE TABLE workouts("+
//     "id INT PRIMARY KEY AUTO_INCREMENT,"+
//     "name VARCHAR(255) NOT NULL,"+
//     "reps INT,"+
//     "weight INT,"+
//     "date DATE,"+
//     "lbs BOOLEAN)";
//     db.query(createString, function(err){
//       context.results = "Table reset";
//       res.render('index',context);
//     })
//   });
// });

app.get('*', (req,res) => res.redirect('/') );

app.use( (req,res) => res.send(404, 'Not Found') );

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500');
});

// db.dropTable('hp_characters').then(
// 	db.createTable('hp_characters', 'id int(32) PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL')
// 		.then( (a) => {
// 			console.log('success characters');
// 		})
// 		.catch( (e) => {
// 			console.log('fail to create');
// 			console.log(e);
// 		})
// ).catch( (e) => {
// 	console.log('Drop Fail');
// 	console.log(e);
// });
//
// db.listAllAsync('hp_characters')
// 	.then( (a) => {
// 		console.log('success characters 2');
// 	})
// 	.catch( (e) => {
// 		console.log('fail to load hp characters');
// 	});


app.listen(PORT, () => console.log(`Started on http://localhost:${PORT}; press Ctrl-C to terminate.`) );
