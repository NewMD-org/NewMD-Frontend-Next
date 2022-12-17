import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";


export default function Table() {
    const router = useRouter();

    const [userDataStatus, setUserDataStatus] = useState(null);
    const [authorization, setAuthorization] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            const userDataStatusFromSessionStorage = sessionStorage.getItem("userDataStatus");
            if (userDataStatusFromSessionStorage) {
                setUserDataStatus(userDataStatusFromSessionStorage);
            }
            else if (router.query.userDataStatus) {
                setUserDataStatus(router.query.userDataStatus);
                sessionStorage.setItem("userDataStatus", router.query.userDataStatus);
            }
            else {
                router.replace("/login", "/login");
            }

            setAuthorization(localStorage.getItem("authorization"));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        (userDataStatus && authorization) ? (
            <>
                <Head>
                    <title>Table | NewMD</title>
                </Head>
                <h1>Table Page</h1>
                <h2>userDataStatus : {userDataStatus}</h2>
                <Link href="/logout">Logout</Link>
            </>
        ) : (
            <></>
        )
    );
}