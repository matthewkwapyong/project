'use client'
import { useState, useEffect } from "react"


export function Item({children,onClick}) {
    return (
        <button onClick={onClick}>
            {children}
        </button>
    )
}
export function Drop({ children }) {
    let [show, setShow] = useState("block");
    useEffect(()=>{ 
        document.addEventListener('click',() =>{

        })
    })
    return (
        <div id="boss">
            <div className="dropdown">
                {/* <svg>
                    <filter id="grain">
                        <feTurbulence type="turbulance" baseFrequency={0.65}/>
                    </filter>
                </svg> */}
                {/* <div classNam   e="dropbtn" onClick={() => setShow("block")} >:sss</div> */}
                <div className="dropdown_content" onMouseLeave={() => setShow("none")} style={{ display: show }}>
                    <div className="drop">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

