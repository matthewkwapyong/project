SELECT id,recent_message,created_at,description,owner,updated_at ,
(select username from (select * from 
(select * from chatmembers where chat_id = 85)
where user_id != 26) m
join users on id = m.user_id) as name
FROM 
(select chat_id, body as recent_message from messages where chat_id = 86 order by created_at desc limit 1) m
join chat on chat.id = m.chat_id;

CREATE TABLE "users"(
    "id" SERIAL PRIMARY KEY,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
CREATE TABLE chat(
    "id" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"owner" INTEGER NOT NULL
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL,
    sender INT NOT NULL,
    body TEXT NOT NULL,
    deleted_from_sender BOOLEAN DEFAULT FALSE,
    deleted_from_receiver BOOLEAN DEFAULT FALSE,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    edited BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE,
    FOREIGN KEY (sender) REFERENCES users(id) ON DELETE CASCADE
);



CREATE TABLE "chatmembers"(
    "chat_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL
);

ALTER TABLE
    "chat" ADD CONSTRAINT "chat_owner_foreign" FOREIGN KEY("owner") REFERENCES "users"("id");

	
ALTER TABLE
    "chatmembers" ADD CONSTRAINT "chatmembers_userid_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");

ALTER TABLE
    "chatmembers" ADD CONSTRAINT "chat_id_foreign" FOREIGN KEY("chat_id") REFERENCES "chat"("id");

ALTER TABLE
    "messages" ADD CONSTRAINT "messages_chatid_foreign" FOREIGN KEY("chat_id") REFERENCES "chat"("id");
ALTER TABLE
    "messages" ADD CONSTRAINT "messages_sender_foreign" FOREIGN KEY("sender") REFERENCES "users"("id");




