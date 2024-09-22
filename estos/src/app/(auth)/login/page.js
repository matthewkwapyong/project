'use client'
import styles from "../login.module.css";
import { useRouter } from 'next/navigation'
import { Login } from '@/lib'
import { useActionState } from 'react'
import Link from "next/link";
export default function Home() {
    return (
        <div className={styles.App}>
            <div className={styles.Container + " " + styles.login}>
                <div className={styles.top}>
                    <label>Create Account</label>
                </div>
                <div id={styles.fail}>
                    <label>Email exists</label>
                </div>
                <div className={styles.form}>
                    <form id={styles.logg} action={Login}>
                        <div className={styles.field}>
                            <div>
                                <label>username</label>
                            </div>
                            <input type="text" name="username" required />
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
                    <Link href="signup" >Login</Link>
                </div>
            </div>
        </div>
    );
}
