/*
Grava todas as questões de uma tentativa de uma vez só.
 "detalhes" é um array de objetos: { numero, escolhida, correta, acertou }
 */
async function incluirRespostas(db, codAcerto, detalhes) {
    const sql = `INSERT INTO tb_Respostas
                    (codAcerto, numeroQuestao, respostaUsuario, respostaCorreta, acertou) VALUES ?`

    const linhas = detalhes.map(d => [codAcerto, d.numero, d.escolhida, d.correta, d.acertou])

    // Aqui é query (e não execute) porque "VALUES ?" com array de arrays só é expandido pelo query do mysql2.
    const [results] = await db.query(sql, [linhas])
    return results.affectedRows
}

// Busca o detalhe de uma tentativa
async function listarRespostasDaTentativa(db, codAcerto) {
    const sql = `SELECT numeroQuestao, respostaUsuario, respostaCorreta, acertou
                   FROM tb_Respostas
                  WHERE codAcerto = ?
                  ORDER BY numeroQuestao`
    const [linhas] = await db.execute(sql, [codAcerto])
    return linhas
}

export { incluirRespostas, listarRespostasDaTentativa }