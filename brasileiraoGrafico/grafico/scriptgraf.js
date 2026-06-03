async function carregar() {
    const res = await fetch('bd.json');
    const dadosBrutos = await res.json();

    // Mapeia e calcula as estatísticas necessárias para os gráficos de barra
    const dados = dadosBrutos.map(t => {
        const pts = (t.v * 3) + (t.e * 1);
        const saldo = t.gp - t.gc;
        const desempenho = t.j > 0 ? parseFloat(((pts / (t.j * 3)) * 100).toFixed(1)) : 0;
        return { ...t, pts, saldo, desempenho };
    }).sort((a, b) => b.pts - a.pts || b.saldo - a.saldo); // Deixa organizado por pontos

    const coresTimes = [
        '#cf0000', // Time 1
        '#d6e600', // Time 2 
        '#00ff15', // Time 3 
        '#fd3d3d', // Time 4 
        '#000000', // Time 5 
        '#d80000', // Time 6 
        '#ac0909', // Time 7 
        '#000000', // Time 8
        '#106e04', // Time 9
        '#d6d6d6', // Time 10 
        '#e0e404', // Time 11 
        '#c50707', // Time 12 
        '#eb0808', // Time 13 
        '#cfb001', // Time 14 
        '#0a5500', // Time 15 
        '#000000', // Time 16 
        
    ];

    // GRÁFICO 1: Desempenho (%) ordenado por Pontuação
    new Chart(document.getElementById('grafico1'), {
        type: 'bar',
        data: {
            labels: dados.map(t => t.time),
            datasets: [
                { 
                    label: 'Desempenho (%)', 
                    data: dados.map(t => t.desempenho), 
                    backgroundColor: dados.map((_, i) => coresTimes[i % coresTimes.length]) 
                },
                { 
                    label: 'Pontuação (Ordenada)', 
                    data: dados.map(t => t.pts), 
                    backgroundColor: dados.map((_, i) => coresTimes[i % coresTimes.length]) 
                }
            ]
        }
    });


    // GRÁFICO 2: Times que passaram para a próxima fase (Top 8) - GRÁFICO DE LINHA
    const classificados = dados.slice(0, 8);
    new Chart(document.getElementById('grafico2'), {
        type: 'line',
        data: {
            labels: classificados.map(t => t.time),
            datasets: [{ 
                label: 'Pontos dos Classificados', 
                data: classificados.map(t => t.pts), 
                borderColor: '#bcdcf1',          // Cor da linha principal
                backgroundColor: 'rgb(170, 3, 3)', // Sombra leve abaixo da linha
                pointBackgroundColor: coresTimes, // CADA PONTO da linha terá a cor específica do time
                pointRadius: 6,                  // Aumenta o tamanho dos pontos para destacar a cor
                tension: 0.2                     // Deixa a linha levemente curvada
            }]
        }
    });


    // GRÁFICO 3: Os 4 times com maior saldo de gols - RADAR
    const top4Saldo = [...dados].sort((a, b) => b.saldo - a.saldo).slice(0, 4);
    new Chart(document.getElementById('grafico3'), {
        type: 'radar',
        data: {
            labels: top4Saldo.map(t => t.time),
            datasets: [
                { 
                    label: 'Saldo de Gols', 
                    data: top4Saldo.map(t => t.saldo), 
                    backgroundColor: 'rgba(156, 156, 156, 0.2)', // Área do radar preenchida
                    borderColor: '#9966FF',
                    pointBackgroundColor: coresTimes.slice(0, 4), // Os 4 vértices recebem as cores dos respectivos times
                    pointRadius: 5
                }
            ]
        }
    });


    // GRÁFICO 4: Os 8 melhores times com base na pontuação - ÁREA POLAR
    new Chart(document.getElementById('grafico4'), {
        type: 'polarArea',
        data: {
            labels: dados.slice(0, 8).map(t => t.time),
            datasets: [{ 
                label: 'Pontos (Top 8)', 
                data: dados.slice(0, 8).map(t => t.pts), 
                // Passando a array diretamente: CADA FATIA ganha uma cor única da sua lista
                backgroundColor: coresTimes 
            }]
        }
    });


    // Função de Busca por Nome (Demanda de estatísticas por time)
    window.buscar = () => {
        const nome = document.getElementById('buscaTime').value.toLowerCase().trim();
        const time = dados.find(t => t.time.toLowerCase() === nome);
        document.getElementById('resultadoBusca').innerHTML = time ? 
            `<strong>${time.time}</strong> — Pontos: ${time.pts} | Jogos: ${time.j} | Vitórias: ${time.v} | Empates: ${time.e} | Derrotas: ${time.d} | Saldo: ${time.saldo} | Desempenho: ${time.desempenho}%` 
            : "<span style='color:red;'>Time não encontrado.</span>";
    };
}

carregar();