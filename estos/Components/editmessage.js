import { useState,useEffect } from "react"
import { getCookie } from 'cookies-next';
import socket from "@/app/socket";
import styles from './editmessage.module.css'
export default function EditMessageContainer({ contextItem, cancel, owner, Edit, user_id }) {
    let [inputValue, setinputValue] = useState("")
    async function remove() {
        //1 delete sender message only for sender
        //2 delete for both sender and receiver
        //3 delete only for receiver
        let accessToken = getCookie('accessToken');
        let dab = { id: contextItem.id, chat_id: contextItem.chat_id, sender: contextItem.sender, type: selected, user_id: user_id }
        if (!owner && selected === 0) {
            dab.type = 3
        }
        socket.emit("deleteMessage", dab)
    }
    function editMessage(){
        Edit(contextItem,inputValue)
    }
    function changeValue(e) {
        setinputValue(e.target.value)
    }
    useEffect(()=>{
        setinputValue(contextItem.body)
    },[])
    return (
        <div className={styles.Container}>
            <div>
                <div className={styles.textContainer}>
                    <textarea value={inputValue} onChange={changeValue}></textarea>
                </div>
                <div className={styles.actionContainer}>
                    <button id={styles.delete} onClick={editMessage}>
                        Edit
                    </button>
                    <button id={styles.cancel} onClick={cancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
