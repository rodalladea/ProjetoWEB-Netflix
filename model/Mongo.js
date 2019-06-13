let client = require('mongodb').MongoClient;
let conn = client.connect('mongodb://localhost:27017/netflix', {useNewUrlParser: true})
            .then(conn => {
                return {
                    db: conn.db('netflix'),
                    close: function() {
                        conn.close();
                    }
                };
            });


module.exports = class Mongo {
    save() {
        if (this.id) {
            return conn.then(conn => {
                console.log("Salvo");
                return conn.db.collection(this.collection).updateOne({id: this.id}, {$set: this});
            });
        }

        return conn.then(conn => {
            console.log("Criado");
            return conn.db.collection(this.collection).insertOne(this);
        });
    }

    delete() {
        if (this.id) {
            return conn.then(conn => {
                return conn.db.collection(this.collection).deleteOne({id: this.id});
            });
        }

        return null;
    }

    static find(query = {}, sort = {}, limit = 5, collection) {
        return conn.then(conn => {
            return conn.db.collection(collection).find(query).sort(sort).limit(limit)
                          .toArray();
        });
    }

    static close() {
        conn.then(conn => conn.close());
    }
}