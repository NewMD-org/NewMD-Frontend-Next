import React, { useEffect, useState } from "react";
import styles from "./InstallPWA.module.css";


export default function InstallPWA() {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);

    useEffect(() => {
        console.log("PWA : checking for PWA support");
        const handler = e => {
            e.preventDefault();
            console.log("PWA : PWA supported");
            setSupportsPWA(true);
            setPromptInstall(e);
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("transitionend", handler);
    }, []);

    const install = evt => {
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
            <button className={styles.pwa_button} id="setup_button" ariaLabel="Install app" title="Install app" onClick={install}>
                Install NewMD
            </button>
        </div>
    );
};