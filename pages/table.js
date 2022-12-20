import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import TablePage from "../components/pages/TablePage";


export default function Table() {
    const router = useRouter();

    const [userDataStatus, setUserDataStatus] = useState(null);
    const [authorization, setAuthorization] = useState(null);

    useEffect(() => {
        const userDataStatusFromSessionStorage = sessionStorage.getItem("userDataStatus");
        if (userDataStatusFromSessionStorage) {
            setUserDataStatus(userDataStatusFromSessionStorage);
        }
        else if (router.query["userDataStatus"]) {
            console.log(router.query["userDataStatus"]);
            setUserDataStatus(router.query["userDataStatus"]);
            sessionStorage.setItem("userDataStatus", router.query["userDataStatus"]);
        }
        else {
            router.replace("/login", "/login");
        }

        setAuthorization(localStorage.getItem("authorization"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        (userDataStatus && authorization) ? (
            <>
                <Head>
                    <title>Table | NewMD</title>
                </Head>
                <TablePage state={{ "userDataStatus": userDataStatus, "tableData": router.query["tableData"] || null, "year": router.query["year"] || null }} authorization={authorization} />
            </>
        ) : (
            <></>
        )
    );
}