import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import jwt_decode from "jwt-decode";
import cookie from "react-cookies";

import NewMD_API from "../components/api/NewMD_API";

import LoginPage from "../components/pages/LoginPage";
import Loader from "../components/pages/LoaderPage";


export default function Login() {
    const router = useRouter();

    const [isLoading, setLoading] = useState(false);
    const [retryTimes, setRetryTimes] = useState(0);

    useEffect(() => {
        if (isValidAuth()) {
            if (retryTimes < 11) {
                setLoading(true);
                autoLogin();
            }
            else {
                console.log("Auto login : failed");
                sessionStorage.clear();
                cookie.remove("navigate");
                setLoading(false);
            }
        }
        else {
            sessionStorage.clear();
            cookie.remove("navigate");
            console.log("Local Storage - authorization : invalid");
            console.log("Auto login : failed");
            setLoading(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [retryTimes]);

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <title>Login | NewMD</title>
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

            {isLoading ? (
                <Loader retryTimes={retryTimes} />
            ) : (
                <LoginPage />
            )}
        </>
    );

    async function autoLogin() {
        console.log("Auto login : start");
        const t0 = performance.now();
        try {
            console.log("Local Storage - authorization : found");
            const rememberMe = jwt_decode(localStorage.getItem("authorization")).rememberMe;
            const ID = jwt_decode(localStorage.getItem("authorization")).userID;
            const PWD = jwt_decode(localStorage.getItem("authorization")).userPWD;

            if (cookie.load("navigate") === "true") {
                console.log("Cookie - navigate : found");
                const response = await new NewMD_API(20).login(ID, PWD, rememberMe.toString());

                if (response["error"] === false) {
                    localStorage.setItem("authorization", response["data"]["authorization"]);
                    cookie.save("navigate", "true", { path: "/", maxAge: 60 * 60 * 24 * 7 });
                    const t1 = performance.now();
                    console.log(`Auto login : success (took ${Math.round(t1 - t0) / 1000} seconds)`);
                    return router.replace({
                        pathname: "/table",
                        query: {
                            "userDataStatus": response["data"]["userDataStatus"]
                        }
                    }, "/table");
                }
                else {
                    throw Error("Auto login : error");
                };
            }
            else {
                sessionStorage.clear();
                cookie.remove("navigate");
                console.log("Cookie - navigate : not found");
                console.log("Auto login : failed");
                return setLoading(false);
            };
        }
        catch (err) {
            await sleep(2);
            setRetryTimes(retryTimes => retryTimes + 1);
            console.log(`Retrying auto login : retried ${retryTimes} time(s)`);
        };
    };
}

async function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function isValidAuth() {
    try {
        return [
            typeof (localStorage.getItem("authorization")) === "string",
            JSON.stringify(Object.keys(jwt_decode(localStorage.getItem("authorization")))) === JSON.stringify(["userID", "userPWD", "rememberMe", "iat", "exp"]),
            jwt_decode(localStorage.getItem("authorization")).exp >= (new Date().getTime() / 1000)
        ].every(test => test === true);
    }
    catch (err) {
        return false;
    };
}