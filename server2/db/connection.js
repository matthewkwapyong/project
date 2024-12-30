let pg = require("pg")
const { Client, Pool } = pg
const client = new Client()

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } = process.env

// const pool = new Pool({
//     user: 'postgres',
//     password: 'matthew',
//     host: 'localhost',
//     port: 5432,
//     database: 'estos',
//   })


pool = new Pool({
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD
});


module.exports = pool

