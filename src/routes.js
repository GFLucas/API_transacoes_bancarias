const express = require('express');
const { cadastrarUsuario, login, detalharUsuario, atualizarUsuario } = require('../controllers/users')
const { listarCategorias } = require('../controllers/transactions');
const usuarioLogado = require('../middlewares/autentication');

const route = express();

route.post('/usuario', cadastrarUsuario);
route.post('/login', login);

route.use(usuarioLogado)

route.get('/usuario/:id', detalharUsuario);
route.put('/atualizar/:id', atualizarUsuario)

route.get('/categoria', listarCategorias);


module.exports = route;