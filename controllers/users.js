const pool = require('../src/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateKey = require('../src/privateKey')

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {

        const verificarEmail = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (verificarEmail.rowCount > 0) {
            return res.status(400).json({ Mensagem: 'Já existe usuário cadastrado com o e-mail informado.' });
        };

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await pool.query(`INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) returning *`,
            [nome, email, senhaCriptografada]
        );

        const usuarioCadastrado = {
            id: novoUsuario.rows[0].id,
            nome,
            email,
        };

        return res.status(201).json(usuarioCadastrado);

    } catch (error) {
        return res.status(500).json({ Mensagem: 'Erro no servidor!!!' })
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await pool.query(`SELECT * FROM usuarios where email = $1`, [email]);

        if (usuario.rowCount < 1) {
            return res.status(400).json({ Mensagem: 'Usuário e/ou senha inválido(s).' });
        };

        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha);

        if (!senhaValida) {
            console.log('aqui')

            return res.status(400).json({ Mensagem: 'Usuário e/ou senha inválido(s).' });
        };

        const token = jwt.sign({ id: usuario.rows[0].id }, privateKey, { expiresIn: '8h' });

        const { senha: _, ...usuarioLogado } = usuario.rows[0]

        return res.status(200).json({ usuario: usuarioLogado, token });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ Mensagem: 'Erro no servidor!!!' })
    };

};

const detalharUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await pool.query(`SELECT * FROM usuarios WHERE id = $1`,
            [id]
        );

        if (usuario.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Usuário não cadastrado.'});
        }

        const perfil = {
            id: usuario.rows[0].id,
            nome: usuario.rows[0].nome,
            email: usuario.rows[0].email,
        }

        return res.status(200).json(perfil);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ Mensagem: 'Erro no servidor!!!' })
    };
};

const atualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    try {
        const verificarEmail = await pool.query(`SELECT * FROM usuarios WHERE email = $1`,
            [email]
        );

        if (verificarEmail.rowCount > 0) {
            return res.status(400).json({ Mensagem: 'Já existe usuário cadastrado com o e-mail informado.' });
        };

        const usuario = await pool.query(`UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4`,
            [nome, email, senha, id]
        );
        return res.status(204).json([])

    } catch (error) {
        console.log(error)
        return res.status(500).json({ Mensagem: 'Erro no servidor!!!' })
    };
};


module.exports = {
    cadastrarUsuario,
    login,
    detalharUsuario,
    atualizarUsuario
};