const express = require('express');
const app = express();
const port = process.env.PORT || 3001;


//const fetch = require('node-fetch');
//const cookieSession = require('cookie-session')
//const expressSession = require('express-session')



app.set('trust proxy', true);



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
























app.get('/api/get_list', (req, res) => {
    var list = ['item1', 'item2', 'item3'];
    res.json(list);
    console.log(req.ip);
});

app.get('/api/get_users', (req, res) => {
    var list = ['Вова', 'Вася', 'Петя'];
    res.json(list);
    console.log(req.ip);
});





app.listen(port);
console.log('App is listening on port ' + port);