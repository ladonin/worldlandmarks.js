/*var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3001);
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  res.send('Hello world!');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});





*/























/*const Fs = require('fs');*/
/*console.log(Fs.existsSync('index.js'));*/

//const ErrorHandler = require('modules/errorhandler/ErrorHandler');


//const fetch = require('node-fetch');
//const cookieSession = require('cookie-session')
//const expressSession = require('express-session')




/*const uniqid = require('uniqid');*/

/*
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

app.use(cookieSession({
  name: 'session3',
  keys: ['dfg', 'gsa'],
  //secret:'dtsdfsdfygdg',
   maxAge: 24 * 60 * 60 * 1000,
   path: '/api/11'
}));

app.use(expressSession({
  secret: 'v36u5i',
  name: 'sessionId',
  resave: false,
  saveUninitialized: false
}))

*/
/*
app.use(function (req, res, next) {
  console.log(req.session);


  var n = req.session.views || 0;
  n++;
  req.session.views = n;next();
  //res.end(n + ' views');
})
*/
/*
app.use(function (req, res, next) {
  console.log(req.session);
  res.cookie('name', 'tobi', { domain: '192.168.56.1', secure: false });
  var n = req.session.views || 0;
  n++;
  req.session.views = n;next();
  //res.end(n + ' views');
})


app.get('/api/1', (req, res) => {
//res.cookie('name', 'tobi');
var timer = setTimeout(()=>{res.send('j;jghjghj;sdl');}, 1000);
});

*/







const Express = require('express');

const app = Express();
const port = process.env.PORT || 3001;
app.set('trust proxy', true);




/*

var MySql = require('sync-mysql');



var connection = new MySql({
  host: 'localhost',
  user: 'root',
  password: '111',
  database: 'wlandmarks',
});


let result = [];
try{
result = connection.query("SELECT * FROM country where id = 3", []);
} catch(e){
console.log(e.code);
}
console.log(result);
*/



const mysql2 = require('mysql2');

// create the connection to database
const connection2 = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '111',
  database: 'wlandmarks'
}).promise();

// simple query

//connection2.query("SELECT * FRgM country where id = ? or id = ?",[1,9]).catch(err=>{console.log(err.code)}).then(r=>{console.log(r[0]);});






/*





let arr = [];
for (var i=0; i<5; i++){

    let u = i;
    arr[i]= new Promise((resolve, reject) => {console.log(u);
        resolve(pool.query("SELECT * FROM country where id = "+ u)); // получение объектов
    });
}


Promise.all(arr).then(value => {
  console.log(value);
}, reason => {
  console.log(reason)
});









/*
pool.execute("SELECT * FROM country limit 1", []) // изменение объектов
    .then(result =>{
      console.log(result[0]);
      //return pool.execute("SELECT * FROM users"); // получение объектов
    });
    /*.then(result =>{
      console.log(result[0]);
      pool.end();
    })
    .then(()=>{
      console.log("пул закрыт");
    })
    .catch(function(err) {
      console.log(err.message);
    });
*/














const module1 = require('./aaa');







app.get('/api/get_list', (req, res) => {


module1.sett();
res.send('sett');

  //  var list = ['item1', 'item2', 'item3'];
   // res.json(list);
   // console.log(req.ip);
});

app.get('/api/get_users', (req, res) => {
    res.send(' '+module1.gett());
});





app.listen(port);
console.log('App is listening on port ' + port);
