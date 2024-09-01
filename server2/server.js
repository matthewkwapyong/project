// let express = require('express')
// let pg = require('pg')


// let app = express();


// const { Client,Pool } = pg
// const client = new Client()



// const pool = new Pool({
//     user: 'postgres',
//     password: 'matthew',
//     host: 'localhost',
//     port: 5432,
//     database: 'postgres',
//   })

  
// async function k(){
//     // await client.connect()
//     const res = await pool.query('SELECT * from users', [])
//     console.log(res.rows)

// }
 
// k()



// // app.get('/he',(req,res)=>{
   
// // })


// // app.listen(5000)






class Ap{
    #hello = "smeacsak"
    constructor(name){
      this.name = name
    }
    
    a(){
      console.log(this.#hello)
      console.log(this.name)
    }
}


class dog extends Ap{

}

let g = new dog("aaa")

