const pool = require('../src/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateKey = require('../src/privateKey')


const usuarioLogado = async (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ Mensagem: 'Usuário não autorizado.' });
    };

    const token = authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ Mensagem: 'A senha deve ser fornecida.' })
    };

    try {
        const { id } = jwt.verify(token, privateKey);

        const { rows, rowCount } = await pool.query(`SELECT * FROM usuarios WHERE id =$1`,
            [id]
        );

        if (rowCount < 1) {
            return res.status(401).json({ Mensagem: 'Usuário não autorizado' })
        };

        req.usuario = rows[0];

        next()


    } catch (error) {
        console.log(error)
        return res.status(500).json({ Mensagem: 'Erro interno do servidor' })
    }
}

module.exports = usuarioLogado;