const pool = require('../connection');

const erroDesconhecido = () => {
    console.log(error)
    return res.status(500).json({ Mensagem: 'Erro no servidor!!!' })
};

const listarCategorias = async (req, res) => {
    const { id } = req.usuario
    console.log(id)

    try {
        const { rows } = await pool.query(`SELECT * FROM categorias`)

        return res.status(200).json(rows);

    } catch (error) {
        console.log(erroDesconhecido)
    }
}

const listarTransacoes = async (req, res) => {
    const { id } = req.usuario

    try {
        const { rows } = await pool.query(`SELECT * FROM usuarios join transacoes on $1 = usuario_id `, [id])
        return res.status(200).json(rows)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ Menssagem: 'Erro no servidor!!!' })

    }
};

const cadastrarTransacao = async (req, res) => {
    const { id } = req.usuario
    const { descricao, valor, data, categoria_id, tipo } = req.body

    try {
        if (!descricao || !valor || !data || !categoria_id || !tipo) {
            return res.status(400).json({ mensagem: 'Todos os campos devem ser informados' })
        }
        const tipoLowerCase = tipo.toLowerCase();
        if (tipoLowerCase !== "entrada" && tipoLowerCase !== "saida") {
            return res.status(400).json({ mensagem: "Tipo inválido !" })
        }
        const novaTransacao = await pool.query(`INSERT INTO transacoes (descricao, valor, data, categoria_id, tipo, usuario_id) 
        VALUES 
        ($1, $2, $3, $4, $5, $6) returning *`,
            [descricao, valor, data, categoria_id, tipoLowerCase, id]
        );

        const transacao = novaTransacao.rows[0]

        const nomeCategoria = await pool.query(
            `SELECT descricao
            FROM categorias
            WHERE id = $1`,
            [categoria_id]
        );

        const cadastro = {
            id: transacao.id,
            tipo: transacao.tipo,
            descricao: transacao.descricao,
            valor: transacao.valor,
            data: transacao.data,
            usuario_id: req.usuario.id,
            categoria_id: transacao.id,
            categoria_nome: nomeCategoria.rows[0].descricao,
        };

        return res.status(201).json(cadastro)
    } catch (error) {
        console.log(error)
    }
};

const detalharTransacoes = async (req, res) => {
    const { id } = req.params;
    const { id: usuarioId } = req.usuario;

    try {
        const transacao = await pool.query(
            `SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome
            FROM transacoes t
            INNER JOIN categorias c ON t.categoria_id = c.id
            WHERE t.id = $1 AND t.usuario_id = $2`,
            [id, usuarioId]
        );

        const transacoes = transacao.rows[0]

        if (!transacoes) {
            return res.status(404).json({ Mensagem: "Transação não encontrada." })
        };
        
        return res.status(201).json(transacoes)

    } catch (error) {
        console.log(error)
    }
};


const atualizarTransacao = async (req, res) => {
    const { id } = req.params
    const { descricao, valor, data, categoria_id, tipo } = req.body
    const tipoLowerCase = tipo.tipoLowerCase()
    try {
        if (id < 0) {
            res.status(400).json({ mensagem: " Id invalido" })
        }
        if (!descricao || !valor || !data || !categoria_id || !tipo) {
            return res.status(400).json({ mensagem: 'Todos os campos devem ser informados' })
        }
        if (tipo !== "entrada" && tipo !== "saida") {
            return res.status(400).json({ mensagem: "Tipo invalido !" })
        }
        const transacaoSolicitada = await pool.query(`SELECT $1 FROM transacoes join usuarios on usuario_id = $2`, [id, idUsuario])
        if (transacaoSolicitada < 0) {
            return res.status(400).json({ mensagem: "Transação invalida" })
        }
        const atualizandoTransacao = await pool.query(`update transacoes set
        descricao = $1 
        valor = $2 
        data = $3 
        categoria_id = $4 
        tipo = $5 where id = $6 `, [descricao, valor, data, categoria_id, tipoLowerCase, id])


    } catch (error) {
        console.log(error)
    }
}
const deletarTransacao = async (req, res) => {
    const { id } = id.params
    try {
        if (id < 0) {
            return res.status(400).json({ mensagem: "Id de transação invalido !" })
        }
        const procurarTransacao = await pool.query(`SELECT * FROM transacoes where id = $1 and usuario_id = $2`, [id, idUsuario])
        if (procurarTransacao < 0) {
            return res.status(400).json({ mensagem: "Transação inexistente ou não encontrada" })
        }
        const deletar = await pool.query(`DELETE FROM transacoes where id = $1`, [id])
        return res.status(201).json()
    } catch (error) {
        console.log(error)
    }
}
const obterExtrato = async (req, res) => {
    try {
        const somaEntrada = await pool.query(`SELECT SUM(valor) FROM transacoes WHERE tipo = "entrada" and usuario_id = $1`[idUsuario])
        const somaSaida = await pool.query(`SELECT SUM(valor) FROM transacoes WHERE tipo = "saida" and usuario_id = $1`[idUsuario])
        return res.status(200).json({ Entrada: somaEntrada, saida: somaSaida })
    } catch (error) {
        console.log(error)
    }
}
const transacoesFiltEntrada = async (req, res) => {

    try {
        const transacoesEntrada = await pool.query(`SELECT * FROM transacoes WHERE usuario_id = $1 AND tipo = "entrada"`, [idUsuario])
        return res.status(200).json({ transacoesEntrada })

    } catch (error) {
        console.log(error)
    }
}
const transacoesFiltSaida = async (req, res) => {

    try {
        const transacoesSaida = await pool.query(`SELECT * FROM transacoes WHERE usuario_id = $1 AND tipo = "saida"`, [idUsuario])
        return res.status(200).json({ transacoesSaida })

    } catch (error) {
        console.log(error)
    }

}

module.exports = {
    listarCategorias,
    listarTransacoes,
    detalharTransacoes,
    cadastrarTransacao,
    atualizarTransacao,
    deletarTransacao,
    obterExtrato,
    transacoesFiltEntrada,
    transacoesFiltSaida
}