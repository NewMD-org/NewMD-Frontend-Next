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
    const [isValidID, setIsValidID] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [oldAccount, setOldAccount] = useState(false);

    const [opened, { open: showErrorMessage, close: closeErrorMessage }] = useDisclosure(false);

    useEffect(() => {
        IDRef.current.focus();

        const JWT = localStorage.getItem("authorization");
        if (checkValidAuth(JWT)) {
            const decodedJWT = (checkValidAuth(JWT) ? jwt_decode(JWT) : {});
            setID(decodedJWT.userID);
            setPWD(decodedJWT.userPWD);
            setRememberMe(decodedJWT.rememberMe);
            setOldAccount(!(decodedJWT.userID === decodedJWT.userPWD));
        }
        else {
            localStorage.clear();
            sessionStorage.clear();
            cookie.remove("navigate");
        }
    }, []);

    useEffect(() => {
        setErrMsg("");
        closeErrorMessage();
        setIsValidID(checkValidID(ID));
    }, [ID, PWD, rememberMe, closeErrorMessage]);

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
                            leftText={"我沒有密碼"}
                            rightText={"我有密碼"}

                            checked={oldAccount}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setOldAccount(checked);
                                setPWD(checked ? "" : ID);
                                IDRef.current.focus();
                            }}
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
                                    placeholder="身份證字號"
                                    autoComplete="username"
                                    style={{
                                        "--IDtextColor": isValidID ? "black" : "#df0000"
                                    }}

                                    ref={IDRef}
                                    value={ID}
                                    onInput={(e) => setID(e.target.value)}
                                />
                                <span className={styles.text_focusEffect} />
                            </div>
                            <div className={join(styles.textfield, styles.textfieldPWD)}>
                                <input
                                    type="password"
                                    name="PWD"
                                    placeholder="密碼"
                                    autoComplete="current-password"
                                    style={{
                                        "--IDtextColor": "black"
                                    }}

                                    ref={PWDRef}
                                    value={PWD}
                                    onInput={(e) => setPWD(e.target.value)}
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
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.currentTarget.checked)}
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
                                {isLoading ? "" : "Sign in"}
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
            const response = await new NewMD_API(20).login(ID, oldAccount ? PWD : ID, rememberMe.toString());
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

function checkValidAuth(JWT) {
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

function checkValidID(id) {
    let studIdNumber = id.toUpperCase();

    if (studIdNumber.length != 10) {
        return false;
    }
    if (isNaN(studIdNumber.substr(1, 9)) || (!/^[A-Z]$/.test(studIdNumber.substr(0, 1)))) {
        return false;
    }

    var idHeader = "ABCDEFGHJKLMNPQRSTUVXYWZIO";

    studIdNumber = (idHeader.indexOf(studIdNumber.substring(0, 1)) + 10) + "" + studIdNumber.substr(1, 9);
    let s = parseInt(studIdNumber.substr(0, 1)) +
        parseInt(studIdNumber.substr(1, 1)) * 9 +
        parseInt(studIdNumber.substr(2, 1)) * 8 +
        parseInt(studIdNumber.substr(3, 1)) * 7 +
        parseInt(studIdNumber.substr(4, 1)) * 6 +
        parseInt(studIdNumber.substr(5, 1)) * 5 +
        parseInt(studIdNumber.substr(6, 1)) * 4 +
        parseInt(studIdNumber.substr(7, 1)) * 3 +
        parseInt(studIdNumber.substr(8, 1)) * 2 +
        parseInt(studIdNumber.substr(9, 1));

    let checkNum = parseInt(studIdNumber.substr(10, 1));
    if ((s % 10) == 0 || (10 - s % 10) == checkNum) {
        return true;
    }
    else {
        return false;
    }
}