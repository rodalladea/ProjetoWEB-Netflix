const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://teste1:NsmeWnkhuRRKxoYv@cluster0-amaro.gcp.mongodb.net/test?retryWrites=true&w=majority";
const conn = MongoClient.connect(uri, { useNewUrlParser: true })
            .then(conn => {
                return {
                    db: conn.db('netflix'),
                    close: function() {
                        conn.close();
                    }
                }
            });

let ObjectId = require('mongodb').ObjectId;

module.exports = class Mongo {
    save() {
        if (this._id) {
            this._id = ObjectId(this._id);
            return conn.then(conn => {
                return conn.db.collection(this.collection).updateOne({_id: this._id}, {$set: this});
            });
        }

        return conn.then(conn => {
            return conn.db.collection(this.collection).insertOne(this);
        });
    }

    delete() {
        if (this._id) {
            return conn.then(conn => {
                return conn.db.collection(this.collection).deleteOne({_id: ObjectId(this._id)});
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
        conn.then(conn => {
            conn.close();
        });
    }
}