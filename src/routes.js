const express = require('express');
const { cadastrarUsuario, login, detalharUsuario, atualizarUsuario } = require('../controllers/users')
const { listarCategorias } = require('../controllers/transactions')

const route = express();

route.post('/usuario', cadastrarUsuario);
route.post('/login', login);

route.get('/usuario/:id', detalharUsuario);
route.put('/atualizar/:id', atualizarUsuario)



route.get('/categoria', listarCategorias);


module.exports = route;