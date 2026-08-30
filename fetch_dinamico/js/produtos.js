import { buscarDados, gerarTag } from "./utils.js"

const URL_PRODUTOS = "https://fakestoreapi.com/products"

// Monta uma <tr> completa para um produto
function gerarLinhaProduto(produto) {
    let tr = gerarTag('tr')

    let tdId = gerarTag('td', produto.id)
    let tdImagem = gerarTag('td')
    let img = gerarTag('img')
    img.src = produto.image
    img.alt = produto.title
    img.width = 60
    tdImagem.appendChild(img)

    let tdTitulo = gerarTag('td', produto.title)
    let tdPreco = gerarTag('td', `R$ ${produto.price}`)
    let tdCategoria = gerarTag('td', produto.category)

    tr.appendChild(tdId)
    tr.appendChild(tdImagem)
    tr.appendChild(tdTitulo)
    tr.appendChild(tdPreco)
    tr.appendChild(tdCategoria)

    return tr
}

async function init() {
    let produtos = await buscarDados(URL_PRODUTOS)
    let corpoTabela = document.querySelector('#tabela-produtos')

    produtos.forEach(produto => {
        let linha = gerarLinhaProduto(produto)
        corpoTabela.appendChild(linha)
    })
}

init()
