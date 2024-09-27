'use client'
import styles from "../login.module.css";
import { useRouter } from 'next/navigation'
import { Login } from '@/lib'
import { useState } from 'react'
import { useFormState } from 'react-dom'

import { Open, Close } from '../../../../Components/eye'
import Link from "next/link";

const initialState = {
    authenticated: true,
}
export default function Home() {
    let [showpass, setshowpass] = useState(false)
    const [state, formAction] = useFormState(Login, initialState)
    let showpassword = () => setshowpass(!showpass)
    useState(() => {
        console.log(state)
    })
    return (
        <div className={styles.App}>
            <div className={styles.Container + " " + styles.login}>
                <div className={styles.top}>
                    <label>Create Account</label>
                </div>
                <div className={styles.errorContainer} style={!state.authenticated ? { display: "flex" } : { display: "none" }}>
                    <div >
                        {state.type == 0 ?
                            <label>account doesn't exists</label>
                            :
                            <label>wrong password</label>
                        }
                    </div>
                </div>
                <div id={styles.fail}>
                    <label>Email exists</label>
                </div>
                <div className={styles.form}>
                    <form id={styles.logg} action={formAction}>
                        <div className={styles.formItems}>
                            <div className={styles.field}>
                                <div>
                                    <label>username</label>
                                </div>
                                <input type="text" name="username" required style={{ width: "340px" }} />
                            </div>
                            <div className={styles.field}>
                                <div>
                                    <label>Password</label>
                                </div>
                                <div className={styles.passwordContainer} style={{ width: "340px" }}>
                                    <input
                                        id={styles.pass}
                                        type="password"
                                        name="password"
                                        required
                                    />
                                    <button
                                        id={styles.showpass}
                                        type="button"
                                        onClick={showpassword}
                                    >
                                        {showpass ?
                                            <Close />
                                            :
                                            <Open />
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.submit}>
                            <button type="submit">Create</button>
                        </div>
                    </form>
                </div>
                <div className={styles.next}>
                    <Link href="signup">Create account</Link>
                </div>
            </div>
        </div>
    );
}

