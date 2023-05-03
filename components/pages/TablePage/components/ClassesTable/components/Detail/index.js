import { useCallback, useEffect, useState } from "react";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import styles from "./Detail.module.css";

import NewMD_API from "../../../../../../api/NewMD_API";


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

export default function Detail({ showDetail, setShowDetail, setDetail, detail, state }) {
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({});
    const [copySuccess0, setCopySuccess0] = useState(false);
    const [copySuccess1, setCopySuccess1] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        if (Object.keys(message).length !== 0) {
            setIsLoading(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message]);

    useEffect(() => {
        if (showDetail) {
            viewVT(state["year"], detail["classID"]);
            open();
        }
        else {
            close();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showDetail]);

    const closeModal = useCallback(_ => {
        setDetail({ "name": null, "classID": null });
        setShowDetail(false);
    }, [setDetail, setShowDetail]);

    return (
        <>
            <Modal
                centered
                className={styles.modal_container}
                overlayProps={{
                    color: "#000000",
                    opacity: 0.55,
                    blur: 3,
                }}
                transitionProps={{
                    transition: "pop",
                    duration: 200,
                    timingFunction: "linear"
                }}

                opened={opened}
                onClose={closeModal}
            >
                <h1 className={styles.modal__title}>{detail["name"]}</h1>
                <div className={styles.field_container}>
                    {isLoading ? (

                        <>
                            <div className={styles.spinner_container}>
                                <div className={styles.spinner}></div>
                            </div>
                            <div className={styles.text_area}>
                                <p className={styles.title}>Waiting for too long ?</p>
                                <p className={styles.content}>Try enabling the &quot;Save Data&quot; option !</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className={styles.modal__text}>Google Meet</p>
                            <div className={styles.form}>
                                {message.meet === "none" ? (
                                    <>
                                        <p className={styles.field_none}>{message.meet}</p>
                                    </>
                                ) : (
                                    <>
                                        <a className={join(styles.field, styles.meet, "yesselect")} href={message.meet} target="_blank" rel="noreferrer">{message.meet}</a>
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
                                        <p className={join(styles.field, styles.classroom, "yesselect")}>{message.classroom}</p>
                                        <span title="Copy" onClick={() => { copyToClipboard(message.classroom); setCopySuccess1(true); }} onMouseLeave={() => setCopySuccess1(false)}>{copySuccess1 ? <>&#x2714;</> : <>&#x1F4CB;</>}</span>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </Modal >
        </>
    );

    async function viewVT(year, classID) {
        setIsLoading(true);
        const t0 = performance.now();
        try {
            let data = {};
            if (state["userDataStatus"] === "true") {
                console.log("Getting VT : start (from database)");
                const path = findPath(JSON.parse(state["table"]), classID);
                const classObj = JSON.parse(state["table"])[path[0]][path[1]];
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
            console.log(err);
            console.log("Getting VT : failed");
            closeModal();
        };
        setIsLoading(false);
    };
}