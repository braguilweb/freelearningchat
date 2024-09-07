//Exibe o menu fixo na tela
function exibirMenuFixo () {
    let listaDeSistemas = document.getElementById("lista-sistemas");
    
    for (let dado of sistemasDoCorpoHumano) {
        listaDeSistemas.innerHTML += 
        `
        <li class="lista-sistema">
            <a href="#" onclick="exibirDetalhesDoSistema(event)" >${dado.nome}</a>
        </li>
        `   
    }
    document.getElementById('cabecalho').style.display ='none'
    document.getElementById('botao-comecar').style.display ='none'
    document.getElementById('botao-sair').style.display ='block'
}

//Função que reinicia o aplicativo
function reiniciarApp() {      
    window.location.reload(); // Recarrega a página   
}

//Função que exibe resultados na tela
function exibirDetalhesDoSistema(evento) {
    evento.preventDefault(); 

    const nomeDoSistemaClicado = evento.target.textContent;

    // Filtra a lista de dados para exibir apenas as plantas relacionadas ao sistema clicado
    const plantasDoSistema = listaDeDados.filter(planta => planta.nome.includes(nomeDoSistemaClicado));

    // Atualiza o conteúdo da seção de resultados com as plantas filtradas
    atualizarResultados(plantasDoSistema);

    // Exibe a seção de resultados
    document.getElementById('resultados').style.display = 'flex'; 
}

//Função que atualiza os resultado na tela
function atualizarResultados(plantas) {
    let resultadosHTML = '';
    for (let planta of plantas) {
        resultadosHTML += `
            <div class="mini-card">
                <p id="nomeComumdaPlanta">${planta.nomeComumDaPlanta}</p>
                <img src=${planta.imagemDaPlanta} alt="${planta.nomeComumDaPlanta}" srcset="">
                <p id="nomeComumdaPlanta">${planta.nome}</p>
                <p id="dadosMedicinais">${planta.indicacao}</p>
                <button onclick="clicarEmVerMais(${planta.id})">Ver mais</button> 
            </div>  
        `;
    }
    document.getElementById('resultados').innerHTML = resultadosHTML;

    // Rolar a tela para o topo suavemente
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

}

//Função que exibe o card completo
function clicarEmVerMais(idPlanta) {

    // Busca a planta pelo ID
    const plantaEscolhida = listaDeDados.find(planta => planta.id === idPlanta);

    // Verifica se a planta foi encontrada
    if (!plantaEscolhida) {
        console.error('Planta não encontrada!');
        return;
    }

    // Esconder os resultados da busca
    document.getElementById('resultados').style.display = 'none';

    // Preencher o card completo com os dados da planta escolhida
    let cardCompleto = document.getElementById('card-completo');
    cardCompleto.innerHTML = `
        <div class="card">
            <img class="plant-image" src="${plantaEscolhida.imagemDaPlanta}" alt="Imagem da Planta ${plantaEscolhida.nomeComumDaPlanta}">
            <div class="card-content">
                <h2 class="plant-name">${plantaEscolhida.nomeComumDaPlanta} <span>(${plantaEscolhida.nomeCientifico})</span></h2>
                <p class="medicinal-info"><strong>Dados Medicinais:</strong> ${plantaEscolhida.dadosMedicinais}</p>
                <p class="recipe"><strong>Receita:</strong> ${plantaEscolhida.receita}</p>
                <p class="contraindications"><strong>Contraindicações:</strong> ${plantaEscolhida.contraIndicacoes}</p>
                <p class="medical-tips"><strong>Dicas Médicas:</strong> ${plantaEscolhida.dicasMedicas}</p>
                <div class="system-info">
                    <p><strong>Sistema:</strong> ${plantaEscolhida.nome}</p>
                    <p><strong>Função:</strong> ${plantaEscolhida.funcao}</p>
                    <p><strong>Componentes:</strong> ${plantaEscolhida.componentes.join(', ')}</p>
                </div>
                <div class="button-voltar">
                    <button type="button" onclick="voltar()">Voltar</button>
                </div>
            </div>
        </div>
    `;
    // Exibir o card completo
    cardCompleto.style.display = 'flex';

    //Esconde o menu-fixo
    document.getElementById("menu-fixo").style.display = 'none'
}

//Função que controla o botão voltar do card principal
function voltar() {
    // Esconder o card completo
    document.getElementById('card-completo').style.display = 'none';

    // Mostrar os resultados novamente
    document.getElementById('resultados').style.display = 'flex';

    // Mostra resultados do menu-fixo de novo
    document.getElementById("menu-fixo").style.display = 'flex'
}





