'use client'
import styles from "../login.module.css";
import { useRouter } from 'next/navigation'
import {Signup} from '@/lib'
import {useActionState} from 'react'
import Link from "next/link";
export default function Home() {
    const router = useRouter()
    let move = (e) => {
        console.log("dad")
    }
    return (
        <div className={styles.App}>
            <div className={styles.Container + " " + styles.signup}>
                <div className={styles.top}>
                    <label>Create Account</label>
                </div>
                <div id={styles.fail}>
                    <label>Email exists</label>
                </div>
                <div className={styles.form}>
                    <form id={styles.logg} action={Signup}>
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
                                    type="password"
                                    name="password"
                                    required
                                />
                                <button
                                    id={styles.showpass}
                                    type="button"
                                // onClick="showPassword(event)"
                                >
                                </button>
                            </div>
                        </div>
                        <div className={styles.submit}>
                            <button type="submit">Create</button>
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
