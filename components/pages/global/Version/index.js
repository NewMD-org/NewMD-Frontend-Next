import styles from "./Version.module.css";
import * as packageJSON from "../../../../package.json";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import NewMD_API from "../../../api/NewMD_API";


export default function Version() {
    const router = useRouter();

    const [APIversion, setAPIversion] = useState("loading ...");
    const [isTablePage, setIsTablePage] = useState(false);

    useEffect(() => {
        (async () => {
            setAPIversion((await new NewMD_API(5).ping()).api);
        })();
    }, []);
    useEffect(() => {
        setIsTablePage(router.pathname === "/table");
    }, [router.pathname]);

    return (
        <div
            className={styles.version}
            style={{
                "--position": isTablePage ? "relative" : "fixed"
            }}
        >
            <code className={styles.code}>Website v{packageJSON.version}</code>
            <code className={styles.code}>API {APIversion}</code>
        </div>
    );
}