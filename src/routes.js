const express = require('express');
const { cadastrarUsuario, login, detalharUsuario, atualizarUsuario } = require('./controllers/users')
const { listarCategorias, listarTransacoes, detalharTransacoes, atualizarTransacao, cadastrarTransacao, deletarTransacao, obterExtrato, transacoesFiltEntrada, transacoesFiltSaida } = require('./controllers/operations');
const usuarioLogado = require('./middlewares/autentication');

const route = express();

route.post('/usuario', cadastrarUsuario);
route.post('/login', login);

route.use(usuarioLogado)

route.get('/usuario/:id', detalharUsuario);
route.put('/atualizar/:id', atualizarUsuario)

route.get('/categoria', listarCategorias);
route.get('/transacao', listarTransacoes)
route.get('/transacao/:id', detalharTransacoes)
route.post('/transacao', cadastrarTransacao)
route.put('/transacao/:id', atualizarTransacao)
route.delete('/transacao/:id', deletarTransacao)
route.get('/transacao/extrato', obterExtrato)
route.get('/transacao/entrada', transacoesFiltEntrada)
route.get('/transacao/saida', transacoesFiltSaida)


module.exports = route;