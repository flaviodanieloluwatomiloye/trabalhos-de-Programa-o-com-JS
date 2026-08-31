import {conexao} from '../conexao.js'


async function buscarClientes(){
  console.log('DAO de CLIENTE')
    const sql = `SELECT * FROM Cliente;`
    
    const conn = await conexao()
    try {
        // Executar a consulta
        const [rows, fields] = await conn.query(sql);
        await conn.end()
        return rows
      } catch (err) {
        return err.message
      }
}

async function buscarCliente(codigo){
    const sql = `SELECT * FROM tbl_cliente WHERE codigo = ?`
    
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

export {buscarClientes, buscarCliente}
