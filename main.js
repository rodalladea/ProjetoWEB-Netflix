var http = require('http'),
    express = require('express'),
    path = require('path'),
    app = express(),
    Users = require('./model/Clientes'),
    Filmes = require('./model/Filmes');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'img')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.get('/', (req, res) => {
    res.render('index');
});

app.post('/cadastrar_usuario', (req,res) => {

    Users.insert(req.body.usuario, req.body.senha).then(() => {
        console.log('Bem vindo ' + Users.find(req.body.usuario))
    })
    

    res.end();
});

http.createServer(app).listen(3000);