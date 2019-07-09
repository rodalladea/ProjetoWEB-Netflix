document.querySelector('#busca').addEventListener("keyup", function () {
    var xmlhttp = new XMLHttpRequest();
    let lista = document.getElementById('lista_pesquisa');
    let select = document.getElementById('selector');
    let filtro = select.options[select.selectedIndex].value;
    
    xmlhttp.open('GET', 'http://localhost:8080/busca?'+filtro+'=' + busca.value, true);
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

    xmlhttp.open('GET', 'http://localhost:8080/busca?'+filtro+'=' + filme, true);

    xmlhttp.onreadystatechange = function () {

        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            const data = JSON.parse(xmlhttp.responseText);

            data.map((i) => {
                //console.log(i.nome, i.ano, i.sinopse);
                createElementCard(i._id, i.nome, i.ano, i.sinopse, i.img)
            });

            setSubmitsUp();
            setSubmitsDel();
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


function createElementCard(id, nome, ano, sinopse, link) {
    const markup = `
        <div id="card-${id}" class="card">
            <form class="form-update" action="/filme/update" method="POST">
                <input type="hidden" name="_id" value="${id}">
                <input id="link-${id}-up" type="hidden" name="img" value="${link}">
                <img id="poster-${id}-up" src="${link}" class="img-card">

                <input id="${id}" type="file" name="img-nome"  oninput="readImage(event)">
                <div class="conteudo-card">
                    <label class="campo-card" for="nome">Nome</label>
                    <input id="nome-${id}-up" type="text" name="nome" value="${nome}">
                </div>
                <div class="conteudo-card">
                    <label class="campo-card" for="ano">Ano</label>
                    <input id="ano-${id}-up" type="number" name="ano" value="${ano}">
                </div>
                <div class="conteudo-card">
                    <label class="campo-card" for="sinopse">Sinopse</label>
                    <input id="sinopse-${id}-up" type="text" name="sinopse" value="${sinopse}">
                </div>
                <input id="${id}" type="submit" value="Atualizar">
            </form>

            <form class="form-delete" action="/filme/delete" method="POST">
                <input type="hidden" name="_id" value="${id}">
                <input id="nome-${id}-del" type="hidden" name="nome" value="${nome}">
                <input id="ano-${id}-del" type="hidden" name="ano" value="${ano}">
                <input id="sinopse-${id}-del" type="hidden" name="sinopse" value="${sinopse}">
                <input id="link-${id}-del" type="hidden" name="img" value="${link}">
                <input id="${id}" type="submit" value="Excluir">
            </form>
        </div>
    `;

    document.getElementById('cards').insertAdjacentHTML('beforeend', markup);
}

let targetId;

document.addEventListener('click', function(e) {
    targetId = e.target.id;
});
    

function setSubmitsUp() {
    var allFormsUp = document.querySelectorAll('.form-update');
    for(var i=0; i < allFormsUp.length; i++) {
        allFormsUp[i].onsubmit = function (e) {
            e.preventDefault();

            let up_link = document.getElementById('link-'+targetId+'-up').value,
                up_nome = document.getElementById('nome-'+targetId+'-up').value,
                up_ano = document.getElementById('ano-'+targetId+'-up').value,
                up_sinopse = document.getElementById('sinopse-'+targetId+'-up').value,
                cards = document.getElementById('cards');

            let xmlhttp = new XMLHttpRequest();
            xmlhttp.open('POST', 'filme/update', true);
            xmlhttp.setRequestHeader('Content-Type', 'application/json');
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    const data = JSON.parse(xmlhttp.responseText);
                    
                    up_link = data.img;
                    up_poster = data.img;
                    up_nome = data.nome;
                    up_ano = data.ano;
                    up_sinopse = data.sinopse;

                    del_link = data.img;
                    del_nome = data.nome;
                    del_ano = data.ano;
                    del_sinopse = data.sinopse;

                    alert('Filme' + data.nome + ' atualizado');
                    
                }
            }

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
        
                cards.insertAdjacentHTML('afterbegin', markup);
        
                document.getElementById('progress').value = 0;
                document.getElementById('display').innerText = '0%';
            };
        
            xmlhttp.onloadend = function(e) {
                document.getElementById('progress').value = e.loaded;
                cards.removeChild(document.getElementById('progressBar'));
            };
            
            xmlhttp.send(JSON.stringify({_id:`${targetId}`, nome:`${up_nome}`, ano:`${up_ano}`, sinopse:`${up_sinopse}`, img:`${up_link}`}));
        }
    }
}

function setSubmitsDel() {
    var allFormsDel = document.querySelectorAll('.form-delete');
    for(var i=0; i < allFormsDel.length; i++) {
        allFormsDel[i].onsubmit = function (e) {
            e.preventDefault();

            let del_link = document.getElementById('link-'+targetId+'-del').value,
                del_nome = document.getElementById('nome-'+targetId+'-del').value,
                del_ano = document.getElementById('ano-'+targetId+'-del').value,
                del_sinopse = document.getElementById('sinopse-'+targetId+'-del').value,
                cards = document.getElementById('cards');

            let xmlhttp = new XMLHttpRequest();
            xmlhttp.open('POST', 'filme/delete', true);
            xmlhttp.setRequestHeader('Content-Type', 'application/json');
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    const data = JSON.parse(xmlhttp.responseText);

                    let delElement = document.getElementById('card-'+data._id);
                    delElement.parentElement.removeChild(delElement);

                    alert('Filme' + data.nome + ' excluido');
                }
            }

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
        
                cards.insertAdjacentHTML('afterbegin', markup);
        
                document.getElementById('progress').value = 0;
                document.getElementById('display').innerText = '0%';
            };
        
            xmlhttp.onloadend = function(e) {
                document.getElementById('progress').value = e.loaded;
                cards.removeChild(document.getElementById('progressBar'));
            };
            
            xmlhttp.send(JSON.stringify({_id:`${targetId}`, nome:`${del_nome}`, ano:`${del_ano}`, sinopse:`${del_sinopse}`, img:`${del_link}`}));
        }
    }
}

function readImage(event) {
    if (event.target.files && event.target.files[0]) {
        var FR = new FileReader();
        FR.onload = function(e) {
            document.getElementById('poster-'+targetId+'-up').src = e.target.result;
            document.getElementById('link-'+targetId+'-up').value = e.target.result;
        };
        FR.readAsDataURL(event.target.files[0]);
    }
}

setSubmitsUp();
setSubmitsDel();