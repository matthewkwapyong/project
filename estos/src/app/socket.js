"use client";
import {socketIO,io} from 'socket.io-client';
export const socket = io('https://project-8w7l.onrender.com')
// const socket = socketIO.connect('https://project-8w7l.onrender.com');
export default socket