'use client'
import { useState, useRef, useEffect } from 'react';
import styles from '@/app/message/[[...chatid]]/newChat.module.css'
import {getCookie } from 'cookies-next';
export default function NewChat({ setsearching, updateChatlist }) {
    let [usersearchValue, setusersearchValue] = useState("")
    let [searchData, setsearchData] = useState([])
    let inputRef = useRef(null)
    useEffect(() => {
        inputRef.current.focus()
    }, [])
    async function usersearch(e) {
        setusersearchValue(e.target.value)
        let accessToken = getCookie('accessToken');
        if (e.target.value.length > 0) {
            let result = await fetch(`/api/search/${e.target.value}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
            })
            let data = await result.json();
            setsearchData(data)
        } else {
            setsearchData([])
        }
    }
    return (
        <div className={styles.searchContainer}>
            <div>
                <div className={styles.title}>
                    <button onClick={() => setsearching(false)}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 112 120" fill="white">
                                <path d="M43.4465 61.7336C44.5306 60.5792 44.5306 58.7808 43.4465 57.6264L1.92687 13.4119C0.843413 12.2582 0.842672 10.4612 1.92518 9.30648L8.45958 2.33645C9.64547 1.0715 11.6536 1.07233 12.8385 2.33826L53.7597 46.0598C54.9452 47.3265 56.9548 47.3265 58.1403 46.0598L99.0615 2.33826C100.246 1.07233 102.255 1.0715 103.44 2.33645L109.975 9.30648C111.057 10.4612 111.057 12.2582 109.973 13.4119L68.4535 57.6264C67.3694 58.7808 67.3694 60.5792 68.4535 61.7336L109.973 105.948C111.057 107.102 111.057 108.899 109.975 110.054L103.44 117.024C102.255 118.288 100.246 118.288 99.0615 117.022L58.1403 73.3002C56.9548 72.0335 54.9452 72.0335 53.7597 73.3002L12.8385 117.022C11.6536 118.288 9.64547 118.288 8.45958 117.024L1.92518 110.054C0.842673 108.899 0.843415 107.102 1.92687 105.948L43.4465 61.7336Z" fill="white" />
                            </svg>
                        </div>
                    </button>
                    <div>
                        <label>New message</label>

                    </div>
                </div>
                <div className={styles.top}>
                    <div className={styles.search}>
                        <div id={styles.search_logo}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="168" height="168" viewBox="0 0 168 168" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M102.197 107.911C102.673 107.311 103.248 106.796 103.896 106.387C113.021 97.8352 118.878 86.3678 120.457 73.961C122.036 61.5541 119.239 48.9849 112.546 38.4196C105.854 27.8544 95.6863 19.9549 83.7956 16.0827C71.9049 12.2104 59.036 12.608 47.4069 17.2068C35.7778 21.8056 26.117 30.3177 20.0894 41.2759C14.0618 52.2341 12.045 64.952 14.3867 77.2377C16.7284 89.5235 23.2818 100.607 32.9174 108.579C42.5531 116.551 54.6675 120.912 67.1726 120.909C80.5602 120.899 92.7944 116.007 102.197 107.911ZM117.253 111.928L165.726 156.247C166.395 156.837 166.94 157.555 167.329 158.358C167.718 159.161 167.942 160.033 167.99 160.924C168.038 161.815 167.908 162.707 167.607 163.547C167.307 164.387 166.842 165.159 166.24 165.817C165.638 166.476 164.91 167.007 164.101 167.381C163.291 167.755 162.414 167.964 161.523 167.996C160.631 168.027 159.742 167.881 158.908 167.565C158.074 167.249 157.311 166.77 156.664 166.156L107.305 121.033C93.491 131.331 76.2489 135.926 59.1435 133.868C42.038 131.81 26.3773 123.257 15.3996 109.976C4.42184 96.6957 -1.03335 79.7038 0.161954 62.514C1.35726 45.3242 9.11165 29.2511 21.8217 17.6182C34.5318 5.98532 51.2256 -0.317734 68.4512 0.0123388C85.6768 0.342411 102.117 7.28037 114.372 19.3916C126.627 31.5029 133.761 47.8613 134.297 65.0842C134.833 82.3072 128.731 99.0776 117.253 111.928V111.928Z" fill="white" />
                            </svg>
                        </div>
                        <input ref={inputRef} placeholder="Search people" onChange={usersearch} value={usersearchValue} />
                    </div>
                </div>
                <div className={styles.chatListContainer}>
                    <div>
                        {searchData.map((data) => (
                            <Item updateChatlist={updateChatlist} data={data} key={data.id} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}


function Item({ data, updateChatlist }) {
    let itemRef = useRef(null)
    async function create() {
        let accessToken = getCookie('accessToken');
        let response = await fetch(`/api/chat/create`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ receiver: data.id })

        })
        let result = await response.json();
        if (!result.exists) {
            updateChatlist(result)
        }
    }
    return (
        <div className={styles.chatItem} ref={itemRef} onDoubleClick={create}>
            <div className={styles.chatImage}>
                <div>
                    {/* <img src={'/pxfuel.jpg'}></img> */}
                </div>
            </div>
            <div className={styles.chatInfo}>
                <div className={styles.nameTime}>
                    <div id={styles.name}>
                        <label>{data.username}</label>
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