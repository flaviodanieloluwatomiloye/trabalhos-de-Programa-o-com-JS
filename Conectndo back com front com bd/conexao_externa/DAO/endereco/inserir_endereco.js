import {conexao} from '../conexao.js'

async function incluirEndereco(infos){
    const sql = `INSERT INTO Endereco (id_endereco, logradouro, numero, cep, cidade) VALUES (?, ?, ?, ?, ?)`
    const conn = await conexao()
    
    try {
        const [results] = await conn.query(sql, infos);
        await conn.end()
        return results
      } catch (err) {
        return err.message
      }
}

export {incluirEndereco}