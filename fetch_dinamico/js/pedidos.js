import { buscarDados, gerarTag } from "./utils.js"

const URL_PEDIDOS = "https://fakestoreapi.com/carts"

// Formata a lista de produtos do carrinho em texto entendivel (Chatão)
function formatarProdutos(produtos) {
    return produtos
        .map(p => `#${p.productId} (x${p.quantity})`)
        .join(', ')
}

// Monta uma <tr> completa para um pedido
function gerarLinhaPedido(pedido) {
    let tr = gerarTag('tr')

    let tdId = gerarTag('td', pedido.id)
    let tdUsuario = gerarTag('td', pedido.userId)

    let dataFormatada = new Date(pedido.date).toLocaleDateString('pt-BR')
    let tdData = gerarTag('td', dataFormatada)

    let tdProdutos = gerarTag('td', formatarProdutos(pedido.products))

    tr.appendChild(tdId)
    tr.appendChild(tdUsuario)
    tr.appendChild(tdData)
    tr.appendChild(tdProdutos)

    return tr
}

async function init() {
    let pedidos = await buscarDados(URL_PEDIDOS)
    let corpoTabela = document.querySelector('#tabela-pedidos')

    pedidos.forEach(pedido => {
        let linha = gerarLinhaPedido(pedido)
        corpoTabela.appendChild(linha)
    })
}

init()
