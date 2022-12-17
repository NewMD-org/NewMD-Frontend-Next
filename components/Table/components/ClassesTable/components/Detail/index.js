import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import NewMD_API from "../../../../../../api/NewMD_API.js";
import styles from "./Detail.module.css";


function join(...array) {
    return array.join(" ");
}

function findPath(obj, target) {
    for (let day of Object.keys(obj)) {
        for (let ele of Object.keys(obj[day])) {
            if (obj[day][ele]["classID"] === target) {
                return [day, ele];
            };
        };
    };
}

const copyToClipboard = async (text) => {
    if ("clipboard" in navigator) {
        return await navigator.clipboard.writeText(text);
    } else {
        return document.execCommand("copy", true, text);
    };
};

export function Detail({ setShowDetail, setDetail, detail }) {
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({});
    const [copySuccess0, setCopySuccess0] = useState(false);
    const [copySuccess1, setCopySuccess1] = useState(false);

    const location = useLocation();

    useEffect(() => {
        if (Object.keys(message).length !== 0) {
            setIsLoading(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message]);

    useEffect(() => {
        viewVT(location.state["year"], detail["classID"]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const closeModal = useCallback(_ => {
        setDetail({ "name": null, "classID": null });
        setShowDetail(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setShowDetail]);

    const viewVT = async (year, classID) => {
        setIsLoading(true);
        const t0 = performance.now();
        try {
            var data = {};
            if (location.state["userDataStatus"]) {
                console.log("Getting VT : start (from database)");
                const path = findPath(location.state["tableData"], classID);
                const classObj = location.state["tableData"][path[0]][path[1]];
                data = {
                    meet: classObj["meet"],
                    classroom: classObj["classroom"]
                };
            }
            else {
                console.log("Getting VT : start (direct)");
                data = await (await new NewMD_API(10).viewvt(year, classID)).data;
            };
            setMessage(
                {
                    meet: data["meet"] === "" ? "none" : data["meet"],
                    classroom: data["classroom"] === "" ? "none" : data["classroom"]
                }
            );

            const t1 = performance.now();
            console.log(`Getting VT : success (took ${Math.round(t1 - t0) / 1000} seconds)`);
        }
        catch (err) {
            console.log("Getting VT : failed");
            closeModal();
        };
        setIsLoading(false);
    };

    return (
        <div className={join(styles.modal_container, "noselect")}>
            {isLoading ? (
                <>
                    <div className={styles.spinner_container}>
                        <div className={styles.spinner}></div>
                    </div>
                    <div className={styles.text_area}>
                        <p className={styles.title}>Waiting for too long ?</p>
                        <p className={styles.content}>Try enabling the "Save Data" option !</p>
                    </div>
                </>
            ) : (
                <>
                    <div className={styles.outside_close} onClick={() => closeModal()}></div>
                    <div className={join(styles.modal, "fadeIn")} style={{ "--fadeInDuration": "1s" }}>
                        <div className={styles.close_container}>
                            <h1 className={styles.modal__title}>{detail["name"]}</h1>
                            <p className={styles.close} onClick={() => closeModal()}>×</p>
                        </div>

                        <div className={styles.field_container}>
                            <p className={styles.modal__text}>Google Meet</p>
                            <div className={styles.form}>
                                {message.meet === "none" ? (
                                    <>
                                        <p className={styles.field_none}>{message.meet}</p>
                                    </>
                                ) : (
                                    <>
                                        <a className={join(styles.field, "yesselect")} href={message.meet} target="_blank">{message.meet}</a>
                                        <span title="Copy" onClick={() => { copyToClipboard(message.meet); setCopySuccess0(true); }} onMouseLeave={() => setCopySuccess0(false)}>{copySuccess0 ? <>&#x2714;</> : <>&#x1F4CB;</>}</span>
                                    </>
                                )}
                            </div>
                            <p className={styles.modal__text}>Classroom Code</p>
                            <div className={styles.form}>
                                {message.classroom === "none" ? (
                                    <>
                                        <p className={styles.field_none}>{message.classroom}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className={join(styles.field, "yesselect")}>{message.classroom}</p>
                                        <span title="Copy" onClick={() => { copyToClipboard(message.classroom); setCopySuccess1(true); }} onMouseLeave={() => setCopySuccess1(false)}>{copySuccess1 ? <>&#x2714;</> : <>&#x1F4CB;</>}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )
            }
        </div >
    );
}