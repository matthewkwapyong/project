import Link from "next/link"
import "./404.css"
export default function NotFound() {
    // let style = {
    //     backgroundImage: "url(/grain2.png)",
    //     width: "100%",
    //     height: "100%",
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     flexDirection: "column",
    //     gap:"10px"
    // }
    // let label1 = {
    //     fontSize: "7em",
    //     color: "white",
    //     fontWeight: "500"
    // }
    // let label2 = {
    //     fontSize: "1em",
    //     color: "white",
    //     fontWeight: "500"
    // }
    // let link = {
    //     fontSize: "1em",
    //     color: "white",
    //     fontWeight: "500",
    //     textDecoration:"none",
    //     borderRadius: "10px",
    //     padding: "7px 10px 10px 10px",
    //     color:"black",
    //     background:"#fff"
    // }
    return (
        <div className="notFound">
            <label style={{ fontWeight: "500",fontSize:"7em"}}>
                404
            </label>
            <label style={{ fontWeight: "500",fontSize:"1em"}}>
                Not Found
            </label>
            <Link href="/login">Login</Link>
        </div>
    )
}