import Link from "next/link";

import styles from "./HomePage.module.css";


export default function HomePage() {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to <a href="https://newmd.eu.org">NewMD</a> !
                </h1>

                <p className={styles.description}>
                    a beautiful & faster version of MDHS timetable website.
                </p>

                <div className={styles.grid}>
                    <Link href="/login" className={styles.card} >
                        <h2>Login &rarr;</h2>
                        <p>
                            Login to NewMD timetable.
                        </p>
                    </Link>
                </div>
            </main >

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by Vercel
                </a>
            </footer>
        </div >
    );
}