
async function incluirAcertos(db, codUsuario, acertos, total) {
    const sql = `INSERT INTO tb_Acertos (codUsuario, AcertosUsuario, totalQuestoes) VALUES (?, ?, ?)`
    const [results] = await db.execute(sql, [codUsuario, acertos, total])
    return results.insertId
}

// Lista as tentativas de um usuário, da mais recente para a mais antiga
async function listarAcertosDoUsuario(db, codUsuario) {
    const sql = `SELECT codAcerto, AcertosUsuario, totalQuestoes, dataQuiz
                   FROM tb_Acertos
                  WHERE codUsuario = ?
                  ORDER BY dataQuiz DESC`
    const [linhas] = await db.execute(sql, [codUsuario])
    return linhas
}

export { incluirAcertos, listarAcertosDoUsuario }