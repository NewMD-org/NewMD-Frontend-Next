import React from "react";
import styles from "./Loader.module.css";


function random(x) {
    return Math.floor(Math.random() * x);
};

export function Loader() {
    const message = [
        "Your password stored in Mingdao's server isn't hashed!",
        "It dosn't matter if you input your account & password with capital letter.",
        "We won't store your data unless you enable \"Save Data\" option.",
        "We use MongoDB to store your data.",
        "This page is built by ReactJS.",
        "We will update your data at 24:00 every day."
    ];

    return (
        <div className={styles.background}>
            <div className={styles.text_area}>
                <p className={styles.title}>Do you know ?</p>
                <p className={styles.content}>{message[random(message.length)]}</p>
            </div>
            <div className={styles.bouncing_loader}>
                <p>Loading</p>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};