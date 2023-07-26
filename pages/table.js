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
            setUserDataStatus(router.query["userDataStatus"]);
            sessionStorage.setItem("userDataStatus", router.query["userDataStatus"]);
        }
        else {
            router.replace("/login", "/login");
        }

        setAuthorization(localStorage.getItem("authorization"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    return (
        (userDataStatus && authorization) ? (
            <>
                <Head>
                    <meta charSet="utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />

                    <title>Table | NewMD</title>
                    <meta name="author" content="OnCloud" />
                    <meta name="theme-color" content="#2f3542" />
                    <meta name="description" content="登入以快速查詢明道課表。︁" />
                    <meta name="copyright" content="Copyright (c) by OnCloud" />

                    <link rel="icon" href="/favicon.ico" />
                    <link rel="apple-touch-icon" href="/logo192.png" />
                    <link rel="manifest" href="/manifest.json" />

                    {/* <!-- Search Engine Optimization --> */}
                    <meta name="keywords" lang="EN" content="NewMD, Timetable, Mingdao, MDHS" />
                    <meta name="keywords" lang="zh-TW" content="NewMD, 課表, 明道, 明道中學" />
                    <meta name="distribution" content="local" />
                    <meta name="revisit-after" content="1" />
                </Head>
                <TablePage state={{ "userDataStatus": userDataStatus, "table": router.query["table"] || null, "year": router.query["year"] || null, "updateAt": router.query["updateAt"] || null }} authorization={authorization} />
            </>
        ) : (
            <></>
        )
    );
}