import styles from "./Loader.module.css";


function join(...array) {
    return array.join(" ");
}

export function Loader() {
    return (
        <div className={join(styles.loader_container, "noselect")}>
            <div className={styles.spinner_container}>
                <div className={styles.spinner}></div>
            </div>
            <div className={styles.text_area}>
                <p className={styles.title}>Waiting for too long ?</p>
                <p className={styles.content}>Try enabling the "Save Data" option!</p>
            </div>
        </div>
    );
}