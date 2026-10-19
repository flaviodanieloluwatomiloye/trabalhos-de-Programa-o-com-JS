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

export { incluirRespostas }
