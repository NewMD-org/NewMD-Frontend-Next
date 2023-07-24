import Link from "next/link";
import { useEffect, useState } from "react";
import Head from "next/head";
import cookie from "react-cookies";
import styles from "./Loader.module.css";


const messages = [
    "啟用「儲存資料」的選項可以極大的縮減查詢課表的時間",
    "你可以讓課表下雪喔",
    "身份證字號及密碼是不分大小寫的",
    "我們永遠不會儲存您的任何資料直到你啟用了「儲存資料」的選項",
    "我們使用了 MongoDB 作為資料庫儲存課表",
    "這個網站是用 Next.js 作為主要框架設計的",
    "我們會在每天的早上 8:00 更新每一個儲存的課表"
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
                    <p className={styles.title}>你知道嗎 ?</p>
                    <p className={styles.content}>{message}</p>
                    {retryTimes > 0 ? (
                        <div className={styles.retry_times}>
                            嘗試登入 {retryTimes} 次
                            <span>|</span>
                            <Link href="/login" onClick={removeCookie}>回到登入畫面</Link>
                        </div>
                    ) : <></>}
                </div>
                <div className={styles.bouncing_loader}>
                    <p>正在載入</p>
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