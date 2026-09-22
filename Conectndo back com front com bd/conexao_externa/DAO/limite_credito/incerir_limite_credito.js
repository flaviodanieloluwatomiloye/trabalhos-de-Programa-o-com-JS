import {conexao} from '../conexao.js'

async function incluirLimiteCredito(infos){
    const sql = `INSERT INTO LimiteDeCredito (id_limite, nome) VALUES (?, ?)`
    const conn = await conexao()
    
    try {
        const [results] = await conn.query(sql, infos);
        await conn.end()
        return results
      } catch (err) {
        return err.message
      }
}

export {incluirLimiteCredito}