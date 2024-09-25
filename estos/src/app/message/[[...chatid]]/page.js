'use client'
import styles from "./style.module.css";
import { Drop, Item } from '../../../../Components/drop';
import { useState, useRef, useEffect } from 'react';
import socket from "../../socket";
import { getCookie } from 'cookies-next';
import { useMessageContext } from '../context'
import Scroll from "../../../../Components/scrollToBottom";

function Bubble({ data, user }) {
    let itemRef = useRef(null)
    function format_date(date) {
        let d = new Date(date)
        let str = `${d.getHours()}:${d.getMinutes()}`
        return str
    }
    useEffect(() => {
        // console.log(user,"saaaaaaa")
    }, [])
    // useEffect(() => {
    //     const contextMen = document.getElementsByClassName("dropdown_content")[0];
    //     itemRef.current.addEventListener('contextmenu', (e) => {
    //         e.preventDefault();
    //         const x = e.clientX;
    //         const y = e.clientY;

    //         // Calculate the maximum allowable x and y positions to keep the context menu within the window
    //         const maxX = window.innerWidth - contextMen.offsetWidth;
    //         const maxY = window.innerHeight - contextMen.offsetHeight;

    //         // Ensure the context menu stays within the window boundaries
    //         contextMen.style.left = Math.min(x, maxX) + 'px';
    //         contextMen.style.top = Math.min(y, maxY) + 'px';
    //         contextMen.style.display = 'block';
    //     });

    //     document.addEventListener('click', (e) => {
    //         if (contextMen.style.display === 'block' && !contextMen.contains(e.target)) {
    //             contextMen.style.display = 'none';
    //         }
    //     });

    //     contextMen.addEventListener('click', () => {
    //         contextMen.style.display = 'none';
    //     });

    //     // Close the context menu when clicking outside of the window
    //     window.addEventListener('click', (e) => {
    //         if (contextMen.style.display === 'block' && !contextMen.contains(e.target)) {
    //             contextMen.style.display = 'none';
    //         }
    //     });
    // }, [])
    return (

        <div className={styles.messageItem}>
            {data.sender == user.id ?
                <div className={styles.mainContainer + " " + styles.sendContainer} >
                    <div id={styles.bubble} ref={itemRef} >
                        <div id={styles.text} style={{background:"#0058c0"}}>
                            <label>
                                {data.body}
                            </label>
                        </div>
                        <div id={styles.time1}>
                            <label id={styles.timeLabel}>
                                {format_date(data.created_at)}
                            </label>
                        </div>
                    </div>
                </div>
                :
                <div className={styles.mainContainer + " " + styles.receiveContainer}  >
                    <div id={styles.bubble} ref={itemRef}>
                        <div id={styles.text}>
                            <label>
                                {data.body}
                            </label>
                        </div>
                        <div id={styles.time2} >
                            <label id={styles.timeLabel}>
                                {format_date(data.created_at)}
                            </label>
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}
export default function Main({ params }) {
    const initialized = useRef(false)
    const { user, loading, activeChat } = useMessageContext()
    const textareaRef = useRef(null);
    let [messages, setMessages] = useState([])
    let [inputValue, setinputValue] = useState("")
    let [messageLoading, setmessageLoading] = useState(true)
    const containerRef = useRef(null);
    function name(s) {
        let item1 = activeChat.members[0]
        let item2 = activeChat.members[1]
        if (item1.id == user.id) {
            return item2.username
        } else if (item2.id == user.id) { return item1.username }
        else return null
    }
    function changeValue(e) {
        setinputValue(e.target.value)
    }
    function send() {
        if (!messageLoading) {
            let date = new Date()
            socket.emit('message', {
                sender: user,
                text: inputValue,
                room: params.chatid[0],
                date: date
            });
        }
    }
    async function getMessages() {
        let accessToken = getCookie('accessToken');
        let response = await fetch(`http://localhost:3001/chat/chats/${params.chatid[0]}/messages`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        let data = await response.json()
        setMessages(data)
        setmessageLoading(false)
    }
    useEffect(() => {
        // console.log(user)
        if (params.chatid) {
            if (!initialized.current) {
                initialized.current = true
                getMessages()
                socket.emit('join', {
                    id: params.chatid[0]
                })
                socket.on('chat', function (data) {
                    setMessages((prevChat) => [...prevChat, data]);
                });
            }
        }
    }, [])
    useEffect(() => {
        if (params.chatid) {
            const textarea = textareaRef.current;
            const adjustHeight = () => {
                textarea.style.height = '45px';
                textarea.style.height = `${Math.min(textarea.scrollHeight, parseInt(window.getComputedStyle(textarea).maxHeight))}px`;
            };
            textarea.addEventListener('input', adjustHeight);
            adjustHeight();
            return () => {
                textarea.removeEventListener('input', adjustHeight);
            };
        }
    }, []);
    return (
        <>
            {params.chatid ?
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
                        <div className={styles.topContainer}>
                            <div className={styles.topImageContainer}>
                                {/* <img src="pxfuel.jpg"></img> */}
                            </div>
                            <div className={styles.topNameContainer}>
                                <label>
                                    {activeChat.members ?
                                        <>
                                            {name()}
                                        </>
                                        :
                                        <></>
                                    }
                                </label>
                            </div>

                        </div>
                    </div>
                    <div className={styles.MessagesContainer}>
                        <div className={styles.messageListContainer} ref={containerRef}>
                            <div className={styles.messageList}>
                                {loading && messageLoading && user.id ?
                                    <></> :
                                    <>
                                        {messages.map((data) => (
                                            <Bubble data={data} user={user} key={data.id} />
                                        ))}
                                        <Scroll />
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={styles.MessageInputContainer}>
                        <div className={styles.InputContainer}>
                            <textarea ref={textareaRef} value={inputValue} onChange={changeValue} placeholder="message" />
                            <div className={styles.SendContainer}>
                                <button onClick={send}>
                                    <SendLogo />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                :

                <></>

            }
        </>
    )
}
function SendLogo() {
    return (
        <svg width="16" viewBox="0 0 674 648" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M51.1324 3.49524L653.17 291.426C670.964 299.936 678.49 321.26 669.98 339.054C666.46 346.413 660.528 352.345 653.17 355.864L51.1324 643.795C33.3383 652.305 12.0144 644.779 3.50416 626.985C-0.193951 619.253 -0.98785 610.448 1.2674 602.179L61.4831 381.381C62.9917 375.85 67.6613 371.756 73.3427 370.984L365.074 331.357C367.588 330.998 369.671 329.345 370.634 327.09L371.135 325.296C371.613 321.949 369.688 318.812 366.669 317.633L365.074 317.215L73.684 277.588C68.0034 276.816 63.3348 272.722 61.8266 267.191L1.2674 45.1114C-3.92245 26.0819 7.29676 6.44831 26.3262 1.25847C34.5954 -0.99678 43.3999 -0.202874 51.1324 3.49524Z" />
        </svg>
    )
}