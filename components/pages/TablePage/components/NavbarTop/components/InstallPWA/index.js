import React, { useEffect, useState } from "react";

import styles from "./InstallPWA.module.css";


export default function InstallPWA({ styles: _styles, showMenu }) {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);

    useEffect(() => {
        const handler = e => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const install = evt => {
        evt.preventDefault();
        if (!promptInstall) {
            return null;
        }
        promptInstall.prompt();
    };

    if (!supportsPWA) {
        return null;
    }

    return promptInstall ? (
        <li>
            <div
                className={_styles.option}
                tabIndex={showMenu - 1}
                onClick={install}
                onKeyUp={(event) => event.key === "Enter" ? install(event) : null}
            >
                <div className={styles.install}>
                    Install NewMD
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={styles.installIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </div>
            </div >
        </li >
    ) : null;
};