import { buscarDados, gerarTag } from "./utils.js"

const URL_USUARIOS = "https://fakestoreapi.com/users"

// Monta uma <tr> completa para um usuário
function gerarLinhaUsuario(usuario) {
    let tr = gerarTag('tr')

    let tdId = gerarTag('td', usuario.id)
    let tdEndereco = gerarTag('td', usuario.address.city)
    let tdNome = gerarTag('td', `${usuario.name.firstname} ${usuario.name.lastname}`)
    let tdEmail = gerarTag('td', usuario.email)

    tr.appendChild(tdId)
    tr.appendChild(tdEndereco)
    tr.appendChild(tdNome)
    tr.appendChild(tdEmail)

    return tr
}

async function init() {
    let usuarios = await buscarDados(URL_USUARIOS)
    let corpoTabela = document.querySelector('#tabela-usuarios')

    usuarios.forEach(usuario => {
        let linha = gerarLinhaUsuario(usuario)
        corpoTabela.appendChild(linha)
    })
}

init()
