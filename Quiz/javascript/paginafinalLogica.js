document.addEventListener("DOMContentLoaded", () => {

    const gabarito = ["A", "C", "D", "B", "C", "A", "C"];
    const respostasUsuario = JSON.parse(sessionStorage.getItem("respostasQuiz")) || [];
    
    // 1. Procura o mome do usuario
    const dadosCadastrados = JSON.parse(localStorage.getItem("usuarioCadastrado"));
    // Se por acaso não achar o nome, define como "Jogador" por segurança
    const nomeUsuario = dadosCadastrados && dadosCadastrados.nome ? dadosCadastrados.nome : "Jogador";

    document.getElementById("titulo-resultado").innerText = `Mandou bem, ${nomeUsuario}!`;
    
    let acertos = 0;
    const containerLista = document.getElementById("lista-detalhes");
    containerLista.innerHTML = ""; // Garante que a lista comece vazia

    // Verificar as respostas e gerar o resultado na tela
    gabarito.forEach((correta, index) => {
        const numeroQuestao = index + 1;
        const respostaDoUsuario = respostasUsuario[index] || "Não respondida";
        
        // Cria uma caixinha na tela para cada questão
        const divQuestao = document.createElement("div");
        divQuestao.className = "item-questao";

        if (respostaDoUsuario === correta) {
            acertos++;
            divQuestao.innerHTML = `
                Questão ${numeroQuestao}: <span class="acertou">Acertou!</span> <br>
                <small style="color: #ffffff;">Sua resposta: (${respostaDoUsuario})</small>
            `;
        } else {
            divQuestao.innerHTML = `
                Questão ${numeroQuestao}: <span class="errou">Errou!</span> <br>
                <small style="color: #ffffff;">Sua resposta: (${respostaDoUsuario}) | Correta: (${correta})</small>
            `;
        }

        // Adiciona a caixinha dentro do container principal da lista
        containerLista.appendChild(divQuestao);
    });

    // Exibe a pontuação final por extenso
    document.getElementById("pontuacao").innerText = `${nomeUsuario}, você acertou ${acertos} de 7 questões!`;

    // 2. Salva o resultado no banco de dados (uma única vez por tentativa,
    //    mesmo que o usuário atualize a página de resultado)
    const jaSalvou = sessionStorage.getItem("resultadoSalvo");
    const temUsuario = dadosCadastrados && dadosCadastrados.codUsuario;

    if (temUsuario && respostasUsuario.length > 0 && !jaSalvou) {
        fetch('/resultado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                codUsuario: dadosCadastrados.codUsuario,
                respostas: respostasUsuario
            })
        })
        .then(resp => {
            if (!resp.ok) throw new Error('Erro ' + resp.status);
            sessionStorage.setItem("resultadoSalvo", "1");
        })
        .catch(erro => console.error('Não foi possível salvar o resultado no banco:', erro));
    }
});
