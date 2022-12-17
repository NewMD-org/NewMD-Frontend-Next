import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import cookie from "react-cookies";
import { NavbarTop } from "./components/NavbarTop";
import { ClassesTable } from "./components/ClassesTable";
import { Loader } from "./components/Loader";
// import snowdrift from "./snowdrift.png";
import styles from "./Table.module.css";


export default function TablePage({ state, authorization }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = "Time Table | NewMD";
    }, []);

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