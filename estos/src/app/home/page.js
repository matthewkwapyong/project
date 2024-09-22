'use client'

import styles from "./style.module.css";
import { Drop, Item } from '../../../Components/drop';
import Main from "./main";
import { useState, useRef, useEffect } from 'react';
import { setCookie, getCookie } from 'cookies-next';
function Chat({ selectChat, user, data, active, key }) {
    let itemRef = useRef(null)
    function name() {
        let item1 = data.members[0]
        let item2 = data.members[1]
        if (item1.id == user.id) {
            return item2.username
        } else if (item2.id == user.id) { return item1.username }
        else return null
    }
    useEffect(() => {

    })
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
        <div className={styles.chatItem}
            key={key}
            ref={itemRef}
            onClick={()=> selectChat(data)}
            style={active ?
                { backdropFilter: "blur(3px)", backgroundColor: "#9191914a" } :
                {}
            }
        >
            <div className={styles.chatImage}>
                <div>
                    <img src={'/pxfuel.jpg'}></img>
                </div>
            </div>
            <div className={styles.chatInfo}>
                <div className={styles.nameTime}>
                    <div id={styles.name}>
                        <label>{name()}</label>
                    </div>
                    <div id={styles.time}>
                        <label></label>
                    </div>
                </div>
                <div id={styles.recent_message}>
                    <label></label>
                </div>
            </div>
        </div >
    )
}


export default function Page() {
    let [user, setUser] = useState({})
    let [userChats, setuserChats] = useState([])
    let [activeChat, setactiveChat] = useState({})
    async function getChats() {
        let accessToken = getCookie('accessToken');
        // console.log(accessToken)
        let result = await fetch(`http://localhost:3001/chat/chats`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
        })
        let data = await result.json();
        setuserChats(data)
    }
    async function getUser() {
        let result = await fetch('http://localhost:3001/user', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MTd9.IBKlV5o8Zh-emoKef4mzXSD9jBbZpVauN4Zwyh17SfY'
            }
        })
        let data = await result.json()
        setUser(data)
    }
    async function selectChat(chat) {
        setactiveChat(chat)
    }
    useEffect(() => {
        getUser();
        getChats();
    }, [])
    return (
        <div className={styles.Block}>
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
            <div className={styles.Side_bar}>
                <div className={styles.mainside}>

                </div>
                <div className={styles.sideContainer}>
                    <div id={styles.top}>
                        <div className={styles.logoContainer}>
                            <div>
                                <svg viewBox="0 0 24 24" fill="white" preserveAspectRatio="xMidYMid meet" focusable="false"  ><g ><path d="M21,6H3V5h18V6z M21,11H3v1h18V11z M21,17H3v1h18V17z" ></path></g></svg>
                            </div>
                        </div>
                    </div>
                    <div className={styles.chatListContainer}>
                        <div className={styles.chatList}>
                            {userChats.map((data) => (
                                <Chat user={user} data={data} key={data.id} selectChat={selectChat} />
                            ))}
                            {/* <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} /> */}
                        </div>

                    </div>
                </div>
            </div>

            <main className={styles.Main}>
                <Main activeChat={activeChat}/>
                {/* <Drop>
                    <Item onClick={() => { console.log("hello") }}>
                        hello
                    </Item>
                    <Item onClick={() => { console.log("hello") }}>
                        hello
                    </Item>
                    <Item onClick={() => { console.log("hello") }}>
                        hello
                    </Item>
                    <Item onClick={() => { console.log("hello") }}>
                        hello
                    </Item>
                    <Item onClick={() => { console.log("hello") }}>
                        hello
                    </Item>
                    <Item onClick={() => { console.log("hello") }}>
                        hello
                    </Item>
                    <Item onClick={() => { console.log("hello") }}>
                        hello
                    </Item>
                    <Item onClick={() => { console.log("hello") }}>
                        hello
                    </Item>
                    <Item onClick={() => { console.log("hello") }}>
                        hello
                    </Item>
                    <Item onClick={() => { console.log("hello") }}>
                        hello
                    </Item>
                </Drop> */}
            </main>
        </div>
    );
}
