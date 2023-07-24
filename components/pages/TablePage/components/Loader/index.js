import Link from "next/link";
import cookie from "react-cookies";
import styles from "./Loader.module.css";


export default function Loader({ retryTimes }) {
    return (
        <div className={join(styles.loader_container, "noselect")}>
            <div className={styles.spinner_container}>
                <div className={styles.spinner}></div>
            </div>
            <div className={styles.text_area}>
                <p className={styles.title}>不想等待太久 ?</p>
                <p className={styles.content}>啟用「儲存資料」的選項可以極大的縮減查詢課表的時間</p>
                {retryTimes > 0 ? (
                    <div className={styles.retry_times}>
                        嘗試登入 {retryTimes} 次
                        <span>|</span>
                        <Link href="/login" onClick={removeCookie}>回到登入畫面</Link>
                    </div>
                ) : <></>}
            </div>
        </div>
    );
}

function join(...array) {
    return array.join(" ");
}

function removeCookie() {
    cookie.remove("navigate");
    sessionStorage.clear();
}