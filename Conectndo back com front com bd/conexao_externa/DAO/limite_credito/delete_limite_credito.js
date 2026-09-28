import {conexao} from '../conexao.js'

async function deletarLimiteDeCredito(codigo){
    
    const sql = `DELETE FROM LimiteDeCredito WHERE id_limite = ?`
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

export {deletarLimiteDeCredito}
