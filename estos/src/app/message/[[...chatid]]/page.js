'use client'
import styles from "./style.module.css";
import { Drop, Item } from '../../../../Components/drop';
import { useState, useRef, useEffect } from 'react';
import socket from "../../socket";
import { getCookie } from 'cookies-next';
import { useMessageContext } from '../context'
import Delete from '../../../../Components/delete'
import EditMessageContainer from "../../../../Components/editmessage";
function Bubble({ data, user, setContextItem }) {
    let itemRef = useRef(null)
    function format_date(date) {
        let d = new Date(date)
        let str = `${d.getHours()}:${d.getMinutes()}`
        return str
    }
    useEffect(() => {
    }, [])
    useEffect(() => {
        const contextMen = document.getElementById("bubble_dropdown_content");
        itemRef.current.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            setContextItem(data)
            const x = e.clientX;
            const y = e.clientY;

            // Calculate the maximum allowable x and y positions to keep the context menu within the window
            const maxX = window.innerWidth - contextMen.offsetWidth;
            const maxY = window.innerHeight - contextMen.offsetHeight;

            const posX = Math.min(x, maxX);
            const posY = Math.min(y, maxY);

            // Ensure the context menu stays within the window boundaries
            contextMen.style.left = `${posX - 20}px`;
            contextMen.style.top = `${posY}px`;
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
            {data.sender == user?.user?.id ?
                <div className={styles.mainContainer + " " + styles.sendContainer} >
                    <div id={styles.bubble} ref={itemRef} >
                        <div id={styles.text} style={{ background: "#0058c0" }}>
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
    const { user, loading, activeChat, add_messages, allMessagesRef, append_message_room } = useMessageContext()
    let [messages, setMessages] = useState([])
    let [inputValue, setinputValue] = useState("")
    let [messageLoading, setmessageLoading] = useState(true)
    let [contextItem, setContextItem] = useState()
    let [showdel, setshowdel] = useState(false)
    let [showeditMessage, setshowEditMessage] = useState(false)
    let [showNotification, setshowNotification] = useState(false)
    let [notificationMessage, setnotificationMessage] = useState("")
    let [typing, setTyping] = useState(false)
    let textareaRef = useRef(null);
    let initialized = useRef(false)
    let notiRef = useRef(null)
    let messagesRef = useRef(messages)
    let shouldScrollRef = useRef(true);
    let typingTimeout = useRef(null)
    let containerRef = useRef(null);
    let userRef = useRef(user);
    let activeChatRef = useRef(activeChat);
    function changeValue(e) {
        socket.emit('typing', { room: activeChat.chat.id.toString(), user: userRef.current });
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            socket.emit('stoptyping', { room: activeChat.chat.id.toString(), user: userRef.current });
        }, 4000)
        setinputValue(e.target.value)
    }
    function send() {
        if (!messageLoading) {
            if (inputValue.length == 0) return;
            let date = new Date()
            socket.emit('message', {
                sender: user,
                text: inputValue,
                room: params.chatid[0],
                date: date
            });
            setinputValue("")
        }
    }
    async function getMessages() {
        if (Object.keys(allMessagesRef.current).includes(params.chatid[0])) {
            setMessages(allMessagesRef.current[params.chatid[0]])
            setmessageLoading(false)
            shouldScrollRef.current = true;
            return
        }
        let accessToken = getCookie('accessToken');
        let response = await fetch(`/api/chat/chats/${params.chatid[0]}/messages`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`

            }
        })
        let data = await response.json()
        setMessages(data)
        setmessageLoading(false)
        add_messages(params.chatid[0], data)
        shouldScrollRef.current = true;
    }
    function contextmenu(data) {
        setContextItem(data)
    }
    function removeMessage(id) {
        shouldScrollRef.current = false;
        const updatedItems = messages.filter(item => item.id !== id);
        setMessages(updatedItems);
        setshowdel(false)
    }
    function EditMessage(contextItem, body) {
        let data = {
            id: contextItem.id,
            chatid: contextItem.chat_id,
            body,
            userid: user?.user?.id
        }
        socket.emit('editmessage', data)
        setshowEditMessage(false)
        // console.log(contextItem,body)
    }
    function setNotification(message) {
        clearTimeout(notiRef.current)
        setshowNotification(true)
        setnotificationMessage(message)
        notiRef.current = setTimeout(() => {
            setshowNotification(false)
            setnotificationMessage("")
        }, 5000);
    }
    useEffect(() => {
        messagesRef.current = messages
        if (containerRef.current && shouldScrollRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);
    useEffect(() => {
        userRef.current = user;
    }, [user])
    useEffect(() => {
        activeChatRef.current = activeChat.chat;
    }, [activeChat])

    useEffect(() => {
        // console.log(user)
        function chat(data) {
            if (data.added && data.data.chat_id == params.chatid[0]) {
                setMessages((prevChat) => [...prevChat, data.data]);
                append_message_room(params.chatid[0], data.data)
                shouldScrollRef.current = true;
            }
        }
        function stoptyping(data) {
            if (data.room == activeChatRef.current.id && data.user?.user?.id != userRef.current.id) {
                setTyping(false)
            }
        }
        function deletemessage(data) {
            //1 delete from sender only
            //2 completely delete the message
            //3 the receiver deletes the message
            shouldScrollRef.current = false;
            if (data.type == 3) {
                if (data.userid == userRef.current.id) {
                    const updatedItems = messagesRef.current.filter(item => item.id != data.id);
                    setMessages(updatedItems);
                    setshowdel(false)
                }
            } else if (data.type == 2) {
                const updatedItems = messagesRef.current.filter(item => item.id != data.id);
                setMessages(updatedItems);
                setshowdel(false)
            } else if (data.type == 1) {
                if (data.userid == userRef.current.id) {
                    const updatedItems = messagesRef.current.filter(item => item.id != data.id);
                    setMessages(updatedItems);
                    setshowdel(false)
                }
            }
        }
        function messageEdit(data) {
            console.log("message edit")
            shouldScrollRef.current = false;
            if (data.status) {
                // if (data.userid == userRef.current.id) {
                const updatedItems = messagesRef.current.map(item => {
                    if (item.id == data.id) {
                        item.body = data.body
                        return item
                    }
                    return item
                });
                setMessages(updatedItems);

                // }
            } else {
                setNotification("Error: Message Not Edited")
            }
            console.log(data)
        }
        if (params.chatid) {
            if (!initialized.current) {
                initialized.current = true
                getMessages()
                function istyping(data) {
                    console.log("hello")
                    if (data.room == activeChatRef.current.id && data.user?.user?.id != userRef.current.id) {
                        setTyping(true)
                    }
                }
                if (!Object.keys(allMessagesRef.current).includes(params.chatid[0])) {
                    socket.emit('join', {
                        id: params.chatid[0]
                    })
                    socket.on('chat', chat);
                    socket.on('typing', istyping)
                    socket.on('stoptyping', stoptyping)
                    socket.on('deletemessage', deletemessage)
                    socket.on('editedmessage', messageEdit)
                }
            }
        }
        return () => {
            // socket.off('chat', chat);
            // // socket.off('typing', istyping)
            // socket.off('stoptyping', stoptyping)
            // socket.off('deletemessage', deletemessage)
            // socket.off('editedmessage', messageEdit)
        };
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
                    <div className="dropdown_content" id="bubble_dropdown_content">
                        <div className="drop">
                            {contextItem?.sender === user?.user?.id ? <>
                                <Item onClick={() => { setshowEditMessage(true) }}>
                                    edit
                                </Item>
                                <Item onClick={() => { setshowdel(true) }}>
                                    Delete
                                </Item>
                            </> : <>
                                <Item onClick={() => { setshowdel(true) }}>
                                    Delete for me
                                </Item>
                            </>}
                        </div>
                    </div>
                    {showdel ?
                        <Delete removeMessage={removeMessage} contextItem={contextItem} cancel={() => setshowdel(false)} owner={contextItem?.sender === user?.user?.id} user_id={user?.user?.id} />
                        :
                        <></>
                    }
                    {showeditMessage ?
                        <EditMessageContainer Edit={EditMessage} contextItem={contextItem} cancel={() => setshowEditMessage(false)} owner={contextItem?.sender === user?.user?.id} user_id={user?.user?.id} />
                        :
                        <></>
                    }
                    <div className={styles.Header}>
                        <div className={styles.topContainer}>
                            <div className={styles.topImageContainer}>
                                {/* <img src="pxfuel.jpg"></img> */}
                            </div>
                            <div className={styles.topNameContainer}>
                                <label>
                                    {activeChat.members ?
                                        <>
                                            {activeChat.chat.name}
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
                                {loading && messageLoading && user?.user?.id ?
                                    <></> :
                                    <>
                                        {messages.map((data) => (
                                            <Bubble data={data} user={user} key={data.id} setContextItem={contextmenu} />
                                        ))}
                                        {/* <Scroll /> */}
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={styles.typingContainer}>
                        {typing ?
                            <div style={{ width: "65px" }}>
                                <div id={styles.animationCont}>
                                    <div id={styles.ani1}></div>
                                    <div id={styles.ani2}></div>
                                    <div id={styles.ani3}></div>
                                </div>
                            </div>
                            :
                            <div style={{ width: "65px" }}></div>
                        }
                        <div className={styles.notificationContainer}>
                            <div style={showNotification ? { display: "flex" } : { display: "none" }}>
                                <label>
                                    {notificationMessage}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.MessageInputContainer}>
                        <div className={styles.InputContainer}>
                            <textarea ref={textareaRef} value={inputValue} onChange={changeValue} placeholder="message" style={{ height: "45px" }} />
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