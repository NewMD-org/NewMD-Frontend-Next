import styles from "./Loader.module.css";


function join(...array) {
    return array.join(" ");
}

export default function Loader() {
    return (
        <div className={join(styles.loader_container, "noselect")}>
            <div className={styles.spinner_container}>
                <div className={styles.spinner}></div>
            </div>
            <div className={styles.text_area}>
                <p className={styles.title}>Waiting for too long ?</p>
                <p className={styles.content}>Try enabling the &quot;Save Data&quot; option!</p>
            </div>
        </div>
    );
}