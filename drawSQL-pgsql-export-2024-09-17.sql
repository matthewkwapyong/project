CREATE TABLE "users"(
    "id" SERIAL PRIMARY KEY,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
CREATE TABLE "chatmembers"(
    "chatid" BIGINT NOT NULL,
    "userid" BIGINT NOT NULL
);
ALTER TABLE
    "chatmembers" ADD PRIMARY KEY("chatid");
CREATE TABLE "chat"(
    "id" BIGINT NOT NULL,
    "created" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);
ALTER TABLE
    "chat" ADD PRIMARY KEY("id");
CREATE TABLE "messages"(
    "id" BIGINT NOT NULL,
    "chatid" BIGINT NOT NULL,
    "sender" BIGINT NOT NULL,
    "body" TEXT NOT NULL,
    "deleted_from_sender" BOOLEAN NOT NULL,
    "deleted_from_receiver" BOOLEAN NOT NULL
);
ALTER TABLE
    "messages" ADD PRIMARY KEY("id");
ALTER TABLE
    "chatmembers" ADD CONSTRAINT "chatmembers_userid_foreign" FOREIGN KEY("userid") REFERENCES "users"("id");
ALTER TABLE
    "chat" ADD CONSTRAINT "chat_id_foreign" FOREIGN KEY("id") REFERENCES "chatmembers"("chatid");
ALTER TABLE
    "messages" ADD CONSTRAINT "messages_chatid_foreign" FOREIGN KEY("chatid") REFERENCES "chat"("id");
ALTER TABLE
    "messages" ADD CONSTRAINT "messages_sender_foreign" FOREIGN KEY("sender") REFERENCES "users"("id");