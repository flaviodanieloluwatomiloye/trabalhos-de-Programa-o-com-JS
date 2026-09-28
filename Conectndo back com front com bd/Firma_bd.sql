DROP DATABASE IF EXISTS firma_db;
CREATE DATABASE IF NOT EXISTS firma_db;

USE firma_db;

DROP TABLE IF EXISTS Pedido_Produto;
DROP TABLE IF EXISTS Pedido;
DROP TABLE IF EXISTS Cliente;
DROP TABLE IF EXISTS Produto;
DROP TABLE IF EXISTS Endereco;
DROP TABLE IF EXISTS LimiteDeCredito;

CREATE TABLE LimiteDeCredito (
    id_limite INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE Endereco (
    id_endereco INT PRIMARY KEY AUTO_INCREMENT,
    logradouro VARCHAR(255) NOT NULL,
    numero VARCHAR(20),
    cep VARCHAR(10),
    cidade VARCHAR(100)
);

CREATE TABLE Cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    sobreNome VARCHAR(100),
    cpf VARCHAR(14) UNIQUE,
    telefone VARCHAR(20),
    id_limite INT,
    id_endereco INT,
    CONSTRAINT fk_cliente_limite FOREIGN KEY (id_limite) REFERENCES LimiteDeCredito(id_limite),
    CONSTRAINT fk_cliente_endereco FOREIGN KEY (id_endereco) REFERENCES Endereco(id_endereco)
);

CREATE TABLE Produto (
    id_produto INT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Pedido (
    numeroPedido INT PRIMARY KEY,
    data_elaboracao DATE NOT NULL,
    id_cliente INT,
    CONSTRAINT fk_pedido_cliente FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
);

CREATE TABLE Pedido_Produto (
    id_pedido INT,
    id_produto INT,
    PRIMARY KEY (id_pedido, id_produto),
    CONSTRAINT fk_pp_pedido FOREIGN KEY (id_pedido) REFERENCES Pedido(numeroPedido),
    CONSTRAINT fk_pp_produto FOREIGN KEY (id_produto) REFERENCES Produto(id_produto)
);


-- INSERT
INSERT INTO LimiteDeCredito (id_limite, nome) VALUES
(1, 'BOM'),
(2, 'REGULAR'),
(3, 'RUIM');

INSERT INTO Endereco (id_endereco, logradouro, numero, cep, cidade) VALUES
(1, 'Rua das Flores', '100', '01001-000', 'São Paulo'),
(2, 'Av. Brasil', '500', '20040-000', 'Rio de Janeiro'),
(3, 'Rua Sete de Setembro', '12', '70040-010', 'Brasília'),
(4, 'Rua Amazonas', '99', '30110-001', 'Belo Horizonte'),
(5, 'Rua da Bahia', '1010', '40010-000', 'Salvador'),
(6, 'Av. Ipiranga', '200', '90010-000', 'Porto Alegre'),
(7, 'Rua da Guia', '45', '50030-210', 'Recife'),
(8, 'Av. Cândido Abreu', '150', '80530-000', 'Curitiba'),
(9, 'Rua João Negrão', '88', '60010-000', 'Fortaleza'),
(10, 'Av. Eduardo Ribeiro', '30', '69005-000', 'Manaus');

INSERT INTO Cliente (id_cliente, nome, sobreNome, cpf, telefone, id_limite, id_endereco) VALUES
(1, 'João', 'Silva', '111.111.111-11', '1199999-0001', 1, 1),
(2, 'Maria', 'Santos', '222.222.222-22', '2199999-0002', 1, 2),
(3, 'Pedro', 'Oliveira', '333.333.333-33', '6199999-0003', 2, 3),
(4, 'Ana', 'Souza', '444.444.444-44', '3199999-0004', 3, 4),
(5, 'Lucas', 'Pereira', '555.555.555-55', '7199999-0005', 1, 5),
(6, 'Carla', 'Lima', '666.666.666-66', '5199999-0006', 2, 6),
(7, 'Bruno', 'Ferreira', '777.777.777-77', '8199999-0007', 3, 7),
(8, 'Julia', 'Almeida', '888.888.888-88', '4199999-0008', 2, 8),
(9, 'Marcos', 'Costa', '999.999.999-99', '8599999-0009', 1, 9),
(10, 'Fernanda', 'Rocha', '000.000.000-00', '9299999-0010', 2, 10);

INSERT INTO Produto (id_produto, nome, descricao, preco) VALUES
(101, 'Smartphone X', 'Celular última geração', 2500.00),
(102, 'Notebook Pro', 'Processador i7 16GB RAM', 4500.00),
(103, 'Monitor 24p', 'Resolução Full HD', 800.00),
(104, 'Mouse Gamer', 'RGB 3200 DPI', 150.00),
(105, 'Teclado Mecânico', 'Switch Brown', 350.00),
(106, 'Headset Wireless', 'Som Surround 7.1', 400.00),
(107, 'Cadeira Office', 'Ergonômica', 1200.00),
(108, 'Webcam HD', '1080p com microfone', 250.00),
(109, 'SSD 1TB', 'NVMe Alta velocidade', 450.00),
(110, 'Mesa Digitalizadora', 'Sensível à pressão', 600.00);

INSERT INTO Pedido (numeroPedido, data_elaboracao, id_cliente) VALUES
(1001, '2023-10-01', 1), (1002, '2023-10-02', 2), (1003, '2023-10-02', 3),
(1004, '2023-10-03', 4), (1005, '2023-10-03', 5), (1006, '2023-10-04', 6),
(1007, '2023-10-05', 7), (1008, '2023-10-05', 8), (1009, '2023-10-06', 9),
(1010, '2023-10-07', 10), (1011, '2023-10-08', 1), (1012, '2023-10-09', 2),
(1013, '2023-10-10', 3), (1014, '2023-10-11', 4), (1015, '2023-10-12', 5),
(1016, '2023-10-13', 6), (1017, '2023-10-14', 7), (1018, '2023-10-15', 8),
(1019, '2023-10-16', 9), (1020, '2023-10-17', 10);

INSERT INTO Pedido_Produto (id_pedido, id_produto) VALUES
(1001, 101), (1002, 102), (1003, 103), (1004, 104), (1005, 105),
(1006, 106), (1007, 107), (1008, 108), (1009, 109), (1010, 110),
(1011, 101), (1011, 104),
(1012, 102), (1013, 103), (1014, 104), (1015, 105), (1016, 106),
(1017, 107), (1018, 108), (1019, 109), (1020, 110);

show tables;

use firma_db;

SELECT * FROM LimiteDeCredito;
SELECT * FROM Endereco;
SELECT * FROM Cliente;
SELECT * FROM Produto;
SELECT * FROM Pedido;
SELECT * FROM Pedido_Produto;

CREATE VIEW vwCliente_endereco AS
	SELECT Cliente.nome, Cliente.sobrenome, Cliente.telefone, Endereco.logradouro, Endereco.numero, Endereco.cep, Endereco.cidade
		FROM Cliente
		INNER JOIN Endereco
        ON Cliente.id_endereco = Endereco.id_endereco;
        
SELECT * FROM vwCliente_endereco;


CREATE VIEW vwCliente_limiteCredito AS
	SELECT Cliente.nome, Cliente.sobrenome, Cliente.telefone, LimiteDeCredito.nome 'Limite'
		FROM Cliente
		INNER JOIN LimiteDeCredito
        ON Cliente.id_limite = LimiteDeCredito.id_limite;
        
SELECT * FROM vwCliente_limiteCredito;