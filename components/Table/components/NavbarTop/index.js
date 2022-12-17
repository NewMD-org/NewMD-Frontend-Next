import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import NewMD_API from "../../../../api/NewMD_API.js";
import { Attention } from "./components/Attention";
import styles from "./NavbarTop.module.css"


function removeCookie() {
    cookie.remove("navigate");
}

function join(...array) {
    return array.join(" ");
}

export function NavbarTop({ state, authorization }) {
    const [userDataStatus, setUserDataStatus] = useState(state["userDataStatus"].toString());
    const [isLoading, setIsLoading] = useState(false);
    const [showAttention, setShowAttention] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const saveDataInput = useRef(null);
    const menu = useRef(null);

    const deleteData = async (token) => {
        setIsLoading(true);
        try {
            console.log("Delete user data : start");
            const t0 = performance.now();
            const response = await new NewMD_API(5).delete(token);
            if (response.status === 200) {
                setUserDataStatus("false");
                navigate("/table", { state: { "userDataStatus": false, "tableData": location.state["tableData"], "year": location.state["year"] }, replace: true });
                const t1 = performance.now();
                console.log(`Delete user data : success (took ${Math.round(t1 - t0) / 1000} seconds)`);
            }
            else {
                throw Error("Joanne is smart");
            };
        }
        catch (err) {
            setUserDataStatus("true");
            if (!err?.response) {
                console.log("Delete user data : no server response");
            }
            else if (err.response?.status === 403) {
                navigate("/login");
            };
            console.log("Delete user data : failed");
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
                <Link to="/" className={join(styles.logo, "noselect")} onClick={removeCookie}>
                    NewMD
                </Link>
                <input className={styles.menu_btn} type="checkbox" id="menu-btn" ref={menu} />
                <label className={styles.menu_icon} htmlFor="menu-btn">
                    <span className={styles.navicon}></span>
                </label>
                <ul className={styles.menu}>
                    <li>
                        <div className={styles.saveData} onClick={() => saveDataInput.current.click()} style={isLoading ? { "cursor": "not-allowed" } : {}}>
                            <div className={join(styles.switch, "noselect", "pretty", "p-switch", "p-fill")}>
                                <input  className={styles.saveDataCheckbox} type="checkbox" name="userDataStatus" ref={saveDataInput} checked={userDataStatus === "true"} disabled={isLoading} onChange={(e) => userDataStatusChange(e.target.checked)} />
                                <div className={"state p-success"}>
                                    <label>
                                        {isLoading ? (
                                            location.state["userDataStatus"] ? (
                                                <>Deleting</>
                                            ) : (
                                                <>Saving</>
                                            )
                                        ) : (
                                            <>Save Data</>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className={join(styles.logout, "noselect")}>
                            <Link to="/logout">
                                Logout
                            </Link>
                        </div>
                    </li>
                </ul>
            </header>
        </>
    );
}