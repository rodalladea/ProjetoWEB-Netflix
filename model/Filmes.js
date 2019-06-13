let client = require('mongodb').MongoClient;

module.exports = class Filme {
    static find() {
        return client.connect(
            'mongodb://localhost:27017/netflix',
            {useNewUrlParser: true}).then((client) => {
                let db = client.db('netflix');
                return db.collection('filmes').find({}).toArray();
            });
    }

    static insert(nome) {
        return client.connect('mongodb://localhost:27017/netflix',
        {useNewUrlParser:true}).then((client) => {
            let db = client.db('netflix');
            return db.collection('filmes').insertOne({"nome": nome})
        }).catch((err) => {throw err;})
    }
    
}