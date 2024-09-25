"use client";
import {socketIO,io} from 'socket.io-client';
export const socket = io('http://localhost:3001')
// const socket = socketIO.connect('http://localhost:3001');
export default socket