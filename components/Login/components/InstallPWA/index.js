import React, { useEffect, useState } from "react";
import styles from "./InstallPWA.module.css";


export function InstallPWA() {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);

    useEffect(() => {
        const handler = e => {
            e.preventDefault();
            console.log("we are being triggered :D");
            setSupportsPWA(true);
            setPromptInstall(e);
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("transitionend", handler);
    }, []);

    const onClick = evt => {
        evt.preventDefault();
        if (!promptInstall) {
            return;
        };
        promptInstall.prompt();
    };

    if (!supportsPWA) {
        return null;
    };

    return (
        <div className={styles.pwa_container}>
            <button className={styles.pwa_button} id="setup_button" aria-label="Install app" title="Install app" onClick={onClick}>
                Install NewMD
            </button>
        </div>
    );
};