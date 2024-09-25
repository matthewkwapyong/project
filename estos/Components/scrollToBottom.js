import { useEffect, useRef } from "react";

export default function Scroll() {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());

    return (
        <div ref={elementRef} ></div>
    )
};
