'use client'
import styles from "../src/app/message/[[...slug]]/style.module.css";
import { Drop, Item } from './drop';
import { useState, useRef, useEffect } from 'react';
// import socket from "../../socket";
import { setCookie, getCookie } from 'cookies-next';

function Bubble({ data, user }) {
    let itemRef = useRef(null)
    function format_date(date) {
        let d = new Date(date)
        let str = `${d.getHours()}:${d.getMinutes()}`
        return str
    }
    useEffect(() => {
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
                <div className={styles.mainContainer + " " + styles.sendContainer}>
                    <div id={styles.bubble} ref={itemRef}>
                        <div id={styles.text}>
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



export default function Main({ activeChat, user }) {
    const textareaRef = useRef(null);
    let itemRef = useRef(null)
    let [chat, setChat] = useState([])
    let [inputValue, setinputValue] = useState("")
    function name() {
        if (Object.keys(activeChat).length !== 0) {
            let item1 = activeChat.members[0]
            let item2 = activeChat.members[1]
            if (item1.id == user.id) {
                return item2.username
            } else if (item2.id == user.id) { return item1.username }
            else return null

        }
    }
    function changet(e) {
        setinputValue(e.target.value)
    }
    function send() {
        // console.log(activeChat)
        let date = new Date()
        socket.emit('message', {
            sender: user,
            text: inputValue,
            room: activeChat.chat.id,
            date: date
        });
    }
    async function get_chats() {
        console.log("keee")
        let accessToken = getCookie('accessToken');
        let r = await fetch(`http://localhost:3001/chats/${activeChat.chat.id}/messages`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        let dat = await r.json()
        console.log(dat,"Ddddddddddddddd")
        setChat(dat)
    }
    useEffect(() => {
        if (Object.keys(activeChat).length !== 0) {
            socket.emit('join', {
                id: activeChat.chat.id
            })
            socket.on('chat', function (data) {
                // console.log(data)
                setChat((prevChat) => [...prevChat, data]);
            });
        }
    }, [activeChat])
    useEffect(() => {
        get_chats()
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
                <div className={styles.topContainer}>
                    <div className={styles.topImageContainer}>
                        <img src="pxfuel.jpg"></img>
                    </div>
                    <div className={styles.topNameContainer}>
                        <label>
                            {name()}
                        </label>
                    </div>

                </div>
            </div>
            <div className={styles.MessagesContainer}>
                <div className={styles.messageListContainer}>
                    <div className={styles.messageList}>
                        {chat.map((data) => (
                            <Bubble data={data} user={user} key={data.id}/>
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
                            <SendLogo />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
function SendLogo() {
    return (
        <svg width="16" viewBox="0 0 674 648" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M51.1324 3.49524L653.17 291.426C670.964 299.936 678.49 321.26 669.98 339.054C666.46 346.413 660.528 352.345 653.17 355.864L51.1324 643.795C33.3383 652.305 12.0144 644.779 3.50416 626.985C-0.193951 619.253 -0.98785 610.448 1.2674 602.179L61.4831 381.381C62.9917 375.85 67.6613 371.756 73.3427 370.984L365.074 331.357C367.588 330.998 369.671 329.345 370.634 327.09L371.135 325.296C371.613 321.949 369.688 318.812 366.669 317.633L365.074 317.215L73.684 277.588C68.0034 276.816 63.3348 272.722 61.8266 267.191L1.2674 45.1114C-3.92245 26.0819 7.29676 6.44831 26.3262 1.25847C34.5954 -0.99678 43.3999 -0.202874 51.1324 3.49524Z" />
        </svg>
    )
}