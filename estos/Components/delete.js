import { useState } from "react"
import { getCookie } from 'cookies-next';
import socket from "@/app/socket";
import styles from './delete.module.css'
export default function Home({ contextItem, cancel, owner, removeMessage,user_id }) {
    let [selected, setSelected] = useState(0)
    function click(d) {
        setSelected(d)
    }
    async function remove() {
        //1 delete sender message only for sender
        //2 delete for both sender and receiver
        //3 delete only for receiver
        let accessToken = getCookie('accessToken');
        let dab = { id: contextItem.id, chat_id: contextItem.chat_id, sender: contextItem.sender, type: selected,user_id:user_id }
        if (!owner && selected === 0) {
            dab.type = 3
        }
        socket.emit("deleteMessage",dab)
    }

    return (
        <div className={styles.Container}>
            <div style={owner ? {gap:"40px"} : { height: "126px"}}>
                <div className={styles.top}>
                    <div className={styles.title}>
                        <label>
                            Delete message
                        </label>
                    </div>
                    {owner ?
                        <div className={styles.ItemContainer}>
                            <div className={styles.Item}>
                                <Check active={selected === 1 ? true : false} click={() => click(1)} />
                                <label>Delete for me</label>
                            </div>
                            <div className={styles.Item}>
                                <Check active={selected === 2 ? true : false} click={() => click(2)} />
                                <label>Delete for Everyone</label>
                            </div>
                        </div>
                        :
                        <div>

                        </div>
                    }
                </div>
                <div className={styles.actionContainer}>
                    <button id={styles.delete} onClick={remove}>
                        Delete
                    </button>
                    <button id={styles.cancel} onClick={cancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}


function Check({ active, click }) {
    return (
        <div className={styles.check} id={active ? styles.active : ""} onClick={click}>
        </div>
    )
}