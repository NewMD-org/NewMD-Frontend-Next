import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import cookie from "react-cookies";


export default function Table() {
    const router = useRouter();

    const [userDataStatus, setUserDataStatus] = useState(null);

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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        userDataStatus ? (
            <>
                <h1>Table Page</h1>
                <h2>userDataStatus : {userDataStatus}</h2>
            </>
        ) : (
            <></>
        )
    );
}