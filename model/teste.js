let client = require("mongodb").MongoClient;

client.connect("mongodb://127.0.0.1:27017/netflix", {useNewUrlParser: true}, (err, conn) => {
    let db = conn.db("netflix");
    db.collection("clientes").find({}).toArray().then((clientes) => {
        console.log(clientes);
    });
});