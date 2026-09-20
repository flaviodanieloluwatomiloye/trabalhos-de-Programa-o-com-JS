// Seleciona o formulário pelo ID
const formulario = document.getElementById('meuFormulario');

formulario.addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão (sempre, logo no começo)

    // Pegamos os valores digitados nos campos
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    // 1. Validação do Nome (mínimo 3 caracteres)
    if (nome.length < 3) {
        alert("O nome deve ter pelo menos 3 caracteres.");
        return;
    } else if(nome.length > 30) {
        alert("O nome não pode ter mais de 30 caracteres.");
        return;
    }

    // 2. Validação do E-mail (apenas domínios específicos)
    const dominiosPermitidos = ['@gmail.com', '@email.com', '@yahoo.com', '@hotmail.com'];
    const emailValido = dominiosPermitidos.some(dominio => email.toLowerCase().endsWith(dominio))

    if (!emailValido) {
        alert("Por favor, use um e-mail com os domínios permitidos: @gmail.com, @email.com, @yahoo.com ou @hotmail.com");
        return;
    }

    // 3. Validação da Senha
    if (senha.length < 8) {
        alert("A senha deve ter no mínimo 8 caracteres.");
        return;
    } else if(senha.length > 32) {
        alert("A senha não pode ter mais de 32 caracteres.");
        return;
    }

    // Envia os dados para o servidor salvar no bd.json
    const resposta = await fetch('/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
    });

    if (resposta.status === 409) return alert('E-mail já cadastrado.');
    if (!resposta.ok) return alert('Erro ' + resposta.status);

    localStorage.setItem('usuarioCadastrado', JSON.stringify({ nome, email }))
    window.location.href = 'inicioQuiz.html';
});