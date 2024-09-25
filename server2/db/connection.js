
let pg = require("pg")
const { Client,Pool } = pg
const client = new Client()



const pool = new Pool({
    user: 'postgres',
    password: 'matthew',
    host: 'localhost',
    port: 5432,
    database: 'estos',
  })


module.exports = pool

async function getUser(id){

    const res = await pool.query('SELECT username from users where username = $1', [id])
    return res.rows[0]
}
async function createUser(data){

}