use tokio_postgres::Client;

pub struct User{
    id:i32,
    firstname:String,
    lastname:String,
    username:String,
    password:String,
    created:String,
    email:String,
}


impl User{
    pub async fn get_user(client:&Client,id:i32){
        let query = client.query("SELECT * FROM users WHERE id = $1", &[&id]).await.unwrap();
        println!("{:?}",query);
        for row in query{
            let g:String = row.get(2);
            println!("{:?}",g);
        }
    }   
    pub async fn add_user(client:&Client,id:i32){
        
    }
    pub async fn delete_user(client:&Client,id:i32){
        
    }
}