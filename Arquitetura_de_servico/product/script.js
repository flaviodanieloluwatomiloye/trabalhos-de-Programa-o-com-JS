// fonte de dados
let url = 'https://fakestoreapi.com/products'

// request   |  promise
let resp = await fetch(url)

// tratamento da resposta
let dados = await resp.json()

let linhas = document.querySelectorAll('tr')
console.log(linhas[0].children)

for (let i = 0; i < 20; i++) {

    let filhos = linhas[i+1].children
    filhos[0].textContent = dados[i].id         //  id
    filhos[1].textContent = dados[i].category      //  categoria
    filhos[2].textContent = dados[i].price       //  preço
    filhos[3].textContent = dados[i].description       //  descrição
    console.log(dados[i])
}