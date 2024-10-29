SELECT id,recent_message,created_at,description,owner,updated_at ,
(select username from (select * from 
(select * from chatmembers where chat_id = 85)
where user_id != 26) m
join users on id = m.user_id) as name
FROM 
(select chat_id, body as recent_message from messages where chat_id = 86 order by created_at desc limit 1) m
join chat on chat.id = m.chat_id;
