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
                <p className={styles.title}>Waiting for too long ?</p>
                <p className={styles.content}>Try enabling the &quot;Save Data&quot; option!</p>
                {retryTimes > 0 ? (
                    <div className={styles.retry_times}>
                        Retried {retryTimes} times
                        <span>|</span>
                        <Link href="/login" onClick={removeCookie}>Back to login</Link>
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