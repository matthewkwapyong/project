'use client'

import styles from "./style.module.css";
import { Drop, Item } from '../../../Components/drop';
import { useState, useRef, useEffect } from 'react';






function Chat({ sent, active, name, time, img, recent_message }) {
    let itemRef = useRef(null)
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
            {sent ?
                <div id={styles.right}>
                    <label>
                        {recent_message}
                    </label>
                </div>
                :
                <div id={styles.left}>
                      <label>
                        {recent_message}
                    </label>
                </div>
            }
        </div >
    )
}




export default function Page() {

    return (
        <div className={styles.Chat}>
            <div className={styles.Header}>
                daaa
            </div>
            <div className={styles.mid}>
                <div className={styles.messageListContainer}>
                    <div className={styles.messageList}>
                        <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={false}  name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={true}  active={true} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={true}  name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={true}  name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whassssssssssssssssssssssssssssssssssssssssssdddddddddddddddddssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssts nadbb happening"} />
                        <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={true}  name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={false}  name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={true}  name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={false} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={true}  name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={true}  name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat sent={true}  name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                        <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />

                    </div>

                </div>
            </div>
            <div className={styles.MessageInputContainer}>

            </div>
        </div>
    )
}
