// app/message/MessageContext.js
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { setCookie, getCookie } from 'cookies-next';
export const MessageContext = createContext()
export function useMessageContext() {
    return useContext(MessageContext)
}

export function MessageProvider({ children }) {
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)
    const [activeChat, setactiveChat] = useState({})

    
    async function fetchData() {
        try {
            // Replace this with your actual data fetching logic
            let accessToken = getCookie('accessToken');
            let response = await fetch('/api/user', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const result = await response.json()
            setUser(result)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <MessageContext.Provider value={{user,loading,activeChat,setactiveChat }}>
            {children}
        </MessageContext.Provider>
    )
}

// // app/message/layout.js
// import { MessageProvider } from './MessageContext'
// import Sidebar from './Sidebar'

// export default function MessageLayout({ children }) {
//   return (
//     <MessageProvider>
//       <div className="message-layout">
//         <Sidebar />
//         <main>{children}</main>
//       </div>
//     </MessageProvider>
//   )
// }

// // app/message/Sidebar.js
// 'use client'

// import { useMessageContext } from './MessageContext'
// import { getCookie, getCookies } from 'cookies-next'

// export default function Sidebar() {
//   const { data, loading } = useMessageContext()

//   if (loading) return <div>Loading...</div>

//   return (
//     <aside>
//       {/* Use the data to render your sidebar content */}
//     </aside>
//   )
// }