// pg_ctl.exe restart -D  "C:\Program Files\PostgreSQL\16\data"

use actix_web::{get, web, App, HttpServer, Responder};
use tokio_postgres::{Error, NoTls};

mod db;
use db::user::User;

#[get("/")]
async fn index() -> impl Responder {
    "Hello, World!"
}

#[get("/{name}")]
async fn hello(name: web::Path<String>) -> impl Responder {
    format!("Hello {}!", &name)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let (client, connection) = tokio_postgres::connect("postgres://postgres:matthew@localhost/estos", NoTls)
        .await
        .unwrap();

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });
    User::get_user(&client,25).await;
    // let rows = client
    //     .query("SELECT * FROM USERS", &[])
    //     .await.unwrap();
    // for row in rows{
    //     let g:String = row.get(1);
    //     println!("{:?}",g);
    // }
    HttpServer::new(|| App::new().service(index).service(hello))
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
