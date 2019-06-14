var http = require('http'),
    express = require('express'),
    path = require('path'),
    app = express(),
    alert = require('alert-node');
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    jwt = require('jsonwebtoken'),
    Users = require('./model/Users');

const TOKEN = '1358@asdfg';

// require("dotenv-safe").load();
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());

app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'img')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/cadastro', (req, res) => {
    res.render('cadastro');
});


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/profile', verifyJWT, (req, res) => {
    res.render('profile');
    res.status(200);
});

app.post('/login', (req, res) => {
    let login = req.body.login;
    let senha = req.body.senha;

    Users.findByUsername(login).then((user) => {

        // console.log(user[0]);
        if(user.length){

            if(user[0].senha == senha) { 
                //auth ok
                // res.cookie('login', user.nome);
                
                const id = user[0]._id;
                console.log('Login realizado com sucesso');
                console.log(id);

                var token = jwt.sign({ id }, TOKEN, {
                    expiresIn: 60*60
                });
                console.log(token);

                res.cookie('token',token);
                res.redirect('/profile');

            }
            else {
                res.status(403);
                alert('Erro de Autenticação!');
                
                // res.write('<h1>Erro de autenticação!</h1>');
            }
        }

        else {
            res.status(500);
            alert('Login Inválido!');
        }
        res.end();
    });
});

app.post('/', (req, res) => {

    let username = req.body.usuario,
        email = req.body.email,
        senha = req.body.senha;
    
    

    Users.findByEmail(email).then((emailFound) => {
        console.log(emailFound[0]);

        if (emailFound.length) 
             alert('Já existe um usuário cadastrado com este email');   
             
        else {
            Users.findByUsername(username).then((userFound) => {

                console.log(userFound[0]);
        
                if (userFound.length) 
                     alert('Já existe um usuário cadastrado com este nome');            
        
                else {
                    Users.insert(username, email, senha).then(() => {
                        alert('Cadastro realizado com sucesso');
                    });
                }
            });
        }
    });

    res.redirect('cadastro');
    res.end();
});

http.createServer(app).listen(3000);

function verifyJWT(req, res, next) {
    console.log(req.cookies);
    var token = req.cookies.token;
    if(!token) return res.status(401).send({auth: false, message: 'No token provided.'});

    jwt.verify(token, TOKEN, function(err, decoded) {
        if(err) return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});

        req.userId = decoded.id;
        next();
    })
}