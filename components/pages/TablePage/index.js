import { useState } from "react";

import NavbarTop from "./components/NavbarTop";
import ClassesTable from "./components/ClassesTable";
import Loader from "./components/Loader";
import Snow from "./components/Snow";

import styles from "./Table.module.css";


export default function TablePage({ state, authorization }) {
    const [isLoading, setIsLoading] = useState(true);
    const [enableSnow, setEnableSnow] = useState(true);

    return (
        <>
            <div className={styles.background}>
                {isLoading ? <Loader /> : <></>}
                <NavbarTop state={state} authorization={authorization} enableSnow={enableSnow} setEnableSnow={setEnableSnow} />
                <ClassesTable isLoading={isLoading} setIsLoading={setIsLoading} state={state} authorization={authorization} enableSnow={enableSnow} />
                {enableSnow ? <Snow /> : <></>}
            </div>
        </>
    );
};