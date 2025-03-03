'use client'
import styles from "./style.module.css";
import NewChat from "../../../../Components/newChat";
import { Item } from '../../../../Components/drop';
import { useState, useRef, useEffect } from 'react';
import { setCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'
import { useMessageContext } from "../context";
import { useParams } from "next/navigation";
import socket from "@/app/socket";
function Chat({ selectChat, user, data, active, whotyping }) {
    let itemRef = useRef(null)
    let [typing, setTyping] = useState(false)
    let time = useRef(null)
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
    useEffect(() => {
        if (whotyping?.includes(data.chat.id.toString())) {
            setTyping(true)
        } else {
            setTyping(false)
        }
    }, [whotyping])
    return (
        <div className={styles.chatItem}
            ref={itemRef}
            onClick={() => selectChat(data)}
            style={active ?
                { backgroundColor: "#91919112" } :
                { backgroundColor: "" }
            }
        >
            <div className={styles.activeContainer}>
                <div style={data.new ?
                    { display: "block" } :
                    { display: "none" }
                }>
                </div>
            </div>
            <div className={styles.chatImage}>
                <div >
                    {/* <img src={'/pxfuel.jpg'}></img> */}
                </div>
            </div>
            <div className={styles.chatInfo}>
                <div className={styles.nameTime}>
                    <div id={styles.name}>
                        <label>{data.chat.name}</label>
                    </div>
                    <div id={styles.time}>
                        <label></label>
                    </div>
                </div>
                <div id={styles.recent_message}>
                    {/* {data.new ?
                        <label style={{ color: "#fff" }}>New Message</label>
                        :
                        <></>
                    } */}
                </div>
                <div className={styles.typingC} style={typing ?
                    { display: "block" } :
                    { display: "none" }
                }>
                    <label>
                        typing
                    </label>
                </div>
            </div>
        </div >
    )
}
export default function Side() {
    const initialized = useRef(false)
    const router = useRouter()
    const params = useParams()
    let [chatLoading, setchatLoading] = useState(true)
    let [userChats, setuserChats] = useState([])
    let userChatsref = useRef(userChats)
    let userChatsreff = useRef(userChats)
    let paramRef = useRef(params)
    let [searchValue, setsearchValue] = useState("")
    let [searching, setsearching] = useState(false)
    let [localSearch, setlocalSearch] = useState(false)
    let [whotyping, setwhotyping] = useState([])
    let whotypingref = useRef(whotyping)
    let { activeChat, setactiveChat, loading, user } = useMessageContext()
    function name(data) {
        let item1 = data.members[0]
        let item2 = data.members[1]
        if (item1.id == user.id) {
            return item2.username
        } else if (item2.id == user.id) { return item1.username }
        else return null
    }
    function updateChatlist(data) {
        setuserChats((prevChat) => [data.chat_info, ...prevChat]);
        router.push(`/message/${data.chat_info.chat.id}`, undefined, { shallow: true })
        setsearching(false)
    }
    function search(e) {
        let temp = []
        setsearchValue(e.target.value)
        setlocalSearch(true)
        if (e.target.value.length === 0) {
            setlocalSearch(false)
            setuserChats(userChatsref.current)
        }
        if (userChatsref.current.length === 0) userChatsref.current = userChats
        for (let i of userChatsref.current) {
            let chatname = name(i)
            if (chatname.startsWith(e.target.value)) {
                temp.push(i)
            }
        }
        setuserChats(temp)
    }
    async function getChats() {
        let accessToken = getCookie('accessToken');
        // console.log(accessToken)
        let response = await fetch(`/api/chat/chats`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
        })
        let data = await response.json();
        setuserChats(data)
        setchatLoading(false)
    }
    async function selectChat(chat) {
        router.push(`/message/${chat.chat.id}`, undefined, { shallow: true })
    }
    async function newChat() {
        setsearching(true)
    }
    useEffect(() => {
        paramRef.current = params
        for (let index = 0; index < userChatsreff.current.length; index++) {
            if (userChatsreff.current[index].chat.id == params.chatid) {
                let chat = userChatsreff.current[index]
                userChatsreff.current[index] = { ...chat, new: false }
            }
        }
    }, [params])
    useEffect(() => {
        if (params.chatid) {
            for (let i of userChats) {
                if (i.chat.id == params.chatid[0]) {
                    let members = i.members
                    let item1 = members[0]
                    let item2 = members[1]
                    // console.log(i)
                    // console.log(user)
                    if (item1.id == user?.user?.id) {
                        setactiveChat(i)
                    } else if (item2.id == user?.user?.id) {
                        setactiveChat(i)
                    }
                }
            }
        }
    })
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            function eventstopTyping(data) {
                let arr = whotyping.filter(item => {
                    return item !== data
                })
                setwhotyping(arr);
            }
            function eventTyping(data) {
                if (!whotyping.includes(data)) {
                    setwhotyping((prevwhotyping) => {
                        const new_whotyping = [data, ...prevwhotyping];
                        return new_whotyping;
                    });
                }
            }
            function newmessage(data) {
                for (let index = 0; index < userChatsreff.current.length; index++) {
                    if (userChatsreff.current[index].chat.id == data.data.chat_id) {
                        let chat = userChatsreff.current[index]
                        userChatsreff.current.splice(index, 1);
                        if (chat.chat.id == paramRef.current.chatid[0]) {
                            setuserChats([{ ...chat }, ...userChatsreff.current])
                            return;
                        }
                        setuserChats([{ ...chat, new: true }, ...userChatsreff.current])
                    }
                }
            }
            socket.on('newmessage', newmessage)
            socket.on('eventstopTyping', eventstopTyping)
            socket.on('eventTyping', eventTyping)
        }
        getChats();
    }, [])
    useEffect(() => {
        whotypingref.current = whotyping;
    }, [whotyping])
    useEffect(() => {
        userChatsreff.current = userChats;
    }, [userChats])
    useEffect(() => {
        socket.emit("conn", user)
    }, [user])
    return (
        <>
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
            {searching ?
                <NewChat setsearching={setsearching} updateChatlist={updateChatlist} />
                :
                <></>
            }
            <div className={styles.Side_bar}>
                <div className={styles.mainside}>
                    <div>
                        <button>
                            s
                        </button>
                    </div>
                </div>
                <div className={styles.sideContainer}>

                    <div id={styles.top}>
                        <div className={styles.logoContainer}>
                            <div id={styles.messagesTitle}>
                                <label>Messages</label>
                            </div>
                            <button onClick={newChat} className={styles.createChat}>
                                <div>
                                    <NewMessageLogo />
                                </div>
                            </button>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", height: "60px" }}>
                            <div className={styles.search}>
                                <div id={styles.search_logo}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="168" height="168" viewBox="0 0 168 168" fill="#757575">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M102.197 107.911C102.673 107.311 103.248 106.796 103.896 106.387C113.021 97.8352 118.878 86.3678 120.457 73.961C122.036 61.5541 119.239 48.9849 112.546 38.4196C105.854 27.8544 95.6863 19.9549 83.7956 16.0827C71.9049 12.2104 59.036 12.608 47.4069 17.2068C35.7778 21.8056 26.117 30.3177 20.0894 41.2759C14.0618 52.2341 12.045 64.952 14.3867 77.2377C16.7284 89.5235 23.2818 100.607 32.9174 108.579C42.5531 116.551 54.6675 120.912 67.1726 120.909C80.5602 120.899 92.7944 116.007 102.197 107.911ZM117.253 111.928L165.726 156.247C166.395 156.837 166.94 157.555 167.329 158.358C167.718 159.161 167.942 160.033 167.99 160.924C168.038 161.815 167.908 162.707 167.607 163.547C167.307 164.387 166.842 165.159 166.24 165.817C165.638 166.476 164.91 167.007 164.101 167.381C163.291 167.755 162.414 167.964 161.523 167.996C160.631 168.027 159.742 167.881 158.908 167.565C158.074 167.249 157.311 166.77 156.664 166.156L107.305 121.033C93.491 131.331 76.2489 135.926 59.1435 133.868C42.038 131.81 26.3773 123.257 15.3996 109.976C4.42184 96.6957 -1.03335 79.7038 0.161954 62.514C1.35726 45.3242 9.11165 29.2511 21.8217 17.6182C34.5318 5.98532 51.2256 -0.317734 68.4512 0.0123388C85.6768 0.342411 102.117 7.28037 114.372 19.3916C126.627 31.5029 133.761 47.8613 134.297 65.0842C134.833 82.3072 128.731 99.0776 117.253 111.928V111.928Z" />
                                    </svg>
                                </div>
                                <input placeholder="Search people" onChange={search} value={searchValue} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.chatListContainer}>
                        {chatLoading ?
                            <></>
                            :
                            <div>
                                {userChats.map((data) => (
                                    <Chat user={user} data={data} selectChat={selectChat} key={data.chat.id} active={data.chat.id == params.chatid} whotyping={whotyping} />
                                ))}
                            </div>
                        }

                    </div>
                </div>
            </div>
        </>
    );
}


function NewMessageLogo() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="240" height="175" viewBox="0 0 240 175" fill="none">
            <path d="M239.721 156.5C239.721 170.9 227.388 174.833 221.221 175H18.2209C12.3875 174 0.620849 168.9 0.220855 156.5C-0.179139 144.1 0.0541986 59 0.220855 18C1.22086 12 6.52087 0 19.7209 0H150.221C163.221 0 163.221 15.5 150.221 15.5H15.2186L21 19.5C21.6634 19.8317 29.0431 24.2335 39.821 30.6625C61.5389 43.6169 97.0547 64.8018 119.221 77.5L154.5 56.5C171 46 177 61.2 166.5 67.5C164.028 68.9833 160.115 71.3774 155.467 74.2213C144.371 81.0103 129.088 90.3618 119.221 96L15.2186 31L15.7209 154.5C16.2209 156.333 18.1208 160 21.7209 160H217.221C219.388 159.667 223.721 158 223.721 154V83C223.721 76.2697 239.721 73.5 239.721 84.5V156.5Z" fill="white" />
            <path d="M192.5 8C192.5 3.58179 196.082 0 200.5 0C204.918 0 208.5 3.58179 208.5 8V31.5H232C236.418 31.5 240 35.0818 240 39.5C240 43.9182 236.418 47.5 232 47.5H208.5V71C208.5 75.4182 204.918 79 200.5 79C196.082 79 192.5 75.4182 192.5 71V47.5H169C164.582 47.5 161 43.9182 161 39.5C161 35.0818 164.582 31.5 169 31.5H192.5V8Z" fill="white" />
        </svg>
    )
}