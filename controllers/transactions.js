const pool = require('../src/connection');

const listarCategorias = async (req, res) => {

    try {
        const { rows } = await pool.query(`SELECT * FROM categorias`)

        return res.status(200).json(rows);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ Menssagem: 'Erro no servidor!!!' })
    }
}

module.exports = {
    listarCategorias
}