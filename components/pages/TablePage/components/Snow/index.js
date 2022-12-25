import { useContext } from "react";
import Snowfall from "react-snowfall";

import SettingsContext from "./settings";

import styles from "./snow.module.css";


export default function Snow() {
    const settings = useContext(SettingsContext);

    return (
        <>
            <Snowfall color={settings.color} snowflakeCount={settings.snowflakeCount} />
            <div className={styles.snowdrift}></div>
        </>
    );
};