import {conexao} from '../conexao.js'

async function deletarPedido(codigo){
    
    const sql = `DELETE FROM Pedido WHERE numeroPedido = ?`
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

export {deletarPedido}
