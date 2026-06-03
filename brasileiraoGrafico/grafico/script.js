import express from 'express';
import fs from 'fs';

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get('/campeonato', (req, res) => {
    const dados = JSON.parse(fs.readFileSync('./bd.json'));
    
    const tabela = dados.map(t => {
        const pts = (t.v * 3) + (t.e * 1);
        const saldo = t.gp - t.gc;
        const desempenho = t.j > 0 ? parseFloat(((pts / (t.j * 3)) * 100).toFixed(1)) : 0;
        return { ...t, pts, saldo, desempenho };
    }).sort((a, b) => b.pts - a.pts || b.saldo - a.saldo);

    res.json(tabela);
});


app.listen(3000, () => console.log("Servidor rodando na porta 3000"));