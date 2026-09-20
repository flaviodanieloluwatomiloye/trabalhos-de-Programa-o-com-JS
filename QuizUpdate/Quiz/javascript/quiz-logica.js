document.addEventListener("DOMContentLoaded", () => {
    const nomePaginaAtual = window.location.pathname.split("/").pop();
    const numeroPergunta = parseInt(nomePaginaAtual.replace(/[^0-9]/g, '')) || 1;

    // Se for a primeira página, reinicia o vetor de respostas
    if (numeroPergunta === 1) {
        sessionStorage.setItem("respostasQuiz", JSON.stringify([]));
    }

    // Procura qualquer elemento HTML que tenha o atributo 'data-opcao' definido
    const opcoes = document.querySelectorAll('[data-opcao]');

    opcoes.forEach(opcao => {
        opcao.addEventListener("click", () => {
            const opcaoSelecionada = opcao.getAttribute("data-opcao");
            let respostas = JSON.parse(sessionStorage.getItem("respostasQuiz")) || [];

            // Salva no vetor na posição correspondente
            respostas[numeroPergunta - 1] = opcaoSelecionada;
            sessionStorage.setItem("respostasQuiz", JSON.stringify(respostas));

            // Fluxo definitivo para 7 perguntas
            if (numeroPergunta < 7) {
                window.location.href = `pergunta${numeroPergunta + 1}.html`;
            } else {
                window.location.href = "resultado.html";
            }
        });
    });
});