import {conexao} from '../conexao.js'

async function deletarEndereco(codigo){
    
    const sql = `DELETE FROM Endereco WHERE id_endereco = ?`
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

export {deletarEndereco}
