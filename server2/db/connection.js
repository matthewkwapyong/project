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


pool = new Pool("postgresql://estos:gEqLcmP92xErT60YkFxYltm9ElTR9uST@dpg-ctpj8mrqf0us73ecin30-a.oregon-postgres.render.com/estos");


module.exports = pool

