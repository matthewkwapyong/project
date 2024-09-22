import styles from "./style.module.css";
import { Drop, Item } from '../../../Components/drop';
import { useState, useRef, useEffect } from 'react';
import socket from "../socket";

function Bubble({ sent, active, name, time, img, recent_message }) {
    let itemRef = useRef(null)
    useEffect(() => {
        const contextMen = document.getElementsByClassName("dropdown_content")[0];
        itemRef.current.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const x = e.clientX;
            const y = e.clientY;

            // Calculate the maximum allowable x and y positions to keep the context menu within the window
            const maxX = window.innerWidth - contextMen.offsetWidth;
            const maxY = window.innerHeight - contextMen.offsetHeight;

            // Ensure the context menu stays within the window boundaries
            contextMen.style.left = Math.min(x, maxX) + 'px';
            contextMen.style.top = Math.min(y, maxY) + 'px';
            contextMen.style.display = 'block';
        });

        document.addEventListener('click', (e) => {
            if (contextMen.style.display === 'block' && !contextMen.contains(e.target)) {
                contextMen.style.display = 'none';
            }
        });

        contextMen.addEventListener('click', () => {
            contextMen.style.display = 'none';
        });

        // Close the context menu when clicking outside of the window
        window.addEventListener('click', (e) => {
            if (contextMen.style.display === 'block' && !contextMen.contains(e.target)) {
                contextMen.style.display = 'none';
            }
        });
    }, [])
    return (

        <div className={styles.messageItem}>
            {sent ?
                <div className={styles.receiveContainer} >
                    <div id={styles.time}>
                        <label>
                            12:32pm
                        </label>
                    </div>
                    <div id={styles.bubble} ref={itemRef}>
                        <label>
                            {recent_message}
                        </label>
                    </div>
                </div>
                :
                <div className={styles.sendContainer}>
                    <div id={styles.bubble} ref={itemRef}>
                        <label>
                            {recent_message}
                        </label>
                    </div>
                </div>
            }
        </div >
    )
}



export default function Main(activeChat) {
    const textareaRef = useRef(null);
    let itemRef = useRef(null)
    let [chat, setChat] = useState(["hello", "mello","dadad"])
    let [inputValue, setinputValue] = useState("")
    let h = useRef([])
    function changet(e) {
        setinputValue(e.target.value)
    }
    function send() {
        socket.emit('message', {
            text: inputValue,
            room: activeChat.activeChat.chat.id
        });
    }

    useEffect(() => {
        console.log(activeChat.activeChat.chat.id)
        socket.emit('join',{
            id:activeChat.activeChat.chat.id
        })
        socket.on('chat',function(data){
            setChat((prevChat) => [...prevChat, data]);
            console.log("Received from server:", data);
         });
    }, [activeChat])


    useEffect(() => {
        const textarea = textareaRef.current;
        const adjustHeight = () => {
            textarea.style.height = '45px';
            textarea.style.height = `${Math.min(textarea.scrollHeight, parseInt(window.getComputedStyle(textarea).maxHeight))}px`;
        };

        textarea.addEventListener('input', adjustHeight);
        adjustHeight(); // Adjust height on initial render

        return () => {
            textarea.removeEventListener('input', adjustHeight);
        };
    }, []);

    return (
        <div className={styles.Chat}>
            <div className="dropdown_content" >
                <div className="drop">
                    <Item onClick={() => { console.log("hello") }}>
                        hello
                    </Item>
                    <Item onClick={() => { console.log("hello") }}>
                        fello
                    </Item>
                    <Item onClick={() => { console.log("hello") }}>
                        hello
                    </Item>
                </div>
            </div>
            <div className={styles.Header}>
                daaa
            </div>
            <div className={styles.MessagesContainer}>
                <div className={styles.messageListContainer}>
                    <div className={styles.messageList}>
                        {chat.map((data) => (
                            <Bubble sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={data} />
                        ))}

                        {/* <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={true} active={true} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={true} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={true} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={`yo whassssssddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                            dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                            dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                            ddddddddddddddddddddddddddssssssssssssssssssssssssssssssssssssdddddddd
                            dddddddddsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
                            ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
                            sssssssssssssssssssssssts nadbb happening`} />
                        <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={true} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={true} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={true} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={true} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={true} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} /> */}

                    </div>

                </div>
            </div>
            <div className={styles.MessageInputContainer}>
                <div className={styles.InputContainer}>
                    <textarea ref={textareaRef} value={inputValue} onChange={changet} placeholder="message" />
                    <div className={styles.SendContainer}>
                        <button onClick={send}>
                            {">"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}