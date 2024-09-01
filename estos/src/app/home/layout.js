'use client'
import styles from './style.module.css'
import { Drop, Item } from '../../../Components/drop';
import { useState, useRef, useEffect } from 'react';
function Logo({ fillColor }) {
    return (
        <svg width="49" height="44" viewBox="0 0 49 44" fill={fillColor} xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_14_263)">
                <path d="M27.5826 20.1882C30.5 20.1882 32.7543 19.6705 34.213 18.7647C35.6717 17.8588 36.7326 16.5647 37.263 15.2705C37.7935 13.847 38.0587 13.0705 38.1913 9.83524C38.3239 6.21171 39.1196 4.78818 40.7109 2.97642C42.1696 1.16465 44.6891 0.388184 48.137 0.388184V4.14112C46.9435 4.27054 46.0152 4.65877 45.6174 5.56465C45.2196 6.47054 44.9544 7.37642 44.9544 10.0941C44.9544 14.1058 44.5565 15.6588 43.6283 17.8588C42.7 20.0588 40.9761 21.8705 38.3239 23.1647C35.6717 24.5882 32.0913 25.2352 27.45 25.3647V33.1294C27.45 35.5882 27.5826 37.1411 27.8478 37.9176C28.113 38.6941 28.7761 39.2117 29.7043 39.7294C30.6326 40.247 32.0913 40.3764 34.0804 40.3764V43.7411H14.7196V40.3764C16.5761 40.3764 18.0348 40.1176 18.963 39.7294C19.8913 39.3411 20.5543 38.8235 20.8196 38.047C21.0848 37.2705 21.35 35.7176 21.35 33.1294V25.3647C16.7087 25.2352 13.1283 24.5882 10.4761 23.1647C7.95652 21.8705 6.1 20.0588 5.30435 17.8588C4.37609 15.6588 3.97826 14.1058 3.97826 9.96465C3.97826 7.24701 3.71305 6.47054 3.31522 5.56465C2.91739 4.65877 1.98913 4.14112 0.795654 4.01171V0.388184C2.91739 0.388184 4.77392 0.776419 6.1 1.42348C7.42609 2.07054 8.48696 3.23524 9.28261 4.78818C10.0783 6.34112 10.6087 7.37642 10.6087 9.96465C10.7413 13.1999 11.1391 13.9764 11.537 15.2705C11.9348 16.5647 12.9957 17.8588 14.587 18.7647C16.1783 19.7999 18.4326 20.1882 21.35 20.1882V10.4823C21.35 8.02348 21.2174 6.47054 20.9522 5.69407C20.687 4.91759 20.0239 4.39995 19.0957 4.01171C18.1674 3.62348 16.7087 3.36465 14.7196 3.36465V0.388184H34.213V3.36465C32.2239 3.36465 30.7652 3.62348 29.837 4.01171C28.9087 4.39995 28.2457 5.04701 27.9804 5.69407C27.7152 6.47054 27.5826 8.02348 27.5826 10.4823V20.1882Z" />
            </g>
            <defs>
                <clipPath id="clip0_14_263">
                    <rect width="48.8" height="44" />
                </clipPath>
            </defs>
        </svg>

    );
}

function Chat({ active, name, time, img, recent_message }) {
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

        <div className={styles.chatItem}

            ref={itemRef}
            style={active ?
                { backdropFilter: "blur(3px)", backgroundColor: "#9191914a" } :
                {}
            }
        >
            

            <div className={styles.chatImage}>
                <div>
                    <img src={img}></img>
                </div>
            </div>
            <div className={styles.chatInfo}>
                <div className={styles.nameTime}>
                    <div id={styles.name}>
                        <label>The Gang</label>
                    </div>
                    <div id={styles.time}>
                        <label> 17 dec 2020</label>
                    </div>
                </div>
                <div id={styles.recent_message}>
                    <label> yo when should i come</label>
                </div>
            </div>
        </div >
    )
}
export default function SideBarLayout({ children }) {
    return (
        <div className={styles.Block}>
            <div className="dropdown_content" >
                <div className="drop">
                    <Item onClick={() => { console.log("hello") }}>
                        hello
                    </Item>
                    <Item onClick={() => { console.log("hello") }}>
                        hello
                    </Item>
                    <Item onClick={() => { console.log("hello") }}>
                        hello
                    </Item>
                </div>
            </div>
            <div className={styles.Side_bar}>
                <div className={styles.sideContainer}>
                    <div id={styles.top}>
                        <div className={styles.logoContainer}>
                            <div>
                                <Logo fillColor={'white'} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.chatListContainer}>
                        <div className={styles.chatList}>
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat active={true} name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />
                            <Chat name={"the game"} time={"17-dec-23"} img={"/pxfuel.jpg"} recent_message={"yo whats happening"} />

                        </div>

                    </div>
                </div>
            </div>

            <main className={styles.Main}>
                {children}
                <Drop>
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
                </Drop>
            </main>
        </div>
    );
}
