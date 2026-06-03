import { times } from './bd.js'

//Calculo da Pontuação
export function pontosCalculados(v, e){
    return (v * 3) + (e * 1)
}

//Calculo do Percentual
export function percentual(j, pts){
    let total = j * 3
    let perc = (pts / total) * 100
    return perc.toFixed(2)
}

//Exibindo no JSOL
export let pontuacao = times.map(times =>{
    return{
        posicao: times.posicao,
        time: times.time,
        pts: pontosCalculados(times.v, times.e),
        ...times,
        sg: times.gm - times.gc,
        aproveitamento: percentual(times.j, pontosCalculados(times.v, times.e)) + '%'
        
    }
})