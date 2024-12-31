'use client'

import styles from "./style.module.css";
import searcha from './search.module.css'
import { Drop, Item } from '../../../../Components/drop';
import Main from "./page";
import { useState, useRef, useEffect } from 'react';
import { setCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'
import Link from "next/link";

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
    }, [])
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
        <Link href={`/message/${data.chat.id}`}>
        <div className={styles.chatItem}
            key={key}
            ref={itemRef}
            onClick={() => selectChat(data)}
            style={active ?
                { backdropFilter: "blur(3px)", backgroundColor: "#9191914a" } :
                {}
            }
        >
            <div className={styles.chatImage}>
                <div>
                    {/* <img src={'/pxfuel.jpg'}></img> */}
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
        </Link>
    )
}
function Chat2({ data, key }) {
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
        <div className={searcha.chatItem}
            key={key}
            ref={itemRef}          
        >
            <div className={searcha.chatImage}>
                <div>
                    {/* <img src={'/pxfuel.jpg'}></img> */}
                </div>
            </div>
            <div className={searcha.chatInfo}>
                <div className={searcha.nameTime}>
                    <div id={searcha.name}>
                        <label>{data.username}</label>
                    </div>
                    <div id={searcha.time}>
                        <label></label>
                    </div>
                </div>
                <div id={searcha.recent_message}>
                    <label></label>
                </div>
            </div>
        </div >
    )
}


export default function Page({params}) {
    const router = useRouter()
    let [user, setUser] = useState(null)
    let [loading, setloading] = useState(true)
    let [userChats, setuserChats] = useState([])
    let [activeChat, setactiveChat] = useState({})
    let [searchValue, setsearchValue] = useState("")
    let [searchData, setsearchData] = useState([])
    let [searching, setsearching] = useState(false)
    // const params = useParams()
    async function search(e) {
        setsearchValue(e.target.value)
        let accessToken = getCookie('accessToken');
        if (e.target.value.length > 0) {
            let result = await fetch(`https://project-8w7l.onrender.com/search/${e.target.value}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
            })
            let data = await result.json();
            setsearchData(data)
        }
        // setuserChats(data)
    }

    async function getChats() {
        let accessToken = getCookie('accessToken');
        // console.log(accessToken)
        let result = await fetch(`https://project-8w7l.onrender.com/chat/chats`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
        })
        let data = await result.json();
        setuserChats(data)
    }
    async function getUser() {
        let accessToken = getCookie('accessToken');
        let result = await fetch('https://project-8w7l.onrender.com/user', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        let data = await result.json()
        setUser(data)
        setloading(false)
    }
    async function selectChat(chat) {
        router.push(`/message/${chat.chat.id}`,undefined,{ shallow: true })
        console.log(chat.chat.id)
        // setactiveChat(chat)
    }
   
    useEffect(() => {
        console.log(params)
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
                    <div>
                        <button onClick={()=> router.push('/message/31')}>
                            m
                        </button>
                        <button>
                            s
                        </button>
                    </div>
                </div>
                <div className={styles.sideContainer}>
                    <div id={styles.top}>
                        <div className={styles.logoContainer}>
                            <input onChange={search} value={searchValue}></input>
                            {/* <div>
                                <svg viewBox="0 0 24 24" fill="white" preserveAspectRatio="xMidYMid meet" focusable="false"  ><g ><path d="M21,6H3V5h18V6z M21,11H3v1h18V11z M21,17H3v1h18V17z" ></path></g></svg>
                            </div> */}
                        </div>
                    </div>
                    <div className={styles.chatListContainer}>
                        {searching ?
                            <div className={searcha.chatList}>
                                {searchData.map((data) => (
                                    <Chat2 user={user} data={data} key={data.id} selectChat={selectChat} />
                                ))}
                            </div>
                            :
                            <div className={styles.chatList}>
                                {userChats.map((data) => (
                                    <Chat user={user} data={data} key={data.id} selectChat={selectChat} />
                                ))}
                                {/* <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} /> */}
                            </div>
                        }

                    </div>
                </div>
            </div>

            <main className={styles.Main}>
                <Main activeChat={activeChat} user={user} />
                {/* {loading ?
                    <></> :
                } */}
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
