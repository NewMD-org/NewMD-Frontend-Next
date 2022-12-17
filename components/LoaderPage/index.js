import { useEffect, useState } from "react";
import Head from "next/head";

import styles from "./Loader.module.css";


function random(x) {
    return Math.floor(Math.random() * x);
};

const messages = [
    "Your password stored in Mingdao's server isn't hashed!",
    "It dosn't matter if you input your account & password with capital letter.",
    "We won't store your data unless you enable \"Save Data\" option.",
    "We use MongoDB to store your data.",
    "This page is built by ReactJS.",
    "We will update your data at 24:00 every day."
];

export default function Loader() {
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