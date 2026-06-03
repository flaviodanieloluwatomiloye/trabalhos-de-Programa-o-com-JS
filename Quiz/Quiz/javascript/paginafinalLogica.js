document.addEventListener("DOMContentLoaded", () => {

            const gabarito = ["A", "C", "D", "B", "C", "A", "C"];
            const respostasUsuario = JSON.parse(localStorage.getItem("respostasQuiz")) || [];
            
            let acertos = 0;

            gabarito.forEach((correta, index) => {
                if (respostasUsuario[index] === correta) {
                    acertos++;
                }
            });

            document.getElementById("pontuacao").innerText = `Você acertou ${acertos} de 7 questões!`;
        });

        //Poofessor, eu tinha perdido metade to codigo e tive que refazer quase todos os html me baseando no que sobrou dos css
