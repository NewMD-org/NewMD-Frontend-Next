import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import cookie from "react-cookies";

import NewMD_API from "../../../../api/NewMD_API";

import Attention from "./components/Attention";

import styles from "./NavbarTop.module.css";


function removeCookie() {
    cookie.remove("navigate");
    sessionStorage.clear();
}

function join(...array) {
    return array.join(" ");
}

export default function NavbarTop({ state, authorization, enableChristmas, _setEnableChristmas }) {
    const router = useRouter();
    const saveDataInput = useRef(null);
    const setSnowInput = useRef(null);
    const menu = useRef(null);

    const [userDataStatus, setUserDataStatus] = useState(state["userDataStatus"].toString());
    const [isLoading, setIsLoading] = useState(false);
    const [showAttention, setShowAttention] = useState(false);

    const deleteData = async (token) => {
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
                        "tableData": state["tableData"],
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
            };
        };
        return setIsLoading(false);
    };

    const userDataStatusChange = (checked) => {
        if (checked) {
            setShowAttention(true);
        }
        else {
            deleteData(authorization);
        };
    };

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
                        <div className={styles.saveData} style={{ cursor: "pointer" }} onClick={() => saveDataInput.current.click()}>
                            Christmas Decoration
                            <div className={join(styles.switch, "noselect", "pretty", "p-switch", "p-fill")}>
                                <input type="checkbox" name="Enable Christmas Decoration" ref={saveDataInput} checked={enableChristmas} onChange={(e) => _setEnableChristmas(e.target.checked)} />
                                <div className={"state p-success"}>
                                    <label></label>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className={styles.saveData} style={isLoading ? { cursor: "not-allowed", color: "GrayText" } : { cursor: "pointer" }} onClick={() => setSnowInput.current.click()}>
                            {isLoading ? (
                                state["userDataStatus"] === "true" ? (
                                    <>Deleting</>
                                ) : (
                                    <>Saving</>
                                )
                            ) : (
                                <>Save Data</>
                            )}
                            <div className={join(styles.switch, "noselect", "pretty", "p-switch", "p-fill")}>
                                <input type="checkbox" name="userDataStatus" ref={setSnowInput} checked={userDataStatus === "true"} disabled={isLoading} onChange={(e) => userDataStatusChange(e.target.checked)} />
                                <div className={"state p-success"}>
                                    <label></label>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className={join(styles.logout, "noselect")}>
                            <Link href="/logout">
                                Logout
                            </Link>
                        </div>
                    </li>
                </ul>
            </header>
        </>
    );
}