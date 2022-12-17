import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";

import jwt_decode from "jwt-decode";
import cookie from "react-cookies";

import NewMD_API from "../../pages/api/NewMD_API";

import styles from "./LoginPage.module.css";
import logo from "./logo.svg";
import background from "./background.svg";


function join(...array) {
    return array.join(" ");
}

function isValidAuth(JWT) {
    try {
        return [
            typeof (JWT) === "string",
            JSON.stringify(Object.keys(jwt_decode(JWT))) === JSON.stringify(["userID", "userPWD", "rememberMe", "iat", "exp"]),
            jwt_decode(JWT).exp >= (new Date().getTime() / 1000)
        ].every(test => test === true);
    }
    catch (err) {
        return false;
    };
}

export default function LoginPage() {
    const IDRef = useRef();
    const PWDRef = useRef();
    const errRef = useRef();
    const router = useRouter();

    const [ID, setID] = useState("");
    const [PWD, setPWD] = useState("");
    const [rememberMe, setRememberMe] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        IDRef.current.focus();

        const JWT = localStorage.getItem("authorization");
        const decodedJWT = (isValidAuth(JWT) ? jwt_decode(JWT) : {});
        const defaultRememberMe = (isValidAuth(JWT) ? decodedJWT.rememberMe === "true" : false);

        setID(defaultRememberMe ? decodedJWT.userID : "");
        setPWD(defaultRememberMe ? decodedJWT.userPWD : "");
        setRememberMe(defaultRememberMe.toString());
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [ID, PWD, rememberMe]);

    const handleSubmit = async (e) => {
        console.log("Manual login : start");
        const t0 = performance.now();
        console.log(`ID : ${ID}\nPWD : ${PWD}\nrememberMe : ${rememberMe}`);
        e.preventDefault();
        setLoading(true);

        try {
            const response = await new NewMD_API(10).login(ID, PWD, rememberMe);
            if (response["error"] === false) {
                cookie.save("navigate", "true", { path: "/", maxAge: 60 * 60 * 24 * 7 });
                localStorage.setItem("authorization", response["data"]["authorization"]);
                setID("");
                setPWD("");
                setRememberMe("");
                const t1 = performance.now();
                console.log(`Manual login : success (took ${Math.round(t1 - t0) / 1000} seconds)`);
                return router.replace({
                    pathname: "/table",
                    query: {
                        userDataStatus: response["data"]["userDataStatus"]
                    }
                }, "/table");
            }
            else {
                if (response["message"] === "Missing Username") {
                    IDRef.current.focus();
                }
                else if (response["message"] === "Missing Password") {
                    PWDRef.current.focus();
                }
                else {
                    errRef.current.focus();
                };

                setErrMsg(response["message"]);
                console.log(`Manual login : ${response["message"]}`);
                console.log("Manual login : failed");
                console.log("Clear local storage, session storage and cookie");
                localStorage.clear();
                sessionStorage.clear();
                cookie.remove("navigate");
            };
        }
        catch (err) {
            setErrMsg("Manual login : unexpected error");
            console.log("Clear local storage, session storage and cookie");
            localStorage.clear();
            sessionStorage.clear();
            cookie.remove("navigate");
            errRef.current.focus();
        };

        return setLoading(false);
    };

    return (
        <>
            <Head>
                <title>Login | NewMD</title>
            </Head>
            <div className={join(styles.background, "noselect")}>
                <Image className={styles.backgroundImage} alt="background image" src={background} draggable="false" fill />
                <div className={styles.centerContainer}>
                    <div className={styles.logo}>
                        <Image className={styles.img} alt="logo" src={logo} draggable="false" />
                    </div>
                    <div className={styles.center}>
                        <p ref={errRef} className={errMsg ? styles.errmsg : styles.offscreen} aria-live="assertive">{errMsg}</p>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.textfield}>
                                <input type="text" name="ID" ref={IDRef} value={ID} onChange={(e) => setID(e.target.value)} placeholder="Username" />
                                <span className={styles.text_focusEffect}></span>
                            </div>
                            <div className={styles.textfield}>
                                <input type="password" name="PWD" ref={PWDRef} value={PWD} onChange={(e) => setPWD(e.target.value)} placeholder="Password" />
                                <span className={styles.text_focusEffect}></span>
                            </div>
                            <div className={join(styles.rememberme, "pretty", "p-default", "p-curve")}>
                                <input type="checkbox" name="rememberMe" onChange={(e) => setRememberMe(e.target.checked ? "true" : "false")} checked={rememberMe === "true"} />
                                <div className={join("state", "p-success-o")}>
                                    <label>Remember me for 7 days</label>
                                </div>
                            </div>
                            <div className={styles.centerDiv}>
                                {isLoading ? (
                                    <button className={styles.signin} style={{ "cursor": "not-allowed" }} disabled>
                                        <span className="spinner-border" aria-hidden="true"></span>
                                    </button>
                                ) : (
                                    <button className={styles.signin}>Sign in</button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};