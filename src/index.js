require('dotenv').config(); //Carrega as variáveis de ambiente

const express = require('express');
const pg = require('pg');
const cors = require('cors');
const helmet = require('helmet');
const userController = require('./controllers/users/usersController')

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * CONFIGURAÇÕES DE SEGURANÇA
*/
app.use(helmet()); // Middleware para segurança e vulnerabilidade
app.use(cors()); // Habilita CORS
app.use(express.json()); // Para a aplicação entender JSON no corpo das requisições

/** 
* CONFIGURAÇÃO DO BANCO DE DADOS
*/

//Conectando ao PostgreSQL
const { Pool } = pg;
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
})
pool.connect()
    .then(() => console.log('Conectado ao banco de dados PostgreSQL!'))
    .catch((err)=> console.error('Erro ao conectar banco de dados:', err.stack));


/**
 * CONFIGURAÇÕES DE ROTAS
*/


app.post('/users', userController.createUser);

//Rota de teste da API
app.get('/', (req, res)=> {
    res.send('API do FreeLearninChat está funcionando!')
});

//Rota para testar a conexão com o banco de dados
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);
    } catch(err) { 
        console.error('Erro ao consultar o banco de dados:', err);
        res.status(500).json({ error: 'Erro ao consultar o banco de dados' })
    }
});





/**
 * CONFIGURAÇÕES DO SERVIDOR
*/

//Iniciando o servidor Express
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}!`)
})

