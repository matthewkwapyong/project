'use client'
// import { Drop, Item } from '../../../Components/drop';
import { useState, useRef, useEffect } from 'react';
// import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next'
import styles from './[[...chatid]]/style.module.css'
import Side from './[[...chatid]]/side';
import { MessageProvider } from './context'


export default function Layout({ children }) {
    return (
        <html lang="en">
            <body>
                <div className={styles.Block}>
                    <MessageProvider>
                        <Side/>
                        {children}
                    </MessageProvider>
                </div>
            </body>
        </html>
    );
}
