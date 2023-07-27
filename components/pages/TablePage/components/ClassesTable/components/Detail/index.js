import { useCallback, useEffect, useState } from "react";
import { Modal, Tooltip } from "@mantine/core";
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
        setTimeout(() => {
            setDetail({ "name": null, "classID": null });
        }, 200);
        setShowDetail(false);
    }, [setDetail, setShowDetail]);

    return (
        <Modal
            title={detail["name"]}
            centered
            radius="md"
            className={styles.modal_container}
            styles={{
                content: { background: "linear-gradient(90deg,#243342,#362d53)" },
                header: { background: "transparent" },
                body: { background: "transparent" }
            }}
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
            <div className={styles.field_container}>
                {isLoading ? <>
                    <div className={styles.spinner_container}>
                        <div className={styles.spinner}></div>
                    </div>
                    <div className={styles.text_area}>
                        <p className={styles.title}>不想等待太久 ?</p>
                        <p className={styles.content}>啟用「儲存課表」的選項可以極大的縮減查詢課表的時間</p>
                    </div>
                </> : <>
                    <p className={styles.modal__text}>Google Meet</p>
                    <div className={styles.form}>
                        {message.meet === "none" ? <>
                            <p className={styles.field_none}>{message.meet}</p>
                        </> : <>
                            <Tooltip
                                label={copySuccess0 ? "Copied!" : "Copy"}
                                events={{ touch: true, focus: true }}
                            >
                                <span
                                    tabIndex={0}
                                    onKeyUp={(event) => {
                                        if (event.key === " ") {
                                            copyToClipboard(message.meet);
                                            setCopySuccess0(true);
                                        }
                                    }}
                                    onClick={() => {
                                        copyToClipboard(message.meet);
                                        setCopySuccess0(true);
                                    }}
                                    onMouseLeave={() => setCopySuccess0(false)}
                                    onBlur={() => setCopySuccess0(false)}
                                >
                                    {copySuccess0 ? <>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-clipboard-check" width="24" height="24" stroke-width="2" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                                            <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                                            <path d="M9 14l2 2l4 -4"></path>
                                        </svg>
                                    </> : <>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-clipboard" width="24" height="24" stroke-width="2" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                                            <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                                        </svg>
                                    </>}
                                </span>
                            </Tooltip>
                            <Tooltip
                                label="Open in new tab"
                            >
                                <a className={join(styles.field, styles.meet, "yesselect")} href={message.meet} target="_blank" rel="noreferrer">{message.meet}</a>
                            </Tooltip>
                        </>}
                    </div>
                    <p className={styles.modal__text}>Classroom Code</p>
                    <div className={styles.form}>
                        {message.classroom === "none" ? <>
                            <p className={styles.field_none}>{message.classroom}</p>
                        </> : <>
                            <Tooltip
                                label={copySuccess1 ? "Copied!" : "Copy"}
                                events={{ touch: true, focus: true }}
                            >
                                <span
                                    title="Copy"
                                    tabIndex={0}
                                    onKeyUp={(event) => {
                                        if (event.key === " ") {
                                            copyToClipboard(message.classroom);
                                            setCopySuccess1(true);
                                        }
                                    }}
                                    onClick={() => {
                                        copyToClipboard(message.classroom);
                                        setCopySuccess1(true);
                                    }}
                                    onMouseLeave={() => setCopySuccess1(false)}
                                    onBlur={() => setCopySuccess1(false)}
                                >
                                    {copySuccess1 ? <>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-clipboard-check" width="24" height="24" stroke-width="2" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                                            <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                                            <path d="M9 14l2 2l4 -4"></path>
                                        </svg>
                                    </> : <>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-clipboard" width="24" height="24" stroke-width="2" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                                            <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                                        </svg>
                                    </>}
                                </span>
                            </Tooltip>
                            <p className={join(styles.field, styles.classroom, "yesselect")}>{message.classroom}</p>
                        </>}
                    </div>
                </>}
            </div>
        </Modal >
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