import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import cookie from "react-cookies";
import { Switch, Select } from "@mantine/core";
import styles from "./NavbarTop.module.css";

import NewMD_API from "../../../../api/NewMD_API";

import Attention from "./components/Attention";


export default function NavbarTop({ state, authorization, decoration, setDecoration }) {
    const router = useRouter();
    const saveDataInput = useRef(null);
    const menu = useRef(null);

    const [userDataStatus, setUserDataStatus] = useState(state["userDataStatus"].toString());
    const [isLoading, setIsLoading] = useState(false);
    const [showAttention, setShowAttention] = useState(false);

    return (
        <>
            {showAttention ? <Attention setIsLoading={setIsLoading} setShowAttention={setShowAttention} setUserDataStatus={setUserDataStatus} authorization={authorization} /> : <></>}
            <header className={styles.header}>
                <Link href="/" className={join(styles.logo, "noselect")} onClick={removeCookie}>
                    NewMD
                </Link>
                <input className={styles.menu_btn} type="checkbox" id="menu-btn" ref={menu} />
                <label className={styles.menu_icon} htmlFor="menu-btn">
                    <span className={styles.navicon}></span>
                </label>
                <ul className={styles.menu}>
                    <li>
                        <div className={join(styles.option, styles.nohover)} style={{ cursor: "pointer" }}>
                            <Select
                                clearable
                                placeholder="選擇一個主題"
                                nothingFound="No options"
                                size="xs"
                                transitionProps={{ transition: "scale-y", duration: 200, timingFunction: "ease" }}
                                maxDropdownHeight={150}

                                value={decoration}
                                onChange={setDecoration}
                                data={["聖誕節"]}
                            />
                        </div>
                    </li>
                    <li>
                        <div
                            className={styles.option}
                            style={isLoading ? { cursor: "not-allowed" } : {}}
                            onClick={() => saveDataInput.current.click()}
                        >
                            <Switch
                                name="userDataStatus"
                                labelPosition="left"
                                label={isLoading ? (state["userDataStatus"] === "true" ? "正在刪除" : "正在儲存") : "儲存資料"}
                                size="md"
                                color="green"
                                style={{ pointerEvents: "none" }}

                                ref={saveDataInput}
                                checked={userDataStatus === "true"}
                                disabled={isLoading}
                                onChange={(e) => userDataStatusChange(e.target.checked)}
                            />
                        </div>
                    </li>
                    <li>
                        <Link href="/logout" className={join(styles.logout, styles.option)}>
                            <span>
                                登出
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-logout" width="24" height="24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
                                <path d="M7 12h14l-3 -3m0 6l3 -3"></path>
                            </svg>
                        </Link>
                    </li>
                </ul>
            </header>
        </>
    );

    async function deleteData(token) {
        setIsLoading(true);
        try {
            console.log("Delete user data : start");
            const t0 = performance.now();
            const response = await new NewMD_API(5).delete(token);
            if (response.status === 200) {
                setUserDataStatus("false");
                const t1 = performance.now();
                console.log(`Delete user data : success (took ${Math.round(t1 - t0) / 1000} seconds)`);
                sessionStorage.setItem("userDataStatus", "false");
                router.replace({
                    pathname: "/table",
                    query: {
                        "userDataStatus": "false",
                        "table": state["table"],
                        "year": state["year"]
                    }
                }, "/table");
            }
            else {
                throw Error("Joanne is smart");
            };
        }
        catch (err) {
            setUserDataStatus("true");
            console.log("Delete user data : failed");
            if (!err?.response) {
                console.log("Delete user data : no server response");
            }
            else if (err.response?.status === 403) {
                router.replace({
                    pathname: "/login"
                }, "/login");
            }
        };
        return setIsLoading(false);
    };

    function userDataStatusChange(checked) {
        if (checked) {
            setShowAttention(true);
        }
        else {
            deleteData(authorization);
        };
    };
}

function removeCookie() {
    cookie.remove("navigate");
    sessionStorage.clear();
}

function join(...array) {
    return array.join(" ");
}