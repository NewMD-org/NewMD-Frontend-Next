import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import cookie from "react-cookies";


export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        console.log("Manual logout : start");
        console.log("Clear local storage, session storage and cookie");
        localStorage.clear();
        sessionStorage.clear();
        cookie.remove("navigate");
        console.log("Manual logout : success");

        router.replace({
            pathname: "/login"
        }, "/login");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Head>
            <title>Logout | NewMD</title>
        </Head>
    );
}