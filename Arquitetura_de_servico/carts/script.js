let url = 'https://fakestoreapi.com/carts'

let resp = await fetch(url)

let dados = await resp.json()

let linhas = document.querySelectorAll('tr')
console.log(linhas[0].children)

for (let i = 0; i < dados.length; i++) {

  let filhos = linhas[i+1].children
  filhos[0].textContent = dados[i].id                 // id
  filhos[1].textContent = dados[i].userId             // id do usuario
  filhos[2].textContent = dados[i].date    // produtos

  filhos[3].textContent = dados[i].products[0]?.productId
  filhos[4].textContent = dados[i].products[0]?.quantity

  filhos[5].textContent = dados[i].products[1]?.productId
  filhos[6].textContent = dados[i].products[1]?.quantity

  filhos[7].textContent = dados[i].products[2]?.productId
  filhos[8].textContent = dados[i].products[2]?.quantity
  
  console.log(dados[i])
}
