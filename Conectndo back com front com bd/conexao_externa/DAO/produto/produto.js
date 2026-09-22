import {conexao} from '../conexao.js'
 
async function buscarProduto(codigo){
  console.log('DAO de STATUS')
    const sql = `SELECT * FROM produto;`
    
    const conn = await conexao()
    try {
        // Executar a consulta
        const [rows, fields] = await conn.query(sql, [codigo]);
        await conn.end()
        return rows
      } catch (err) {
        return err.message
      }
}
 
export {buscarProduto}
 