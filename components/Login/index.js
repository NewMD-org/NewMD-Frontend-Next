import { useRef, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import cookie from "react-cookies";
import Image from "next/image";
import NewMD_API from "../../pages/api/NewMD_API";
import { Loader } from "./components/Loader";
import { InstallPWA } from "./components/InstallPWA";
import logo from "./logo.svg";
import background from "./background.svg";
import styles from "./Login.module.css";


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

function join(...array) {
    return array.join(" ");
}

const Login = () => {
    const IDRef = useRef();
    const PWDRef = useRef();
    const errRef = useRef();
    const router = useRouter();
    const defaultRememberMe = isValidAuth() ? jwt_decode(localStorage.getItem("authorization")).rememberMe === "true" : false;

    const [ID, setID] = useState(defaultRememberMe ? jwt_decode(localStorage.getItem("authorization")).userID : "");
    const [PWD, setPWD] = useState(defaultRememberMe ? jwt_decode(localStorage.getItem("authorization")).userPWD : "");
    const [rememberMe, setRememberMe] = useState(defaultRememberMe.toString());
    const [userDataStatus, setUserDataStatus] = useState("false");
    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Login | NewMD";

        IDRef.current.focus();
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
                setUserDataStatus(response["data"]["userDataStatus"]);
                const t1 = performance.now();
                console.log(`Manual login : success (took ${Math.round(t1 - t0) / 1000} seconds)`);
                setSuccess(true);
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
                console.log("Clear local storage and cookie");
                localStorage.clear();
                cookie.remove("navigate");
            };
        }
        catch (err) {
            setErrMsg("Manual login : unexpected error");
            console.log("Clear local storage and cookie");
            localStorage.clear();
            cookie.remove("navigate");
            errRef.current.focus();
        };

        return setLoading(false);
    };

    return (
        <>
            {success ? (
                <Navigate to="/table" state={{ "userDataStatus": userDataStatus }} />
            ) : (
                <>
                    <div className={join(styles.background, "noselect")} style={{ backgroundImage: `url(${background})` }}>
                        <div className={styles.centerContainer}>
                            <div className={styles.logo}>
                                <Image alt="logo" src={logo} draggable="false" />
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
                                        <input type="checkbox" name="rememberMe" onChange={(e) => setRememberMe(e.target.checked ? "true" : "false")} defaultChecked={defaultRememberMe} />
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
                                <InstallPWA />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export function LoginPage() {
    const [success, setSuccess] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [userDataStatus, setUserDataStatus] = useState("false");

    const autoLogin = async () => {
        console.log("Auto login : start");
        const t0 = performance.now();
        try {
            if (isValidAuth()) {
                console.log("Local Storage - authorization : found");
                const rememberMe = jwt_decode(localStorage.getItem("authorization")).rememberMe === "true";
                const ID = jwt_decode(localStorage.getItem("authorization")).userID;
                const PWD = jwt_decode(localStorage.getItem("authorization")).userPWD;

                if (cookie.load("navigate") === "true") {
                    document.title = "Auto Login | NewMD";
                    console.log("Cookie - navigate : found");
                    const response = await new NewMD_API(10).login(ID, PWD, rememberMe.toString());
                    if (response["error"] === false) {
                        localStorage.setItem("authorization", response["data"]["authorization"]);
                        cookie.save("navigate", "true", { path: "/", maxAge: 60 * 60 * 24 * 7 });
                        setUserDataStatus(response["data"]["userDataStatus"]);
                        const t1 = performance.now();
                        console.log(`Auto login : success (took ${Math.round(t1 - t0) / 1000} seconds)`);
                        setLoading(false);
                        return setSuccess(true);
                    }
                    else {
                        throw Error("joanne is smart");
                    };
                }
                else {
                    cookie.remove("navigate");
                    console.log("Cookie - navigate : not found");
                    console.log("Auto login : failed");

                    setLoading(false);
                    return setSuccess(false);
                };
            }
            else {
                throw new Error("Local Storage - authorization : invalid");
            };
        }
        catch (err) {
            console.log(err.message);
            console.log("Auto login : failed");
            console.log("Clear local storage and cookie");

            localStorage.clear();
            cookie.remove("navigate");
            setLoading(false);
            return setSuccess(false);
        };
    };

    useEffect(() => {
        document.title = "Login | NewMD";
        autoLogin();
    });

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                success ? (
                    <Navigate to="/table" state={{ "userDataStatus": userDataStatus }} />
                ) : (
                    <Login />
                )
            )}
        </>
    );
}