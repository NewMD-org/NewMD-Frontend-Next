import { useState } from "react";

import styles from "./Message.module.css";
import Chinese from "./components/Chinese";
import English from "./components/English";


export default function Message() {
    const [language, setLanguage] = useState(false);

    return (
        <article className={styles.markdown_body}>
            <div className={styles.switch_container}>
                <div className={styles.switch_button}>
                    <input className={styles.switch_button_checkbox} type="checkbox" onChange={(e) => setLanguage(e.target.checked)}></input>
                    <label className={styles.switch_button_label} htmlFor=""><span className={styles.switch_button_label_span}>中文</span></label>
                </div>
            </div>
            {language ? (
                <English />
            ) : (
                <Chinese />
            )}
        </article>
    );
}