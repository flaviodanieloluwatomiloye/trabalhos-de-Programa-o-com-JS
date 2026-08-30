
// Funções reutilizadas pelas 3 páginas (produtos, pedidos, usuários)

// Faz a requisição com FETCH e já devolve o JSON tratado
async function buscarDados(url) {
    try {
        let resp = await fetch(url)

        if (!resp.ok) {
            throw new Error(`Erro na requisição: ${resp.status}`)
        }

        let dados = await resp.json()
        return dados

    } catch (erro) {
        console.error('Falha ao buscar dados da API:', erro)
        return []
    }
}

// Cria dinamicamente uma tag HTML (evita repetir document.createElement em todo lugar)
function gerarTag(nomeTag, texto = '') {
    let tag = document.createElement(nomeTag)
    if (texto !== '') tag.textContent = texto
    return tag
}

export { buscarDados, gerarTag }
