let client = require('mongodb').MongoClient;

module.exports = class User {
    static findByUsername(usuario) {
        return client.connect(
            'mongodb://localhost:27017/netflix',
            {useNewUrlParser: true}).then((client) => {
                let db = client.db('netflix');
                return db.collection('users').find({"usuario": usuario}).toArray();
            });
    }

    static findByEmail(email) {
        return client.connect(
            'mongodb://localhost:27017/netflix',
            {useNewUrlParser: true}).then((client) => {
                let db = client.db('netflix');
                return db.collection('users').find({"email": email}).toArray();
            });
    }

    static insert(usuario, email, senha) {
        return client.connect(
            'mongodb://localhost:27017/netflix',
        {useNewUrlParser:true}).then((client) => {
            let db = client.db('netflix');
            return db.collection('users').insertOne({"usuario": usuario, "email": email, "senha": senha})
        }).catch((err) => {throw err;})
    }
    
}