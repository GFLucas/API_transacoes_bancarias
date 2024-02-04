const pool = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateKey = require('../privateKey')
const erroDesconhecido = () => {
    console.log(error)
    return res.status(500).json({ Mensagem: 'Erro no servidor!!!' })
}

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
        erroDesconhecido()
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
            return res.status(400).json({ Mensagem: 'Usuário e/ou senha inválido(s).' });
        };

        const token = jwt.sign({ id: usuario.rows[0].id }, privateKey, { expiresIn: '8h' });
        const idUsuario = usuario.rows[0].id

        const { senha: _, ...usuarioLogado } = usuario.rows[0]

        return res.status(200).json({ usuario: usuarioLogado, token, idUsuario });

    } catch (error) {
        erroDesconhecido()
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
        erroDesconhecido()
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
        erroDesconhecido()
    };
};
const listarCategorias = async (req, res) =>{

    try {
        const todasCategorias = await pool.query(`SELECT id,descricao FROM usuarios`);
        return res.status(200).json([todasCategorias])
        
    } catch (error) {
        erroDesconhecido()
    }
}
const listarTransacoes = async (req, res) => {
    try {
        const todasTransacoes = await pool.query(`SELECT * FROM usuarios join transacoes on $1 = usuario_id `,[idUsuario])
        return res.status(200).json({todasTransacoes})
        
    } catch (error) {
        erroDesconhecido()

    }
}
const detalharTransacoes = async (req, res) => {
    try {
        const idTransacao = req.params.id
        const transacaoDetalhada = await pool.query(`SELECT * FROM usuarios join transacoes on $1 = $2 `,[idUsuario, idTransacao])
        return res.status(200).json({transacaoDetalhada})
        
    } catch (error) {
        erroDesconhecido()

    }
}
const cadastrarTransacao = async (req,res) =>{
    const {descricao,valor,data,categoria_id,tipo} = req.body
    const tipoLowerCase = tipo.tipoLowerCase()
    try {
        if(!descricao || !valor || !data || !categoria_id || !tipo){
            return res.status(400).json({mensagem:'Todos os campos devem ser informados'})
        }
        if (tipo !== "entrada" && tipo !== "saida"){
            return res.status(400).json({mensagem:"Tipo invalido !"})
        }
        const novaTransacao = await pool.query(`INSERT INTO transacoes (descricao,valor,data,categoria_id,tipo,usuario_id) VALUES ($1, $2, $3, $4, $5, $6) returning *`,
            [descricao,valor,data,categoria_id,tipoLowerCase,idUsuario]
        );
        return res.status(201).json({novaTransacao})
    } catch (error) {
        erroDesconhecido()
    }
}
const atualizarTransacao = async (req,res) => {
    const {id} = req.params
    const {descricao,valor,data,categoria_id,tipo} = req.body
    const tipoLowerCase = tipo.tipoLowerCase()
    try {
        if (id < 0) {
            res.status(400).json({mensagem: " Id invalido"})
        }
        if(!descricao || !valor || !data || !categoria_id || !tipo){
            return res.status(400).json({mensagem:'Todos os campos devem ser informados'})
        }
        if (tipo !== "entrada" && tipo !== "saida"){
            return res.status(400).json({mensagem:"Tipo invalido !"})
        }
        const transacaoSolicitada = await pool.query(`SELECT $1 FROM transacoes join usuarios on usuario_id = $2`, [id,idUsuario])
        if(transacaoSolicitada < 0){
            return res.status(400).json({mensagem:"Transação invalida"})
        }
        const atualizandoTransacao = await pool.query(`update transacoes set
        descricao = $1 
        valor = $2 
        data = $3 
        categoria_id = $4 
        tipo = $5 where id = $6 `, [descricao, valor, data, categoria_id, tipoLowerCase, id])
        

    } catch (error) {
        erroDesconhecido()
    }
}
const deletarTransacao = async (req,res) =>{
    const {id} = id.params
    try {
        if(id < 0 ){
            return res.status(400).json({mensagem:"Id de transação invalido !"})
        }
        const procurarTransacao = await pool.query (`SELECT * FROM transacoes where id = $1 and usuario_id = $2`, [id, idUsuario])
        if (procurarTransacao < 0){
            return res.status (400).json({mensagem:"Transação inexistente ou não encontrada"})
        }
        const deletar = await pool.query (`DELETE FROM transacoes where id = $1`, [id])
        return res.status (201).json()
    } catch (error) {
        erroDesconhecido()
    }
}
const obterExtrato = async (req,res) =>{
    try {
        const somaEntrada = await pool.query(`SELECT SUM(valor) FROM transacoes WHERE tipo = "entrada" and usuario_id = $1`[idUsuario])
        const somaSaida = await pool.query(`SELECT SUM(valor) FROM transacoes WHERE tipo = "saida" and usuario_id = $1`[idUsuario])
        return res.status(200).json({Entrada: somaEntrada, saida: somaSaida})
    } catch (error) {
        erroDesconhecido()
    }
}
const transacoesFiltEntrada = async (req,res) =>{

    try {
        const transacoesEntrada = await pool.query(`SELECT * FROM transacoes WHERE usuario_id = $1 AND tipo = "entrada"`,[idUsuario])
        return res.status(200).json ({transacoesEntrada})
        
    } catch (error) {
        erroDesconhecido()
    }
}
const transacoesFiltSaida = async (req,res) =>{

    try {
        const transacoesSaida = await pool.query(`SELECT * FROM transacoes WHERE usuario_id = $1 AND tipo = "saida"`,[idUsuario])
        return res.status(200).json ({transacoesSaida})
        
    } catch (error) {
        erroDesconhecido()
    }
    
}
module.exports = {
    cadastrarUsuario,
    login,
    detalharUsuario,
    atualizarUsuario,
    listarCategorias,
    listarTransacoes,
    detalharTransacoes,
    cadastrarTransacao,
    atualizarTransacao,
    deletarTransacao,
    obterExtrato,
    transacoesFiltEntrada,
    transacoesFiltSaida

};