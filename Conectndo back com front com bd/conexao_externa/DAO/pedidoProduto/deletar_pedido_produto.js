import {conexao} from '../conexao.js'

async function deletarPedidoProduto(codigo){
    
    const sql = `DELETE FROM Pedido_Produto WHERE id_pedido = ? AND id_produto = ?`
    const conn = await conexao()
    
    try {
        // Executar a consulta
        const [results] = await conn.query(sql,[codigo]);

        await conn.end()
        return results
      } catch (err) {
        return err.message
      }
}

export {deletarPedidoProduto}
