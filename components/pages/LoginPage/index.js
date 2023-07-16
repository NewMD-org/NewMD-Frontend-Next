import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useDisclosure } from "@mantine/hooks";
import { Button, Checkbox, Dialog, Text } from "@mantine/core";
import jwt_decode from "jwt-decode";
import cookie from "react-cookies";
import styles from "./LoginPage.module.css";

import NewMD_API from "../../api/NewMD_API";

import InstallPWA from "./components/InstallPWA";
import AccountSwitch from "./components/AccountSwitch";


export default function LoginPage() {
    const IDRef = useRef();
    const PWDRef = useRef();
    const signInRef = useRef();
    const router = useRouter();

    const [ID, setID] = useState("");
    const [PWD, setPWD] = useState("");
    const [rememberMe, setRememberMe] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [oldAccount, setOldAccount] = useState(false);

    const [opened, { open: showErrorMessage, close: closeErrorMessage }] = useDisclosure(false);

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
        closeErrorMessage();
    }, [ID, PWD, closeErrorMessage, rememberMe]);

    useEffect(() => {
        setPWD(oldAccount ? "" : ID);
        IDRef.current.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oldAccount]);

    return (
        <>
            <div className={join(styles.background, "noselect")}>
                <Image className={styles.backgroundImage} alt="background image" src="/background.svg" draggable="false" fill />
                <div className={styles.centerContainer}>
                    <div className={styles.logo}>
                        <Image className={styles.img} alt="logo" src="/logo.svg" width={709} height={225} draggable="false" priority />
                    </div>
                    <div className={styles.center}>
                        <AccountSwitch
                            leftText={"I don't have password"}
                            rightText={"I have password"}

                            checked={oldAccount}
                            onChange={(e) => setOldAccount(e.target.checked)}
                        />
                        <form
                            className={styles.form}
                            style={{
                                "--textfieldPWDHeight": oldAccount ? "var(--textfieldHeight)" : "0",
                                "--movement": oldAccount ? "0" : "var(--textfieldHeight)"
                            }}
                            onSubmit={handleSubmit}
                        >
                            <div className={styles.textfield}>
                                <input
                                    type="text"
                                    name="ID"
                                    placeholder="Username"
                                    autoComplete="username"

                                    ref={IDRef}
                                    value={ID}
                                    onChange={(e) => setID(e.target.value)}
                                />
                                <span className={styles.text_focusEffect} />
                            </div>
                            <div className={join(styles.textfield, styles.textfieldPWD)}>
                                <input
                                    type="password"
                                    name="PWD"
                                    placeholder="Password"
                                    autoComplete="current-password"

                                    ref={PWDRef}
                                    value={PWD}
                                    onChange={(e) => setPWD(e.target.value)}
                                />
                                <span className={styles.text_focusEffect} />
                            </div>
                            <Checkbox
                                label="Remember me for 7 days"
                                color="green"
                                size="md"
                                style={{ cursor: "pointer" }}
                                className={styles.rememberMe}

                                ref={signInRef}
                                checked={rememberMe === "true"}
                                onChange={(e) => setRememberMe(e.currentTarget.checked ? "true" : "false")}
                                autoComplete="on"
                            />
                            <Button
                                radius="xl"
                                size="xl"
                                className={styles.signIn}
                                style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                                loading={isLoading}

                                onClick={handleSubmit}
                            >
                                Sign in
                            </Button>
                        </form>
                    </div>
                </div>
                <InstallPWA />
            </div>
            <Dialog
                withCloseButton
                withBorder
                size="lg"
                radius="md"
                position={{ top: 20, left: 20 }}
                className={styles.errorMessage}
                cur

                opened={opened}
                onClose={closeErrorMessage}
            >
                <Text weight={500}>
                    {errMsg}
                </Text>
            </Dialog>
        </>
    );

    async function handleSubmit(e) {
        console.log("Manual login : start");
        const t0 = performance.now();
        console.log(`ID : ${ID}\nPWD : ${PWD}\nrememberMe : ${rememberMe}`);
        e.preventDefault();
        setLoading(true);

        try {
            const response = await new NewMD_API(20).login(ID, oldAccount ? PWD : ID, rememberMe);
            if (response["error"] === false) {
                cookie.save("navigate", "true", { path: "/", maxAge: 60 * 60 * 24 * 7 });
                localStorage.setItem("authorization", response["data"]["authorization"]);
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

                setErrMsg(response["message"]);
                showErrorMessage();
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
            showErrorMessage();
            console.log("Remove cookie : navigate");
            cookie.remove("navigate");
        };

        return setLoading(false);
    };
};

/**
 * Join multiple classes
 */
function join(...classes) {
    return classes.join(" ");
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