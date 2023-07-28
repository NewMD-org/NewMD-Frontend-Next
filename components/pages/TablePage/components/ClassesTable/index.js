import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import cookie from "react-cookies";
import axios from "axios";
import styles from "./ClassesTable.module.css";

import NewMD_API from "../../../../api/NewMD_API";

import Detail from "./components/Detail";


export default function ClassesTable({ isLoading, setIsLoading, state, authorization, decoration, retryTimes, setRetryTimes }) {
    const router = useRouter();

    const [isBigScreen, setIsBigScreen] = useState(getWindowDimensions().width > 930);
    const [showDetail, setShowDetail] = useState(false);
    const [detail, setDetail] = useState({ "name": null, "classID": null });
    const [table, setTable] = useState({});
    const [showSat, setShowSat] = useState(false);

    useEffect(() => {
        if (retryTimes < 11) {
            fetchData(authorization);
        }
        else {
            console.log("Getting table data : failed");
            sessionStorage.clear();
            cookie.remove("navigate");
            router.push({
                pathname: "/login"
            }, "/login");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [retryTimes]);

    useEffect(() => {
        if (state["table"] ? true : false) {
            (async function () {
                setTable(isBigScreen ? JSON.parse(state["table"]) : await shortenTable(JSON.parse(state["table"])));
                setIsLoading(false);
            })();
            async function handleResize() {
                setIsBigScreen(getWindowDimensions().width > 930);
            }
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    useEffect(() => {
        console.log(`Screen size : ${isBigScreen ? "big" : "small"}`);
        (async function () {
            setTable(isBigScreen ? JSON.parse(state["table"]) : await shortenTable(JSON.parse(state["table"])));
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isBigScreen]);

    return (
        <>
            <Detail showDetail={showDetail} setShowDetail={setShowDetail} setDetail={setDetail} detail={detail} state={state} />
            <table className={styles.table} style={decoration === "Christmas" ? { paddingBottom: "60px" } : {}}>
                <thead>
                    <tr className={"noselect"}>
                        <th className={isBigScreen ? styles.topLeftIndex : styles.indexMobile} colSpan={isBigScreen ? "2" : "1"}></th>
                        <th className={join(styles.index, styles.days)}>MON</th>
                        <th className={join(styles.index, styles.days)}>TUE</th>
                        <th className={join(styles.index, styles.days)}>WED</th>
                        <th className={join(styles.index, styles.days)}>THU</th>
                        <th className={join(styles.index, styles.days)}>FRI</th>
                        {showSat ? (
                            <th className={join(styles.index, styles.days)}>SAT</th>
                        ) : (
                            <></>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {...(function () {
                        let index = [null, "1", "2", "3", "4", "5", "6", "7", "8"];
                        let indexMobile = [
                            null,
                            ["08:15", "09:05"],
                            ["09:15", "10:05"],
                            ["10:15", "11:05"],
                            ["11:15", "12:05"],
                            ["13:20", "14:10"],
                            ["14:20", "15:10"],
                            ["15:20", "16:10"],
                            ["16:20", "17:10"]
                        ];

                        let allClassesHTML = [];
                        for (let y = 1; y <= 8; y++) {
                            if (y === 5) {
                                allClassesHTML.push(
                                    <tr className={styles.classes} key="noon">
                                        {isBigScreen ? <th className={join("noselect", styles.index)}>午</th> : <></>}
                                        <th className={join("noselect", styles.indexMobile)}>12:45<br />|<br />13:15</th>
                                        <td className={isBigScreen ? styles.data : styles.dataMobile} style={{ "width": "100%" }} colSpan={showSat ? "6" : "5"}>
                                            <div>午休</div>
                                        </td>
                                    </tr>
                                );
                            }

                            let classesHTML = [];
                            for (let x = 1; x <= 5; x++) {
                                classesHTML.push(
                                    classHTML(x, y)
                                );
                            }
                            if (showSat) {
                                classesHTML.push(
                                    classHTML(6, y)
                                );
                            }
                            allClassesHTML.push(
                                <tr className={styles.classes} key={y}>
                                    {isBigScreen ? <th className={join("noselect", styles.index)}>{index[y]}</th> : <></>}
                                    <th className={join("noselect", styles.indexMobile)}>{indexMobile[y][0]}<br />|<br />{indexMobile[y][1]}</th>
                                    {...classesHTML}
                                </tr>
                            );
                        }
                        return allClassesHTML;

                        function classHTML(x, y) {
                            return (
                                <td className={isBigScreen ? styles.data : styles.dataMobile} key={x}>
                                    {isLoading ? (<></>) : table[`day${x}`][y]["classname"] ? (
                                        <>
                                            <div
                                                className={table[`day${x}`][y].status ? styles.status : styles.status_hidden}
                                                style={{ "--backgroundColor": table[`day${x}`][y].status === "調" ? "#007bff" : "#DB24BB" }}
                                            >
                                                {table[`day${x}`][y].status}
                                            </div>
                                            <div
                                                className={styles.classname}
                                                tabIndex={0}
                                                onKeyUp={(event) => {
                                                    if (event.key === "Enter") {
                                                        setDetail({ "name": table[`day${x}`][y]["classname"], "classID": table[`day${x}`][y]["classID"] });
                                                        setShowDetail(true);
                                                    }
                                                }}
                                                onClick={() => {
                                                    setDetail({ "name": table[`day${x}`][y]["classname"], "classID": table[`day${x}`][y]["classID"] });
                                                    setShowDetail(true);
                                                }}
                                            >
                                                {table[`day${x}`][y]["classname"]}
                                            </div>
                                            <div>{table[`day${x}`][y]["teacher"]}</div>
                                        </>
                                    ) : (<></>)}
                                </td>
                            );
                        }
                    })()}
                </tbody>
            </table>
        </>
    );

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    function checkSat(obj) {
        const classes = Object.keys(obj["day6"]);
        let haveData = false;
        for (let index of classes) {
            if (obj["day6"][index]["classname"] !== "") {
                haveData = true;
                break;
            };
        };
        return haveData;
    };

    async function fetchData(token) {
        setIsLoading(true);
        const t0 = performance.now();

        try {
            if (state["userDataStatus"] === "true") {
                console.log("Getting table data : start (from database)");
                const response = await new NewMD_API(40).read(token);
                if (response.status === 200) {
                    setTable(isBigScreen ? response.data["table"] : await shortenTable(response.data["table"]));
                    setShowSat(checkSat(response.data["table"]));
                    const t1 = performance.now();
                    console.log(`Getting table data : success (took ${Math.round(t1 - t0) / 1000} seconds)`);
                    router.replace({
                        pathname: "/table",
                        query: {
                            "userDataStatus": state["userDataStatus"],
                            "table": JSON.stringify(response.data["table"]),
                            "year": response.data["year"],
                            "updateAt": response.data["updatedAt"]
                        }
                    }, "/table");
                }
                else {
                    throw Error("Failed to read data");
                };
            }
            else {
                console.log("Getting table data : start (direct)");
                const response = await new NewMD_API(40).table(token);
                if (response.status === 200) {
                    setTable(isBigScreen ? response.data["table"] : await shortenTable(response.data["table"]));
                    setShowSat(checkSat(response.data["table"]));
                    const t1 = performance.now();
                    console.log(`Getting table data : success (took ${Math.round(t1 - t0) / 1000} seconds)`);
                    router.replace({
                        pathname: "/table",
                        query: {
                            "userDataStatus": state["userDataStatus"],
                            "table": JSON.stringify(response.data["table"]),
                            "year": response.data["year"],
                            "updateAt": new Date().toISOString()
                        }
                    }, "/table");
                }
                else {
                    throw Error("Failed to read data");
                };
            };
        }
        catch (error) {
            if (!error?.response) {
                console.log("Getting table data : no server response");
            }
            else if (error.response.status === 403) {
                console.log("Getting table data : failed to verify");
                sessionStorage.clear();
                localStorage.clear();
                cookie.remove("navigate");
                router.push({
                    pathname: "/login"
                }, "/login");
            }
            else {
                await sleep(2);
                setRetryTimes(retryTimes => retryTimes + 1);
                console.log(`Retrying getting table data : retried ${retryTimes} time(s)`);
            };
        };
    };
}

function join(...array) {
    return array.join(" ");
}

async function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function shortenTable(data) {
    if (!data) return;
    const t0 = performance.now();

    let dataString = JSON.stringify(data);

    let replacements = [];

    try {
        console.log("Getting classname replacement : start");
        const replacementJSON = await axios.get("https://raw.githubusercontent.com/NewMD-org/Configurations/main/Frontend/classnameReplacement.json");
        replacements = replacementJSON.data ? replacementJSON.data["replacements"] : [];

        const t1 = performance.now();
        console.log(`Getting classname replacement : success (took ${Math.round(t1 - t0) / 1000} seconds)`);
    }
    catch (err) {
        replacements = [];
        console.log("Getting classname replacement : failed");
    };

    for (let replacement of replacements) {
        dataString = dataString.replace(new RegExp(replacement[0], "gm"), replacement[1]);
    };

    return JSON.parse(dataString);
}