// fonte de dados
let url = 'https://fakestoreapi.com/users'

// request   |  promise
let resp = await fetch(url)

// tratamento da resposta
let dados = await resp.json()

let linhas = document.querySelectorAll('tr')
console.log(linhas[0].children)

for (let i = 0; i < dados.length; i++) {

    let filhos = linhas[i+1].children
    filhos[0].textContent = dados[i].id           //  id
    filhos[1].textContent = dados[i].username     //  nome
    filhos[2].textContent = dados[i].email        //  email
    filhos[3].textContent = dados[i].password     //  senha
    console.log(dados[i])
}