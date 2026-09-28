import express from 'express'
import { buscarClientes } from './DAO/cliente/buscar_cliente.js'
import { buscarLimite } from './DAO/limite_credito/limite_credito.js'
import { buscarEndereco } from './DAO/endereco/endereco.js'
import { buscarPedido } from './DAO/pedido/pedido.js'
import { buscarPedidoProduto } from './DAO/pedidoProduto/produto.js'
import { buscarProduto } from './DAO/produto/produto.js'
import { buscarClienteStatus } from './DAO/clienteStatus/cliente_status.js'

//Incluir (POST)
import { incluirCliente } from './DAO/cliente/inserir_cliente.js'
import { incluirEndereco } from './DAO/endereco/inserir_endereco.js'
import { incluirLimiteCredito } from './DAO/limite_credito/incerir_limite_credito.js'
import { incluirPedido } from './DAO/pedido/incerir_pedido.js'
import { incluirPedidoProduto } from './DAO/pedidoProduto/incerir_pedido_produto.js'
import { incluirProduto } from './DAO/produto/incerir_produto.js'
 
//Deletar (DELETE)
import { deletarLimiteDeCredito } from './DAO/limite_credito/delete_limite_credito.js'
import { deletarProduto } from './DAO/produto/deletar_produto.js'
import { deletarPedido } from './DAO/pedido/deletar_pedido.js'
import { deletarPedidoProduto } from './DAO/pedidoProduto/deletar_pedido_produto.js'
import { deletarEndereco } from './DAO/endereco/deletar_endereco.js'
import { deletarCliente } from './DAO/cliente/deletar_cliente.js'

// Editar integralmente (PUT)
import { editarIntegralmenteCliente } from './DAO/cliente/editar_integralmente_cliente.js'
import { editarIntegralmenteLimite } from './DAO/limite_credito/editar_integralmente_limite.js'
import { editarIntegralmenteProduto } from './DAO/produto/editar_integralmente_produto.js'
import { editarIntegralmentePedido } from './DAO/pedido/editar_integralmente_pedido.js'
import { editarIntegralmenteEndereco } from './DAO/endereco/editar_integralmente_endereco.js'
import { editarIntegralmentePedidoProduto } from './DAO/pedidoProduto/editar_integralmente_pedido_produto.js'

// Editar parcialmente (PATCH)
import { editarParcialmenteCliente } from './DAO/cliente/editar_parcialmente_cliente.js'
import { editarParcialmenteLimite } from './DAO/limite_credito/editar_parcialmente_limite.js'
import { editarParcialmenteProduto } from './DAO/produto/editar_parcialmente_produto.js'
import { editarParcialmentePedido } from './DAO/pedido/editar_parcialmente_pedido.js'
import { editarParcialmenteEndereco } from './DAO/endereco/editar_parcialmente_endereco.js'
import { editarParcialmentePedidoProduto } from './DAO/pedidoProduto/editar_parcialmente_pedido_produto.js'

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





 ///////////////////////////////////////////////////////////////////////////////////////////
 //Delete
 ///////////////////////////////////////////////////////////////////////////////////////////

 //Limite de Credito
app.delete('/deletarLimite/:id', async (req, res) => {
    let results = await deletarLimiteDeCredito(req.params.id)
    res.json(results)
})

 //Produto
app.delete('/deleteProduto/:id', async (req, res) => {
     let results = await deletarProduto(req.params.id)
     res.json(results)
})

//Pedido
app.delete('/deletePedido/:id', async (req, res) => {
     let results = await deletarPedido(req.params.id)
     res.json(results)
})

//Pedido Produto
app.delete('/deletePedidoProduto/:id', async (req, res) => {
     let { id_pedido, id_produto } = req.params
     let results = await deletarPedidoProduto(id_pedido, id_produto)
     res.json(results)
})

//Endereco
app.delete('/deleteEndereco/:id', async (req, res) => {
     let results = await deletarEndereco(req.params.id)
     res.json(results)
}) 

//Cliente
app.delete('/deletarCliente/:id', async (req, res) => {
     let results = await deletarCliente(req.params.id)
     res.json(results)
})





////////////////////////////////////////////////////////////////////////
//Update
////////////////////////////////////////////////////////////////////////

//Limite de Credito
app.put('/editarLimite/:id', async (req, res) => {
    let { nome } = req.body
    let results = await editarIntegralmenteLimite(req.params.id, [nome])
    res.json(results)
})
app.patch('/editarLimite/:id', async (req, res) => {
    let { campo, valor } = req.body
    let results = await editarParcialmenteLimite(req.params.id, campo, valor)
    res.json(results)
})

//Produto
app.put('/editarProduto/:id', async (req, res) => {
    let { nome, descricao, preco } = req.body
    let results = await editarIntegralmenteProduto(req.params.id, [nome, descricao, preco])
    res.json(results)
})
app.patch('/editarProduto/:id', async (req, res) => {
    let { campo, valor } = req.body
    let results = await editarParcialmenteProduto(req.params.id, campo, valor)
    res.json(results)
})

//Pedido
app.put('/editarPedido/:id', async (req, res) => {
    let { data_elaboracao, id_cliente } = req.body
    let results = await editarIntegralmentePedido(req.params.id, [data_elaboracao, id_cliente])
    res.json(results)
})
app.patch('/editarPedido/:id', async (req, res) => {
    let { campo, valor } = req.body
    let results = await editarParcialmentePedido(req.params.id, campo, valor)
    res.json(results)
})

//Endereco
app.put('/editarEndereco/:id', async (req, res) => {
    let { logradouro, numero, cep, cidade } = req.body
    let results = await editarIntegralmenteEndereco(req.params.id, [logradouro, numero, cep, cidade])
    res.json(results)
})
app.patch('/editarEndereco/:id', async (req, res) => {
    let { campo, valor } = req.body
    let results = await editarParcialmenteEndereco(req.params.id, campo, valor)
    res.json(results)
})

//Pedido Produto
app.put('/editarPedidoProduto/:id_pedido/:id_produto', async (req, res) => {
    let { id_pedido, id_produto } = req.params
    let { novo_id_pedido, novo_id_produto } = req.body
    let results = await editarIntegralmentePedidoProduto(id_pedido, id_produto, [novo_id_pedido, novo_id_produto])
    res.json(results)
})
app.patch('/editarPedidoProduto/:id_pedido/:id_produto', async (req, res) => {
    let { id_pedido, id_produto } = req.params
    let { campo, valor } = req.body
    let results = await editarParcialmentePedidoProduto(id_pedido, id_produto, campo, valor)
    res.json(results)
})

//Cliente
app.put('/editarCliente/:id', async (req, res) => {
    let { nome, sobreNome, cpf, telefone, id_limite, id_endereco } = req.body
    let results = await editarIntegralmenteCliente(req.params.id, [nome, sobreNome, cpf, telefone, id_limite, id_endereco])
    res.json(results)
})
app.patch('/editarCliente/:id', async (req, res) => {
    let { campo, valor } = req.body
    let results = await editarParcialmenteCliente(req.params.id, campo, valor)
    res.json(results)
})

// Inicialização do Servidor
app.listen(3000, () => {
  console.log('🚀 Server is running on http://localhost:3000')
})
