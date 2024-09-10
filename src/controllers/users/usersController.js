const {Pool} = require('pg'); //Importa módulo 'pg' para conectar ao PostgreSQL
const bcrypt = require('bcryptjs');// Importa modulo bcryptjs pra criptografar senhas

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
});

// Funçao que cria novo usuário

const createUser = async (req,res) => {
    try {
        const {name, email, password, birth_date, city, hobbies, language_level } = req.body;

        // Verificar se o email já existe
        const existingUser = await pool.query('SELECT 1 FROM Users WHERE email = $1', [email]);

        if (existingUser.rows.length > 1) {
            return res.status(400).json({error:'Email já cadastrado' })
        }

        //Validar os dados de entrada(Mais tarde)


        //Criptografar a senha

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        //Inserir novo usuário no banco de dados
        const result = await pool.query(
            'INSERT INTO Users (name, email, password_hash, birth_date, city, hobbies, language_level) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, email, passwordHash, birth_date, city, hobbies, language_level]
        );

        //Responder com dados do usuáriocriados sem senha
        res.status(201).json({
            user_id: result.rows[0].user_id,
            name: result.rows[0].name,
            email: result.rows[0].email,
        });
    } catch (error) {
        if(error.code === '23505') {
            return res.status(400).json({error: 'Email já cadastrado!'});
        }

        console.error('Erro ao criar usuário: ', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
};

module.exports ={
    createUser,
}