CREATE DATABASE bd_quiz;
DROP DATABASE bd_quiz;

USE bd_quiz;

DROP TABLE IF EXISTS tb_Respostas;
DROP TABLE IF EXISTS tb_Acertos;
DROP TABLE IF EXISTS tb_Usuario;


-- 1) Usuários (dados do cadastro)
--    A senha é guardada como HASH (bcrypt), por isso VARCHAR(255)
CREATE TABLE tb_Usuario (
    codUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nomeUsuario VARCHAR(30) NOT NULL,
    emailUsuario VARCHAR(50) NOT NULL UNIQUE,
    senhaUsuario VARCHAR(255) NOT NULL,
    dataCadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2) Reposta de cada tentativa (1 linha por vez que o usuário joga)
CREATE TABLE tb_Acertos (
    codAcerto INT AUTO_INCREMENT PRIMARY KEY,
    codUsuario INT NOT NULL,
    AcertosUsuario TINYINT UNSIGNED NOT NULL,
    totalQuestoes TINYINT UNSIGNED NOT NULL,
    dataQuiz TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_acertos_usuario
        FOREIGN KEY (codUsuario) REFERENCES tb_Usuario (codUsuario)
        ON DELETE CASCADE
);


-- 3) as que foram marcadas e as corretas

CREATE TABLE tb_Respostas (
    codResposta INT AUTO_INCREMENT PRIMARY KEY,
    codAcerto INT NOT NULL,
    numeroQuestao TINYINT UNSIGNED NOT NULL,
    respostaUsuario CHAR(1) NULL,
    respostaCorreta CHAR(1) NOT NULL,
    acertou BOOLEAN NOT NULL,
    CONSTRAINT fk_respostas_acerto
        FOREIGN KEY (codAcerto) REFERENCES tb_Acertos (codAcerto)
        ON DELETE CASCADE,
    CONSTRAINT uq_tentativa_questao UNIQUE (codAcerto, numeroQuestao)
);

-- Selects

SELECT * FROM tb_Usuario;


-- Ranking: usuário, nota e data de cada tentativa
SELECT tb_Usuario.nomeUsuario, tb_Usuario.emailUsuario,
       tb_Acertos.AcertosUsuario, tb_Acertos.totalQuestoes, tb_Acertos.dataQuiz
  FROM tb_Acertos
  JOIN tb_Usuario ON tb_Usuario.codUsuario = tb_Acertos.codUsuario
 ORDER BY tb_Acertos.AcertosUsuario DESC, tb_Acertos.dataQuiz;

-- Detalhe de acertos e erros de uma tentativa
SELECT numeroQuestao, respostaUsuario, respostaCorreta,
       IF(acertou, 'Acertou', 'Errou') AS resultado
  FROM tb_Respostas
 WHERE codAcerto = 1
 ORDER BY numeroQuestao;

-- Quais questões mais erram
SELECT numeroQuestao, COUNT(*) AS erros
  FROM tb_Respostas
 WHERE acertou = 0
 GROUP BY numeroQuestao
 ORDER BY erros DESC;