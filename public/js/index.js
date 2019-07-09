setInterval(function () {
    let cards = document.getElementById('cards');
    var xmlhttp = new XMLHttpRequest();
    cards.innerHTML = '';
    xmlhttp.open('GET', 'https://projetoweb-netflix.herokuapp.com/busca?nome=', true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            const data = JSON.parse(xmlhttp.responseText);

            data.map((i) => {
                //console.log(i.nome, i.ano, i.sinopse);
                createElementCard(i.nome, i.ano, i.sinopse, i.img)
            });
        }
        
    };

    xmlhttp.onprogress = function(e) {
        if (e.lengthComputable) {
            document.getElementById('progress').max = e.total;
            document.getElementById('progress').value = e.loaded;
            document.getElementById('display').innerText = Math.floor((e.loaded / e.total) * 100) + '%';
        }
    };

    xmlhttp.onloadstart = function(e) {
        const markup = `
            <div id="progressBar">
                <progress id="progress" value="0"></progress>
                <span id="display"></span>
            </div>
        `;

        cards.insertAdjacentHTML('beforeend', markup);

        document.getElementById('progress').value = 0;
        document.getElementById('display').innerText = '0%';
    };

    xmlhttp.onloadend = function(e) {
        document.getElementById('progress').value = e.loaded;
        cards.removeChild(document.getElementById('progressBar'));
    };

    xmlhttp.send();
}, 120000);

document.querySelector('#busca').addEventListener("keyup", function () {
    var xmlhttp = new XMLHttpRequest();
    let lista = document.getElementById('lista_pesquisa');
    let select = document.getElementById('selector');
    let filtro = select.options[select.selectedIndex].value;
    
    xmlhttp.open('GET', 'https://projetoweb-netflix.herokuapp.com/busca?'+filtro+'=' + busca.value, true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            const data = JSON.parse(xmlhttp.responseText);
            lista_pesquisa.innerHTML = "";
            data.map((i) => {
                var option = document.createElement('option');
                if(filtro === 'nome')
                    option.value = i.nome;
                else if(filtro === 'ano')
                    option.value = i.ano;
                else 
                    option.value = i.sinopse;

                lista_pesquisa.appendChild(option);
            });
        }
    };
    xmlhttp.send();
});



document.getElementById('form-pesquisa').onsubmit = function (e) {
    e.preventDefault();
    //console.log('clicou no botão');
    let busca = document.getElementById('busca');
    let cards = document.getElementById('cards');
    let select = document.getElementById('selector');
    let filtro = select.options[select.selectedIndex].value;
    let xmlhttp = new XMLHttpRequest();
    const filme = busca.value;
    cards.innerHTML = "";

    xmlhttp.open('GET', 'https://projetoweb-netflix.herokuapp.com/busca?'+filtro+'=' + filme, true);

    xmlhttp.onreadystatechange = function () {

        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            const data = JSON.parse(xmlhttp.responseText);

            data.map((i) => {
                //console.log(i.nome, i.ano, i.sinopse);
                createElementCard(i.nome, i.ano, i.sinopse, i.img)
            });
        }
    };

    xmlhttp.onprogress = function(e) {
        if (e.lengthComputable) {
            document.getElementById('progress').max = e.total;
            document.getElementById('progress').value = e.loaded;
            document.getElementById('display').innerText = Math.floor((e.loaded / e.total) * 100) + '%';
        }
    };

    xmlhttp.onloadstart = function(e) {
        const markup = `
            <div id="progressBar">
                <progress id="progress" value="0"></progress>
                <span id="display"></span>
            </div>
        `;

        cards.insertAdjacentHTML('beforeend', markup);

        document.getElementById('progress').value = 0;
        document.getElementById('display').innerText = '0%';
    };

    xmlhttp.onloadend = function(e) {
        document.getElementById('progress').value = e.loaded;
        cards.removeChild(document.getElementById('progressBar'));
    };

    xmlhttp.send();
}


function createElementCard(nome, ano, sinopse, link) {
    let card = document.createElement("div");
    let img = document.createElement("img");
    let contCardNome = document.createElement("div");
    let contCardAno = document.createElement("div");
    let contCardSinopse = document.createElement("div");
    let labelNome = document.createElement("label");
    let labelAno = document.createElement("label");
    let labelSinopse = document.createElement("label");
    let pNome = document.createElement("p");
    let pAno = document.createElement("p");
    let pSinopse = document.createElement("p");

    card.className = 'card';
    img.className = 'img-card';
    contCardNome.className = 'conteudo-card';
    contCardAno.className = 'conteudo-card';
    contCardSinopse.className = 'conteudo-card';
    labelNome.className = 'campo-card';
    labelAno.className = 'campo-card';
    labelSinopse.className = 'campo-card';
    pNome.className = 'p-card';
    pAno.className = 'p-card';
    pSinopse.className = 'p-card';

    img.setAttribute('src', link);
    labelNome.setAttribute('for', 'nome');
    labelAno.setAttribute('for', 'ano');
    labelSinopse.setAttribute('for', 'sinopse');

    contCardNome.appendChild(labelNome);
    contCardNome.appendChild(pNome);
    contCardAno.appendChild(labelAno);
    contCardAno.appendChild(pAno);
    contCardSinopse.appendChild(labelSinopse);
    contCardSinopse.appendChild(pSinopse);

    card.appendChild(img);
    card.appendChild(contCardNome);
    card.appendChild(contCardAno);
    card.appendChild(contCardSinopse);

    cards.appendChild(card);

    labelNome.innerHTML = "Nome";
    labelAno.innerHTML = "Ano";
    labelSinopse.innerHTML = "Sinopse";
    pNome.innerHTML = nome;
    pAno.innerHTML = ano;
    pSinopse.innerHTML = sinopse;
}