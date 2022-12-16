import { useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "./Login.module.css";
import logo from "./logo.svg";
import background from "./background.svg";


function join(...array) {
    return array.join(" ");
}

export default function LoginPage() {
    const IDRef = useRef();
    const PWDRef = useRef();
    const errRef = useRef();

    const defaultRememberMe = false/* isValidAuth() ? jwt_decode(localStorage.getItem("authorization")).rememberMe === "true" : false */;

    const [errMsg, setErrMsg] = useState("");
    const [ID, setID] = useState(""/* defaultRememberMe ? jwt_decode(localStorage.getItem("authorization")).userID : "" */);
    const [PWD, setPWD] = useState(""/* defaultRememberMe ? jwt_decode(localStorage.getItem("authorization")).userPWD : "" */);
    const [rememberMe, setRememberMe] = useState(defaultRememberMe.toString());
    const [success, setSuccess] = useState(false);
    const [isLoading, setLoading] = useState(false);

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
                        <form className={styles.form}/*  onSubmit={handleSubmit} */>
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
                    </div>
                </div>
            </div>
        </>
    );
}