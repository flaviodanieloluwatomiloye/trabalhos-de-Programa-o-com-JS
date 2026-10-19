/*
 Painel: busca no banco (via API do index.js) os usuários e as tentativas do quiz,
 mostra na tela e permite editar (PUT) e excluir (DELETE).
*/

const tabelaTentativas = document.getElementById('tabela-tentativas');
const tabelaUsuarios   = document.getElementById('tabela-usuarios');
const caixaMensagem    = document.getElementById('mensagem');

const dlgUsuario   = document.getElementById('dlg-usuario');
const formUsuario  = document.getElementById('form-usuario');
const dlgTentativa = document.getElementById('dlg-tentativa');
const formTentativa = document.getElementById('form-tentativa');

let usuarioEditando = null;   // codUsuario aberto no diálogo
let tentativaEditando = null; // codAcerto aberto no diálogo

// ---------- utilidades ----------

// Nomes e e-mails vêm do banco (digitados por usuários): sempre escapar antes de usar em innerHTML
function esc(texto) {
    return String(texto ?? '').replace(/[&<>"']/g, c => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
}

function formatarData(iso) {
    const d = new Date(iso);
    return isNaN(d) ? '-' : d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function mostrarMensagem(texto, erro = false) {
    caixaMensagem.textContent = texto;
    caixaMensagem.className = 'mensagem' + (erro ? ' erro' : '');
    caixaMensagem.hidden = false;
    clearTimeout(mostrarMensagem.timer);
    mostrarMensagem.timer = setTimeout(() => { caixaMensagem.hidden = true; }, 5000);
}

// Faz a chamada e devolve { ok, status, dados }. Nunca lança: falha de rede vira status 0.
async function chamar(url, metodo = 'GET', corpo) {
    try {
        const resp = await fetch(url, {
            method: metodo,
            headers: corpo ? { 'Content-Type': 'application/json' } : undefined,
            body: corpo ? JSON.stringify(corpo) : undefined
        });
        let dados = null;
        if ((resp.headers.get('content-type') || '').includes('application/json')) {
            dados = await resp.json();
        }
        return { ok: resp.ok, status: resp.status, dados };
    } catch (e) {
        return { ok: false, status: 0, dados: null };
    }
}

function textoDoErro(status) {
    switch (status) {
        case 0:   return 'Não foi possível conectar ao servidor. Ele está rodando?';
        case 400: return 'Dados inválidos. Confira os campos.';
        case 404: return 'Registro não encontrado (talvez já tenha sido excluído).';
        case 409: return 'Esse e-mail já está cadastrado em outro usuário.';
        default:  return 'Erro ' + status + ' no servidor.';
    }
}

// ---------- listagens ----------

function classeDaNota(acertos, total) {
    const p = total ? acertos / total : 0;
    return p >= 0.7 ? 'boa' : p >= 0.4 ? 'media' : 'ruim';
}

async function carregarTentativas() {
    const r = await chamar('/acertos');
    if (!r.ok) {
        tabelaTentativas.innerHTML = `<tr><td class="vazio" colspan="6">${esc(textoDoErro(r.status))}</td></tr>`;
        return;
    }
    if (r.dados.length === 0) {
        tabelaTentativas.innerHTML = '<tr><td class="vazio" colspan="6">Nenhuma tentativa salva ainda.</td></tr>';
        return;
    }
    tabelaTentativas.innerHTML = r.dados.map(t => `
        <tr data-id="${t.codAcerto}" data-nome="${esc(t.nomeUsuario)}">
            <td>${t.codAcerto}</td>
            <td>${esc(t.nomeUsuario)}</td>
            <td>${esc(t.emailUsuario)}</td>
            <td class="nota ${classeDaNota(t.AcertosUsuario, t.totalQuestoes)}">${t.AcertosUsuario}/${t.totalQuestoes}</td>
            <td>${formatarData(t.dataQuiz)}</td>
            <td class="acoes">
                <button type="button" class="btn btn-ok" data-acao="editar-tentativa">Editar</button>
                <button type="button" class="btn btn-perigo" data-acao="excluir-tentativa">Excluir</button>
            </td>
        </tr>`).join('');
}

async function carregarUsuarios() {
    const r = await chamar('/usuarios');
    if (!r.ok) {
        tabelaUsuarios.innerHTML = `<tr><td class="vazio" colspan="6">${esc(textoDoErro(r.status))}</td></tr>`;
        return;
    }
    if (r.dados.length === 0) {
        tabelaUsuarios.innerHTML = '<tr><td class="vazio" colspan="6">Nenhum usuário cadastrado.</td></tr>';
        return;
    }
    tabelaUsuarios.innerHTML = r.dados.map(u => `
        <tr data-id="${u.codUsuario}" data-nome="${esc(u.nomeUsuario)}" data-email="${esc(u.emailUsuario)}" data-tentativas="${u.totalTentativas}">
            <td>${u.codUsuario}</td>
            <td>${esc(u.nomeUsuario)}</td>
            <td>${esc(u.emailUsuario)}</td>
            <td>${formatarData(u.dataCadastro)}</td>
            <td>${u.totalTentativas}</td>
            <td class="acoes">
                <button type="button" class="btn btn-ok" data-acao="editar-usuario">Editar</button>
                <button type="button" class="btn btn-perigo" data-acao="excluir-usuario">Excluir</button>
            </td>
        </tr>`).join('');
}

function recarregarTudo() {
    return Promise.all([carregarTentativas(), carregarUsuarios()]);
}

// ---------- abas ----------

document.querySelectorAll('.aba').forEach(botao => {
    botao.addEventListener('click', () => {
        document.querySelectorAll('.aba').forEach(b => b.classList.toggle('ativa', b === botao));
        document.getElementById('aba-tentativas').hidden = botao.dataset.aba !== 'tentativas';
        document.getElementById('aba-usuarios').hidden   = botao.dataset.aba !== 'usuarios';
    });
});

// Botões "Cancelar" dos diálogos
document.querySelectorAll('[data-fechar]').forEach(b =>
    b.addEventListener('click', () => b.closest('dialog').close())
);

// ---------- ações nas tentativas ----------

tabelaTentativas.addEventListener('click', async (e) => {
    const botao = e.target.closest('[data-acao]');
    if (!botao) return;
    const linha = botao.closest('tr');
    const codAcerto = Number(linha.dataset.id);

    if (botao.dataset.acao === 'editar-tentativa') {
        abrirTentativa(codAcerto);
    } else if (botao.dataset.acao === 'excluir-tentativa') {
        if (!confirm(`Excluir a tentativa #${codAcerto} de ${linha.dataset.nome}?`)) return;
        const r = await chamar('/acertos/' + codAcerto, 'DELETE');
        if (r.ok) mostrarMensagem('Tentativa excluída.');
        else mostrarMensagem(textoDoErro(r.status), true);
        recarregarTudo();
    }
});

async function abrirTentativa(codAcerto) {
    const r = await chamar('/acertos/' + codAcerto);
    if (!r.ok) {
        mostrarMensagem(textoDoErro(r.status), true);
        return recarregarTudo();
    }
    const t = r.dados;
    tentativaEditando = codAcerto;

    document.getElementById('tent-titulo').textContent = `Tentativa #${t.codAcerto}`;
    document.getElementById('tent-sub').textContent =
        `${t.nomeUsuario} · ${formatarData(t.dataQuiz)} · nota atual ${t.AcertosUsuario}/${t.totalQuestoes}`;

    document.getElementById('tent-questoes').innerHTML = t.respostas.map(q => `
        <div class="questao ${q.acertou ? 'certa' : 'errada'}">
            <label class="rotulo" for="q${q.numeroQuestao}">
                Questão ${q.numeroQuestao}
                <span class="dica">Correta: ${esc(q.respostaCorreta)}</span>
            </label>
            <select id="q${q.numeroQuestao}" data-numero="${q.numeroQuestao}">
                <option value="">Em branco</option>
                ${['A', 'B', 'C', 'D'].map(l =>
                    `<option value="${l}"${q.respostaUsuario === l ? ' selected' : ''}>${l}</option>`).join('')}
            </select>
        </div>`).join('');

    dlgTentativa.showModal();
}

formTentativa.addEventListener('submit', async (e) => {
    e.preventDefault();
    const respostas = [];
    document.querySelectorAll('#tent-questoes select').forEach(sel => {
        respostas[Number(sel.dataset.numero) - 1] = sel.value || null;
    });

    const r = await chamar('/acertos/' + tentativaEditando, 'PUT', { respostas: Array.from(respostas, x => x ?? null) });
    if (r.ok) {
        dlgTentativa.close();
        mostrarMensagem(`Tentativa atualizada. Nova nota: ${r.dados.AcertosUsuario}/${r.dados.totalQuestoes}.`);
    } else if (r.status === 400) {
        mostrarMensagem('Marque pelo menos uma questão.', true);
        return;
    } else {
        dlgTentativa.close();
        mostrarMensagem(textoDoErro(r.status), true);
    }
    recarregarTudo();
});

// ---------- ações nos usuários ----------

tabelaUsuarios.addEventListener('click', async (e) => {
    const botao = e.target.closest('[data-acao]');
    if (!botao) return;
    const linha = botao.closest('tr');
    const codUsuario = Number(linha.dataset.id);

    if (botao.dataset.acao === 'editar-usuario') {
        usuarioEditando = codUsuario;
        document.getElementById('edit-nome').value = linha.dataset.nome;
        document.getElementById('edit-email').value = linha.dataset.email;
        dlgUsuario.showModal();
    } else if (botao.dataset.acao === 'excluir-usuario') {
        const n = Number(linha.dataset.tentativas);
        const aviso = n > 0
            ? `\n\nAs ${n} tentativa(s) dele também serão apagadas. Isso não pode ser desfeito.`
            : '\n\nIsso não pode ser desfeito.';
        if (!confirm(`Excluir o usuário ${linha.dataset.nome}?${aviso}`)) return;

        const r = await chamar('/usuarios/' + codUsuario, 'DELETE');
        if (r.ok) {
            mostrarMensagem('Usuário excluído.');
            // Se apagou o próprio usuário da sessão, limpa o cadastro local (senão o próximo /resultado daria 404)
            const logado = JSON.parse(localStorage.getItem('usuarioCadastrado') || 'null');
            if (logado && logado.codUsuario === codUsuario) localStorage.removeItem('usuarioCadastrado');
        } else {
            mostrarMensagem(textoDoErro(r.status), true);
        }
        recarregarTudo();
    }
});

formUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('edit-nome').value.trim();
    const email = document.getElementById('edit-email').value.trim();

    const r = await chamar('/usuarios/' + usuarioEditando, 'PUT', { nome, email });
    if (r.ok) {
        dlgUsuario.close();
        mostrarMensagem('Usuário atualizado.');
        // Mantém o nome/e-mail da sessão em dia, para a tela de resultado cumprimentar o nome novo
        const logado = JSON.parse(localStorage.getItem('usuarioCadastrado') || 'null');
        if (logado && logado.codUsuario === usuarioEditando) {
            localStorage.setItem('usuarioCadastrado', JSON.stringify({
                ...logado, nome: r.dados.nomeUsuario, email: r.dados.emailUsuario
            }));
        }
        recarregarTudo();
    } else if (r.status === 400 || r.status === 409) {
        mostrarMensagem(textoDoErro(r.status), true); // mantém o diálogo aberto para corrigir
    } else {
        dlgUsuario.close();
        mostrarMensagem(textoDoErro(r.status), true);
        recarregarTudo();
    }
});

// ---------- início ----------
recarregarTudo();
