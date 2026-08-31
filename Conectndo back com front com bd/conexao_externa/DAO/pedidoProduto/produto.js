import {conexao} from '../conexao.js'
 
async function buscarPedidoProduto(idPedido){
  console.log('DAO de STATUS')
    const sql = `SELECT * FROM produto WHERE idPedido = ?;`
    
    const conn = await conexao()
    try {
        // Executar a consulta
        const [rows, fields] = await conn.query(sql, [idPedido]);
        await conn.end()
        return rows
      } catch (err) {
        return err.message
      }
}
 
export {buscarPedidoProduto}
 