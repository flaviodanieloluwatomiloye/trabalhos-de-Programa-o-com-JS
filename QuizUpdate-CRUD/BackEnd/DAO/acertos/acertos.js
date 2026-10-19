
async function incluirAcertos(db, codUsuario, acertos, total) {
    const sql = `INSERT INTO tb_Acertos (codUsuario, AcertosUsuario, totalQuestoes) VALUES (?, ?, ?)`
    const [results] = await db.execute(sql, [codUsuario, acertos, total])
    return results.insertId
}

export { incluirAcertos }
