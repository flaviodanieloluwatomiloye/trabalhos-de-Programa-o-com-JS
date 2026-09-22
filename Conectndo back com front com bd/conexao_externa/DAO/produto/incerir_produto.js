import {conexao} from '../conexao.js'

async function incluirProduto(infos){
    const sql = `INSERT INTO Produto (id_produto, nome, descricao, preco) VALUES (?, ?, ?, ?)`
    const conn = await conexao()
    
    try {
        const [results] = await conn.query(sql, infos);
        await conn.end()
        return results
      } catch (err) {
        return err.message
      }
}

export {incluirProduto}