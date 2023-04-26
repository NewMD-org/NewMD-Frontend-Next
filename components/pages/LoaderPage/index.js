import Link from "next/link";
import { useEffect, useState } from "react";
import Head from "next/head";
import cookie from "react-cookies";
import styles from "./Loader.module.css";


const messages = [
    "Your password stored in Mingdao's server isn't hashed!",
    "It dosn't matter if you input your account & password with capital letter.",
    "We won't store your data unless you enable \"Save Data\" option.",
    "We use MongoDB to store your data.",
    "This page is built by ReactJS.",
    "We will update your data at 24:00 every day."
];

export default function Loader({ retryTimes }) {
    const [message, setMessage] = useState();

    useEffect(() => {
        setMessage(messages[random(messages.length)]);
    }, []);

    return (
        <>
            <Head>
                <title>Auto Login | NewMD</title>
            </Head>
            <div className={styles.background}>
                <div className={styles.text_area}>
                    <p className={styles.title}>Do you know ?</p>
                    <p className={styles.content}>{message}</p>
                    {retryTimes > 0 ? (
                        <div className={styles.retry_times}>
                            Retried {retryTimes} times
                            <span>|</span>
                            <Link href="/login" onClick={removeCookie}>Back to login</Link>
                        </div>
                    ) : <></>}
                </div>
                <div className={styles.bouncing_loader}>
                    <p>Loading</p>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </>
    );
};

function random(x) {
    return Math.floor(Math.random() * x);
};

function removeCookie() {
    cookie.remove("navigate");
    sessionStorage.clear();
}