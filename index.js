var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);


const Security = require('application/express/components/base/Security');
const Instances = require('application/express/vendor/Instances');


server.listen(3001);
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {

    Security.get_instance(Instances.init()).run();




  res.send('Hello world!');
});

io.on('connection', function (socket) {


    socket.emit('news', { hello: 'world' });

    socket.on('api', function (data) {

        Security.get_instance(Instances.init()).run(data);

        socket.emit('news', { hello: 'world' });


  });
});


























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


/*



const Express = require('express');

const app = Express();
const port = process.env.PORT || 3001;
app.set('trust proxy', true);





var MySql = require('sync-mysql');



var connection = new MySql({
  host: 'localhost',
  user: 'root',
  password: '111',
  database: 'wlandmarks',
});


let result = [];
try{
result = connection.query("SELECT * FROM country where id = ? or id = ?", [1,9]);
} catch(e){console.log(9999999999);
console.log(e.code);
}
console.log(result);




const mysql2 = require('mysql2');

// create the connection to database
const connection2 = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '111',
  database: 'wlandmarks'
}).promise();

// simple query

let result = connection2.query("SELErtCT * FROM country where id = ? or id = ?",[1,9]).catch(err=>{console.log(err.code)}).then(r=>{console.log(r[0].length); return r[0];});


result.then((r)=>{console.log(111111111111111);console.log(r);});

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












const aaa = require('./bbb');
var bbb=new aaa();

try {bbb.methB();} catch(e){
 //console.log(e.stack);

}











var app = require('express')();

app.get('/:var1/:var2', (req, res) => {


console.log(req._parsedUrl.query);
res.send('sett');

  //  var list = ['item1', 'item2', 'item3'];
   // res.json(list);
   // console.log(req.ip);
});

//app.get('/:var1/:var2', (req, res) => {
 //   res.send(' '+module1.getcache());
//});





app.listen(3001);
console.log('App is listening on port ' + 3001);
*/