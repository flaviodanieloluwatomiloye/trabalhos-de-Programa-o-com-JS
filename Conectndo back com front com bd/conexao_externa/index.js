import express from 'express'
// Importando as funções lógicas do banco de dados (vamos criá-las no passo abaixo)
// import { listarClientes, buscarClientePorId, inserirCliente, atualizarCliente, deletarCliente } from './DAO/clienteDAO.js'
import { buscarClientes } from './DAO/cliente/buscar_cliente.js'
import { buscarLimite } from './DAO/limite_credito/limite_credito.js'
import { buscarEndereco } from './DAO/endereco/endereco.js'
import { buscarPedido } from './DAO/pedido/pedido.js'
import { buscarPedidoProduto } from './DAO/pedidoProduto/produto.js'
import { buscarProduto } from './DAO/produto/produto.js'
import { buscarClienteStatus } from './DAO/clienteStatus/cliente_status.js'
 
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

app.get('/clienteStatus', async (req, res) => {
    let clienteStatus = await buscarClienteStatus();
    res.json(clienteStatus);
})

// Inicialização do Servidor
app.listen(3000, () => {
  console.log('🚀 Server is running on http://localhost:3000')
})
 