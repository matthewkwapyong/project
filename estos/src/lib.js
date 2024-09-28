'use server'
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'

export async function Signup(prevState, formData) {
    let date = new Date()
    const fields = {
        firstname: formData.get("first_name"),
        lastname: formData.get("last_name"),
        email: formData.get("email"),
        username: formData.get("username"),
        password: formData.get("password"),
        created: date
    };
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
    };
    let result = await fetch('http://localhost:3001/api/create', options)
    let data = await result.json()
    if (data.created) {
        cookies().set("accessToken", data.token, {
            maxAge: data.maxAge,
            path: "/",
            sameSite: "lax",
        });
        cookies().set("refreshToken", data.token, {
            path: "/",
            sameSite: "lax",
        });
        
        redirect(`/message`)
    }else{
        return data
    }
}
export async function Login(prevState, formData) {
    const fields = {
        username: formData.get("username"),
        password: formData.get("password"),
    };
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
    };
    let response = await fetch('http://localhost:3001/api/login', options)
    let data = await response.json()
    if (data.authenticated) {
        cookies().set("accessToken", data.token, {
            maxAge: data.maxAge,
            path: "/",
            sameSite: "lax",
        });
        cookies().set("refreshToken", data.refresh, {
            path: "/",
            sameSite: "lax",
        });
        redirect(`/message`)
    }else{
        return data
    }
}

