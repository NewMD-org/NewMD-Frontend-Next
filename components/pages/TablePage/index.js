import { useState } from "react";

import NavbarTop from "./components/NavbarTop";
import { ClassesTable } from "./components/ClassesTable";
import Loader from "./components/Loader";

import styles from "./Table.module.css";
// import snowdrift from "./snowdrift.png";


export default function TablePage({ state, authorization }) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            <div className={styles.background}>
                {isLoading ? <Loader /> : <></>}
                <NavbarTop state={state} authorization={authorization} />
                <ClassesTable isLoading={isLoading} setIsLoading={setIsLoading} state={state} authorization={authorization} />
            </div>
        </>
    );
};