'use client'
import styles from './style.module.css'
import { Drop, Item } from '../../../Components/drop';
import { useState, useRef, useEffect } from 'react';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';

export default function Layout({ children }) {

    return (
        <html lang="en">
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}
