import {conexao} from '../conexao.js'

async function incluirPedido(infos){
    const sql = `INSERT INTO Pedido (numeroPedido, data_elaboracao, id_cliente) VALUES (?, ?, ?)`
    const conn = await conexao()
    
    try {
        const [results] = await conn.query(sql, infos);
        await conn.end()
        return results
      } catch (err) {
        return err.message
      }
}

export {incluirPedido}