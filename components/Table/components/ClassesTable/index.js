import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import cookie from "react-cookies";
import axios from "axios";
import { Detail } from "./components/Detail";
import NewMD_API from "../../../../api/NewMD_API.js";
import styles from "./ClassesTable.module.css";


function join(...array) {
    return array.join(" ");
}

const shortenTableData = async (data) => {
    if (!data) return;
    const t0 = performance.now();

    var dataString = JSON.stringify(data);

    var replacements = [];

    try {
        console.log("Getting classname replacement : start");
        const replacementJSON = await axios.get("https://raw.githubusercontent.com/NewMD-org/Frontend-classnameReplacement/main/classnameReplacement.json");
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

export function ClassesTable({ isLoading, setIsLoading, state, authorization }) {
    const [isBigScreen, setIsBigScreen] = useState(getWindowDimensions().width > 930);
    const [showDetail, setShowDetail] = useState(false);
    const [detail, setDetail] = useState({ "name": null, "classID": null });
    const [tableData, setTableData] = useState({});
    const [showSat, setShowSat] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchData(authorization);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (location.state["tableData"] ? true : false) {
            (async function () {
                setTableData(isBigScreen ? location.state["tableData"] : await shortenTableData(location.state["tableData"]));
                setIsLoading(false);
            })();
            async function handleResize() {
                setIsBigScreen(getWindowDimensions().width > 930);
            }
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state]);

    useEffect(() => {
        console.log(`Screen size : ${isBigScreen ? "big" : "small"}`);
        (async function () {
            setTableData(isBigScreen ? location.state["tableData"] : await shortenTableData(location.state["tableData"]));
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isBigScreen]);

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    const checkSat = (obj) => {
        const classes = Object.keys(obj["day6"]);
        var haveData = false;
        for (let index of classes) {
            if (obj["day6"][index]["classname"] !== "") {
                haveData = true;
                break;
            };
        };
        return haveData;
    }

    const fetchData = async (token) => {
        setIsLoading(true);
        const t0 = performance.now();

        try {
            if (state["userDataStatus"]) {
                console.log("Getting table data : start (from database)");
                const response = await new NewMD_API(40).read(token);
                if (response.status === 200) {
                    setTableData(isBigScreen ? response.data["table"] : await shortenTableData(response.data["table"]));
                    setShowSat(checkSat(response.data["table"]));
                    navigate("/table", { state: { "userDataStatus": state["userDataStatus"], "tableData": response.data["table"], "year": response.data["year"] }, replace: true });
                    const t1 = performance.now();
                    console.log(`Getting table data : success (took ${Math.round(t1 - t0) / 1000} seconds)`);
                }
                else {
                    throw Error("Joanne is smart");
                };
            }
            else {
                console.log("Getting table data : start (direct)");
                const response = await new NewMD_API(40).table(token);
                if (response.status === 200) {
                    setTableData(isBigScreen ? response.data["table"] : await shortenTableData(response.data["table"]));
                    setShowSat(checkSat(response.data["table"]));
                    navigate("/table", { state: { "userDataStatus": state["userDataStatus"], "tableData": response.data["table"], "year": response.data["year"] }, replace: true });
                    const t1 = performance.now();
                    console.log(`Getting table data : success (took ${Math.round(t1 - t0) / 1000} seconds)`);
                }
                else {
                    throw Error("Joanne is smart");
                };
            };
        }
        catch (err) {
            if (!err?.response) {
                console.log("Getting table data : no server response");
            };
            console.log("Getting table data : failed");
            console.log("Clear cookie");
            cookie.remove("navigate");
            navigate("/");
        };
    }

    return (
        <div className={styles.container}>
            {showDetail ? <Detail setShowDetail={setShowDetail} setDetail={setDetail} detail={detail} /> : <></>}
            <table className={styles.table}>
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
                    <tr className={styles.classes}>
                        {isBigScreen ? <th className={join("noselect", styles.index)}>1</th> : <></>}
                        <th className={join("noselect", styles.indexMobile)}>08:15<br />|<br />09:05</th>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day1"]["1"]["classname"], "classID": tableData["day1"]["1"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day1"]["1"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day1"]["1"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day2"]["1"]["classname"], "classID": tableData["day2"]["1"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day2"]["1"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day2"]["1"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day3"]["1"]["classname"], "classID": tableData["day3"]["1"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day3"]["1"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day3"]["1"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day4"]["1"]["classname"], "classID": tableData["day4"]["1"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day4"]["1"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day4"]["1"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day5"]["1"]["classname"], "classID": tableData["day5"]["1"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day5"]["1"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day5"]["1"]["teacher"]}</div>
                        </td>
                        {showSat ? (
                            <td className={isBigScreen ? styles.data : styles.dataMobile}>
                                <div className={styles.classname} onClick={() => { setShowDetail(true); setDetail(); }}>{isLoading ? <></> : tableData["day6"]["1"]["classname"]}</div>
                                <div>{isLoading ? <></> : tableData["day6"]["1"]["teacher"]}</div>
                            </td>
                        ) : (
                            <></>
                        )}
                    </tr>
                    <tr className={styles.classes}>
                        {isBigScreen ? <th className={join("noselect", styles.index)}>2</th> : <></>}
                        <th className={join("noselect", styles.indexMobile)}>09:15<br />|<br />10:05</th>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day1"]["2"]["classname"], "classID": tableData["day1"]["2"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day1"]["2"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day1"]["2"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day2"]["2"]["classname"], "classID": tableData["day2"]["2"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day2"]["2"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day2"]["2"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day3"]["2"]["classname"], "classID": tableData["day3"]["2"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day3"]["2"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day3"]["2"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day4"]["2"]["classname"], "classID": tableData["day4"]["2"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day4"]["2"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day4"]["2"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day5"]["2"]["classname"], "classID": tableData["day5"]["2"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day5"]["2"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day5"]["2"]["teacher"]}</div>
                        </td>
                        {showSat ? (
                            <td className={isBigScreen ? styles.data : styles.dataMobile}>
                                <div className={styles.classname} onClick={() => { setShowDetail(true); setDetail(); }}>{isLoading ? <></> : tableData["day6"]["2"]["classname"]}</div>
                                <div>{isLoading ? <></> : tableData["day6"]["2"]["teacher"]}</div>
                            </td>
                        ) : (
                            <></>
                        )}
                    </tr>
                    <tr className={styles.classes}>
                        {isBigScreen ? <th className={join("noselect", styles.index)}>3</th> : <></>}
                        <th className={join("noselect", styles.indexMobile)}>10:15<br />|<br />11:05</th>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day1"]["3"]["classname"], "classID": tableData["day1"]["3"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day1"]["3"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day1"]["3"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day2"]["3"]["classname"], "classID": tableData["day2"]["3"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day2"]["3"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day2"]["3"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day3"]["3"]["classname"], "classID": tableData["day3"]["3"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day3"]["3"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day3"]["3"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day4"]["3"]["classname"], "classID": tableData["day4"]["3"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day4"]["3"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day4"]["3"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day5"]["3"]["classname"], "classID": tableData["day5"]["3"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day5"]["3"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day5"]["3"]["teacher"]}</div>
                        </td>
                        {showSat ? (
                            <td className={isBigScreen ? styles.data : styles.dataMobile}>
                                <div className={styles.classname} onClick={() => { setShowDetail(true); setDetail(); }}>{isLoading ? <></> : tableData["day6"]["3"]["classname"]}</div>
                                <div>{isLoading ? <></> : tableData["day6"]["3"]["teacher"]}</div>
                            </td>
                        ) : (
                            <></>
                        )}
                    </tr>
                    <tr className={styles.classes}>
                        {isBigScreen ? <th className={join("noselect", styles.index)}>4</th> : <></>}
                        <th className={join("noselect", styles.indexMobile)}>11:15<br />|<br />12:05</th>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day1"]["4"]["classname"], "classID": tableData["day1"]["4"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day1"]["4"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day1"]["4"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day2"]["4"]["classname"], "classID": tableData["day2"]["4"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day2"]["4"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day2"]["4"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day3"]["4"]["classname"], "classID": tableData["day3"]["4"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day3"]["4"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day3"]["4"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day4"]["4"]["classname"], "classID": tableData["day4"]["4"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day4"]["4"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day4"]["4"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day5"]["4"]["classname"], "classID": tableData["day5"]["4"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day5"]["4"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day5"]["4"]["teacher"]}</div>
                        </td>
                        {showSat ? (
                            <td className={isBigScreen ? styles.data : styles.dataMobile}>
                                <div className={styles.classname} onClick={() => { setShowDetail(true); setDetail(); }}>{isLoading ? <></> : tableData["day6"]["4"]["classname"]}</div>
                                <div>{isLoading ? <></> : tableData["day6"]["4"]["teacher"]}</div>
                            </td>
                        ) : (
                            <></>
                        )}
                    </tr>
                    <tr className={styles.classes}>
                        {isBigScreen ? <th className={join("noselect", styles.index)}>午</th> : <></>}
                        <th className={join("noselect", styles.indexMobile)}>12:45<br />|<br />01:15</th>
                        <td className={isBigScreen ? styles.data : styles.dataMobile} style={{ "width": "100%" }} colSpan={showSat ? "6" : "5"}>
                            <div>午休</div>
                        </td>
                    </tr>
                    <tr className={styles.classes}>
                        {isBigScreen ? <th className={join("noselect", styles.index)}>5</th> : <></>}
                        <th className={join("noselect", styles.indexMobile)}>13:20<br />|<br />14:10</th>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day1"]["5"]["classname"], "classID": tableData["day1"]["5"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day1"]["5"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day1"]["5"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day2"]["5"]["classname"], "classID": tableData["day2"]["5"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day2"]["5"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day2"]["5"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day3"]["5"]["classname"], "classID": tableData["day3"]["5"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day3"]["5"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day3"]["5"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day4"]["5"]["classname"], "classID": tableData["day4"]["5"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day4"]["5"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day4"]["5"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day5"]["5"]["classname"], "classID": tableData["day5"]["5"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day5"]["5"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day5"]["5"]["teacher"]}</div>
                        </td>
                        {showSat ? (
                            <td className={isBigScreen ? styles.data : styles.dataMobile}>
                                <div className={styles.classname} onClick={() => { setShowDetail(true); setDetail(); }}>{isLoading ? <></> : tableData["day6"]["5"]["classname"]}</div>
                                <div>{isLoading ? <></> : tableData["day6"]["5"]["teacher"]}</div>
                            </td>
                        ) : (
                            <></>
                        )}
                    </tr>
                    <tr className={styles.classes}>
                        {isBigScreen ? <th className={join("noselect", styles.index)}>6</th> : <></>}
                        <th className={join("noselect", styles.indexMobile)}>14:20<br />|<br />15:10</th>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day1"]["6"]["classname"], "classID": tableData["day1"]["6"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day1"]["6"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day1"]["6"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day2"]["6"]["classname"], "classID": tableData["day2"]["6"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day2"]["6"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day2"]["6"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day3"]["6"]["classname"], "classID": tableData["day3"]["6"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day3"]["6"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day3"]["6"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day4"]["6"]["classname"], "classID": tableData["day4"]["6"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day4"]["6"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day4"]["6"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day5"]["6"]["classname"], "classID": tableData["day5"]["6"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day5"]["6"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day5"]["6"]["teacher"]}</div>
                        </td>
                        {showSat ? (
                            <td className={isBigScreen ? styles.data : styles.dataMobile}>
                                <div className={styles.classname} onClick={() => { setShowDetail(true); setDetail(); }}>{isLoading ? <></> : tableData["day6"]["6"]["classname"]}</div>
                                <div>{isLoading ? <></> : tableData["day6"]["6"]["teacher"]}</div>
                            </td>
                        ) : (
                            <></>
                        )}
                    </tr>
                    <tr className={styles.classes}>
                        {isBigScreen ? <th className={join("noselect", styles.index)}>7</th> : <></>}
                        <th className={join("noselect", styles.indexMobile)}>15:20<br />|<br />16:10</th>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day1"]["7"]["classname"], "classID": tableData["day1"]["7"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day1"]["7"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day1"]["7"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day2"]["7"]["classname"], "classID": tableData["day2"]["7"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day2"]["7"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day2"]["7"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day3"]["7"]["classname"], "classID": tableData["day3"]["7"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day3"]["7"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day3"]["7"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day4"]["7"]["classname"], "classID": tableData["day4"]["7"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day4"]["7"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day4"]["7"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day5"]["7"]["classname"], "classID": tableData["day5"]["7"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day5"]["7"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day5"]["7"]["teacher"]}</div>
                        </td>
                        {showSat ? (
                            <td className={isBigScreen ? styles.data : styles.dataMobile}>
                                <div className={styles.classname} onClick={() => { setShowDetail(true); setDetail(); }}>{isLoading ? <></> : tableData["day6"]["7"]["classname"]}</div>
                                <div>{isLoading ? <></> : tableData["day6"]["7"]["teacher"]}</div>
                            </td>
                        ) : (
                            <></>
                        )}
                    </tr>
                    <tr className={styles.classes}>
                        {isBigScreen ? <th className={join("noselect", styles.index)}>8</th> : <></>}
                        <th className={join("noselect", styles.indexMobile)}>16:20<br />|<br />17:10</th>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day1"]["8"]["classname"], "classID": tableData["day1"]["8"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day1"]["8"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day1"]["8"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day2"]["8"]["classname"], "classID": tableData["day2"]["8"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day2"]["8"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day2"]["8"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day3"]["8"]["classname"], "classID": tableData["day3"]["8"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day3"]["8"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day3"]["8"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day4"]["8"]["classname"], "classID": tableData["day4"]["8"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day4"]["8"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day4"]["8"]["teacher"]}</div>
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            <div className={styles.classname} onClick={() => { setDetail({ "name": tableData["day5"]["8"]["classname"], "classID": tableData["day5"]["8"]["classID"] }); setShowDetail(true); }}>{isLoading ? <></> : tableData["day5"]["8"]["classname"]}</div>
                            <div>{isLoading ? <></> : tableData["day5"]["8"]["teacher"]}</div>
                        </td>
                        {showSat ? (
                            <td className={isBigScreen ? styles.data : styles.dataMobile}>
                                <div className={styles.classname} onClick={() => { setShowDetail(true); setDetail(); }}>{isLoading ? <></> : tableData["day6"]["8"]["classname"]}</div>
                                <div>{isLoading ? <></> : tableData["day6"]["8"]["teacher"]}</div>
                            </td>
                        ) : (
                            <></>
                        )}
                    </tr>
                </tbody>
            </table>
        </div >
    );
}