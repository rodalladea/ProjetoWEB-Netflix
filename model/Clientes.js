let client = require('mongodb').MongoClient;

module.exports = class Cliente {
    static find(usuario) {
        return client.connect(
            'mongodb://localhost:27017/netflix',
            {useNewUrlParser: true}).then((client) => {
                let db = client.db('netflix');
                return db.collection('clientes').find({"usuario": usuario}).toArray();
            });
    }

    static insert(usuario, senha) {
        return client.connect(
            'mongodb://localhost:27017/netflix',
        {useNewUrlParser:true}).then((client) => {
            let db = client.db('netflix');
            return db.collection('clientes').insertOne({"usuario": usuario, "senha": senha})
        }).catch((err) => {throw err;})
    }
    
}