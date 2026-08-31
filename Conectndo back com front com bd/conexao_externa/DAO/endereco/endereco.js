import {conexao} from '../conexao.js'
 
async function buscarEndereco(id_endereco){
  console.log('DAO de STATUS')
    const sql = `SELECT * FROM endereco WHERE id_endereco = ?;`
    
    const conn = await conexao()
    try {
        // Executar a consulta
        const [rows, fields] = await conn.query(sql, [id_endereco]);
        await conn.end()
        return rows
      } catch (err) {
        return err.message
      }
}
 
export {buscarEndereco}
 