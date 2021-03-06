var http = require('http'),
    express = require('express'),
    path = require('path'),
    app = express(),
    alert = require('alert-node');
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    jwt = require('jsonwebtoken'),
    Users = require('./model/Users'),
    Filmes = require('./model/Filmes');

const TOKEN = '1358@asdfg';

// require("dotenv-safe").load();
app.use(bodyParser.json({limit: '50mb'}));       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true,
    limit: '50mb'
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());

app.use(cookieParser());

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
    Filmes.find({}, 0).then(result => {

        res.render('index', { filmes: result });
    });
});

app.get('/profile', verifyJWT, (req, res) => {
    res.render('profile');
    res.status(200);
});

app.get('/filme', verifyJWT, (req, res) => {

    res.render('filme');
    
});

app.post('/filme/cadastro', verifyJWT, (req, res) => {
    var filme = new Filmes(req.body);
    filme.save();


    res.redirect('/configuracao');
    res.end();
});

app.post('/filme/delete', verifyJWT, (req, res) => {
    var filme = new Filmes(req.body);
    filme.delete();

    res.send(filme);
});

app.post('/filme/update', verifyJWT, (req, res) => {
    var filme = new Filmes(req.body);
    filme.save();

    res.send(filme);
    
});

app.get('/configuracao', verifyJWT, (req, res) => {
    Filmes.find({}, 0).then(result => {

        res.render('configuracao', { filmes: result });
    });
});


app.get('/busca', (req, res) => {
    console.log(req.query);

    if (req.query.nome !== undefined) {
        Filmes.find({nome: new RegExp(req.query.nome, 'i') }, 0).then(result => {
            console.log(result)
            res.send(result);
        });
    } else if (req.query.ano !== undefined) {
        console.log('passou ano')
        Filmes.find({ano: new RegExp(req.query.ano, 'i')}, 0).then(result => {
            res.send(result);
        });
    } else if (req.query.sinopse !== undefined) {
        Filmes.find({sinopse: new RegExp(req.query.sinopse, 'i')}, 0).then(result => {
            res.send(result);
        });
    }
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
                res.redirect('/configuracao');

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
        
                if (userFound.length) {
                    alert('Já existe um usuário cadastrado com este nome');
                    res.redirect('cadastro');
                    res.end();
                }          
        
                else {
                    Users.insert(username, email, senha).then(() => {
                        alert('Cadastro realizado com sucesso');
                        res.redirect('login');
                        res.end();
                    });
                }
            });
        }
    });

    
});

var porta = process.env.PORT || 8080;
http.createServer(app).listen(porta);

function verifyJWT(req, res, next) {
    console.log(req.cookies.token);
    var token = req.cookies.token;
    // if(!token) return res.status(401).send({auth: false, message: 'No token provided.'});

    if(!token) {
        alert('Você precisa estar logado para acessar este conteúdo');
        res.redirect('/');
        res.status(401);
        res.end();
    }

    else {

        jwt.verify(token, TOKEN, function(err, decoded) {
            // if(err) return res.status(500).send({auth: false, message: 'Token inválido'});
            if(err) {
                
                alert('Token inválido');
                res.redirect('/');
                res.status(500);
                res.end();
            }

            else {
                res.status(200);
                req.userId = decoded.id;
                next();
            }
        });
    }
}