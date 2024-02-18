const express = require('express');
const { cadastrarUsuario, login, detalharUsuario, atualizarUsuario } = require('./controllers/users')
const { listarCategorias, listarTransacoes, detalharTransacoes, atualizarTransacao, cadastrarTransacao, deletarTransacao, obterExtrato, transacoesFilt } = require('./controllers/operations');
const usuarioLogado = require('./middlewares/autentication');

const route = express();

route.post('/usuario', cadastrarUsuario);
route.post('/login', login);

route.use(usuarioLogado)

route.get('/usuario', detalharUsuario);
route.put('/atualizar', atualizarUsuario)

route.get('/categoria', listarCategorias);
route.get('/transacao', listarTransacoes);
route.get('/transacao/:id', detalharTransacoes);
route.post('/transacao', cadastrarTransacao);
route.put('/transacao/:id', atualizarTransacao);
route.delete('/transacao/:id', deletarTransacao);
route.get('/transacao/extrato', obterExtrato);
route.get('/transacoes', transacoesFilt);



module.exports = route;