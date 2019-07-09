let Mongo = require('./Mongo');

module.exports = class Filme extends Mongo {

    constructor(data) {
        super(data);
        this._id = data._id;
        this.nome = data.nome;
        this.ano = data.ano;
        this.img = data.img;
        this.sinopse = data.sinopse;
        this.collection = 'filmes';
    }

    static find(query = {}, limit = 0) {
        return super.find(query, {nome: 1}, limit, 'filmes').then(result => {
            return result.map(filme => new Filme(filme));
        });
    }

    
}