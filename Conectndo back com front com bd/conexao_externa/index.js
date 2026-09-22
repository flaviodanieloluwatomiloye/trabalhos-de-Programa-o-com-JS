import express from 'express'
import { buscarClientes } from './DAO/cliente/buscar_cliente.js'
import { buscarLimite } from './DAO/limite_credito/limite_credito.js'
import { buscarEndereco } from './DAO/endereco/endereco.js'
import { buscarPedido } from './DAO/pedido/pedido.js'
import { buscarPedidoProduto } from './DAO/pedidoProduto/produto.js'
import { buscarProduto } from './DAO/produto/produto.js'
import { buscarClienteStatus } from './DAO/clienteStatus/cliente_status.js'

import { incluirCliente } from './DAO/cliente/inserir_cliente.js'
import { incluirEndereco } from './DAO/endereco/inserir_endereco.js'
import { incluirLimiteCredito } from './DAO/limite_credito/incerir_limite_credito.js'
import { incluirPedido } from './DAO/pedido/incerir_pedido.js'
import { incluirPedidoProduto } from './DAO/pedidoProduto/incerir_pedido_produto.js'
import { incluirProduto } from './DAO/produto/incerir_produto.js'
 
const app = express()
 
// Middleware obrigatório para o Express conseguir ler o corpo (body) das requisições em formato JSON
app.use(express.json())
 
// Rota Base
app.get('/', (req, res) => {
    res.json({ mensagem: 'API de Estacionamento Rodando perfeitamente!' })
})
 
app.get('/clientes',  async (req, res) => {
     let clientes = await buscarClientes();
     res.json(clientes);
})

 
app.get('/limiteCredito',  async (req, res) => {
     let limite = await buscarLimite();
     res.json(limite);
})
 
app.get('/pedido',  async (req, res) => {
     let pedido = await buscarPedido();
     res.json(pedido);
})

app.get('/pedidoProduto',  async (req, res) => {
     let pedidoProduto = await buscarPedidoProduto();
     res.json(pedidoProduto);
})
  
app.get('/produto',  async (req, res) => {
     let produto = await buscarProduto();
     res.json(produto);
})
 
app.get('/endereco',  async (req, res) => {
     let endereco = await buscarEndereco();
     res.json(endereco);
})

app.get('/view', async (req, res) => {
    let clienteStatus = await buscarClienteStatus();
    res.json(clienteStatus);
})



////////////////////////////////////////////////////////////////////////////
//post
////////////////////////////////////////////////////////////////////////////

//limitedeCredito
app.post('/incerirLimiteDeCredito', async (req, res) => {
     let {id_limite, nome} = req.body
     let infos = [id_limite, nome]
     let results = await incluirLimiteCredito(infos)

     res.json(results)
})

//Produto
app.post('/incerirProduto', async (req, res) => {
     let {id_produto, nome, descricao, preco} = req.body
     let infos = [id_produto, nome, descricao, preco]
     let results = await incluirProduto(infos)
 
     res.json(results)
 })

//Pedido
app.post('/incerirPedido', async (req, res) => {
     let {numeroPedido, data_elaboracao, id_cliente} = req.body
     let infos = [numeroPedido, data_elaboracao, id_cliente]
     let results = await incluirPedido(infos)
 
     res.json(results)
 })

// Pedido Produto
 app.post('/incerirPedidoProduto', async (req, res) => {
     let {id_pedido, id_produto} = req.body
     let infos = [id_pedido, id_produto]
     let results = await incluirPedidoProduto(infos)
 
     res.json(results)
 })

// Endereco
 app.post('/incerirEndereco', async (req, res) => {
     let {id_endereco, logradouro, numero, cep, cidade} = req.body
     let infos = [id_endereco, logradouro, numero, cep, cidade]
     let results = await incluirEndereco(infos)
 
     res.json(results)
 })

// Cliente
 app.post('/incerirCliente', async (req, res) => {
     let {id_cliente, nome, sobreNome, cpf, telefone, id_limite, id_endereco} = req.body
     let infos = [id_cliente, nome, sobreNome, cpf, telefone, id_limite, id_endereco]
     let results = await incluirCliente(infos)
 
     res.json(results)
 })

// Inicialização do Servidor
app.listen(3000, () => {
  console.log('🚀 Server is running on http://localhost:3000')
})
