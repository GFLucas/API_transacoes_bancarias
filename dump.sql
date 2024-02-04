CREATE DATABASE dindin;

CREATE TABLE usuarios(
  id serial PRIMARY KEY,
  nome text NOT NULL,
  email text NOT NULL,
  senha text NOT NULL);
  
  CREATE TABLE categorias(
    id serial PRIMARY KEY,
    descricao text NOT NULL);
  
  CREATE TABLE transacoes(
    id serial PRIMARY KEY,
    descricao text NOT NULL,
    valor integer NOT NULL,
    data date NOT NULL,
    categoria_id integer references categorias(id) NOT NULL,
    usuario_id integer references usuarios(id) NOT NULL,
    tipo text NOT NULL);
    
    INSERT INTO categorias (descricao)
    VALUES
    ('Alimentação'), ('Assinaturas e Serviços'),('Casa'),('Mercado'),('Cuidados Pessoais'),('Educação'),
    ('Família'),('Lazer'),('Pets'),('Presentes'),('Roupas'),('Saúde'),('Transporte'),('Salário'),('Vendas'),
    ('Outras receitas'),('Outras despesas');
