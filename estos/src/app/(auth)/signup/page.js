'use client'
import styles from "../login.module.css";
import { useRouter } from 'next/navigation'
import { Signup } from '@/lib'
import { useActionState, useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { Open, Close } from '../../../../Components/eye'

import Link from "next/link";
const initialState = {
    exists: false,
}
export default function Home() {
    const [state, formAction] = useFormState(Signup, initialState)
    let [showpass, setshowpass] = useState(false)
    let showpassword = () => setshowpass(!showpass)
    return (
        <div className={styles.App}>
            <div className={styles.Container + " " + styles.signup}>
                <div className={styles.top}>
                    <label>Create Account</label>
                </div>
                <div className={styles.errorContainer} style={state.exists ? { display:"flex" } : {display:"none" }}>
                    <div >
                        <label>Email or username exists</label>
                    </div>
                </div>
                <div id={styles.fail}>
                </div>
                <div className={styles.form}>
                    <form id={styles.logg} action={formAction}>
                        <div className={styles.formItems}>
                            <div className={styles.field}>
                                <div>
                                    <label>First Name</label>
                                </div>
                                <input type="text" name="first_name" required />
                            </div>
                            <div className={styles.field}>
                                <div>
                                    <label>Last Name</label>
                                </div>
                                <input type="text" name="last_name" required />
                            </div>
                            <div className={styles.field}>
                                <div>
                                    <label>username</label>
                                </div>
                                <input type="text" name="username" required />
                            </div>
                            <div className={styles.field}>
                                <div>
                                    <label>Email</label>
                                </div>
                                <input type="email" name="email" required />
                            </div>
                            <div className={styles.field}>
                                <div>
                                    <label>Password</label>
                                </div>
                                <div className={styles.passwordContainer}>
                                    <input
                                        id={styles.pass}
                                        type={showpass ? "" : "password"}
                                        name="password"
                                        required
                                    />
                                    <button
                                        id={styles.showpass}
                                        type="button"
                                        onClick={showpassword}
                                    >
                                        {showpass ?
                                            <Open />
                                            :
                                            <Close />
                                        }
                                    </button>
                                </div>
                            </div>
                            <div className={styles.submit}>
                                <button type="submit">Create</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className={styles.next}>
                    <Link href="/login" >Login</Link>
                </div>
            </div>
        </div>
    );
}

