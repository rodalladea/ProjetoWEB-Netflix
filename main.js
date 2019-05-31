var http = require('http'),
    express = require('express'),
    path = require('path'),
    app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'img')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.get('/', (req, res) => {
    res.render('index');
});

http.createServer(app).listen(3000);