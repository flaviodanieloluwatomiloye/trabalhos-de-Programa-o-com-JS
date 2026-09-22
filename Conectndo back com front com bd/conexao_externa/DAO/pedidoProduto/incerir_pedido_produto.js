import {conexao} from '../conexao.js'

async function incluirPedidoProduto(infos){
    const sql = `INSERT INTO Pedido_Produto (id_pedido, id_produto) VALUES (?, ?)`
    const conn = await conexao()
    
    try {
        const [results] = await conn.query(sql, infos);
        await conn.end()
        return results
      } catch (err) {
        return err.message
      }
}

export {incluirPedidoProduto}