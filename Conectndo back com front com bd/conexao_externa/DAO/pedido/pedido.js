import {conexao} from '../conexao.js'
 
async function buscarPedido(numero){
  console.log('DAO de STATUS')
    const sql = `SELECT * FROM pedido WHERE numero = ?;`
    
    const conn = await conexao()
    try {
        // Executar a consulta
        const [rows, fields] = await conn.query(sql, [numero]);
        await conn.end()
        return rows
      } catch (err) {
        return err.message
      }
}
 
export {buscarPedido}
 