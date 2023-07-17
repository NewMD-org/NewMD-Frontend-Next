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
                    <tr className={styles.classes}>
                        {isBigScreen ? <th className={join("noselect", styles.index)}>1</th> : <></>}
                        <th className={join("noselect", styles.indexMobile)}>08:15<br />|<br />09:05</th>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day1"]["1"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day1"]["1"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day1"]["1"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day1"]["1"]["classname"], "classID": table["day1"]["1"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day1"]["1"]["classname"]}
                                </div>
                                <div>{table["day1"]["1"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day2"]["1"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day2"]["1"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day2"]["1"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day2"]["1"]["classname"], "classID": table["day2"]["1"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day2"]["1"]["classname"]}
                                </div>
                                <div>{table["day2"]["1"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day3"]["1"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day3"]["1"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day3"]["1"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day3"]["1"]["classname"], "classID": table["day3"]["1"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day3"]["1"]["classname"]}
                                </div>
                                <div>{table["day3"]["1"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day4"]["1"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day4"]["1"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day4"]["1"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day4"]["1"]["classname"], "classID": table["day4"]["1"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day4"]["1"]["classname"]}
                                </div>
                                <div>{table["day4"]["1"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day5"]["1"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day5"]["1"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day5"]["1"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day5"]["1"]["classname"], "classID": table["day5"]["1"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day5"]["1"]["classname"]}
                                </div>
                                <div>{table["day5"]["1"]["teacher"]}</div>
                            </>)}
                        </td>
                        {showSat ? (
                            <td className={isBigScreen ? styles.data : styles.dataMobile}>
                                {isLoading ? (<></>) : (<>
                                    <div
                                        className={table["day6"]["1"].status ? styles.status : styles.status_hidden}
                                        style={{ "--backgroundColor": table["day6"]["1"].status === "調" ? "#007bff" : "#DB24BB" }}
                                    >
                                        {table["day6"]["1"].status}
                                    </div>
                                    <div
                                        className={styles.classname}
                                        onClick={() => {
                                            setDetail({ "name": table["day6"]["1"]["classname"], "classID": table["day6"]["1"]["classID"] });
                                            setShowDetail(true);
                                        }}
                                    >
                                        {table["day6"]["1"]["classname"]}
                                    </div>
                                    <div>{table["day6"]["1"]["teacher"]}</div>
                                </>)}
                            </td>
                        ) : (
                            <></>
                        )}
                    </tr>
                    <tr className={styles.classes}>
                        {isBigScreen ? <th className={join("noselect", styles.index)}>2</th> : <></>}
                        <th className={join("noselect", styles.indexMobile)}>09:15<br />|<br />10:05</th>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day1"]["2"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day1"]["2"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day1"]["2"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day1"]["2"]["classname"], "classID": table["day1"]["2"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day1"]["2"]["classname"]}
                                </div>
                                <div>{table["day1"]["2"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day2"]["2"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day2"]["2"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day2"]["2"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day2"]["2"]["classname"], "classID": table["day2"]["2"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day2"]["2"]["classname"]}
                                </div>
                                <div>{table["day2"]["2"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day3"]["2"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day3"]["2"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day3"]["2"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day3"]["2"]["classname"], "classID": table["day3"]["2"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day3"]["2"]["classname"]}
                                </div>
                                <div>{table["day3"]["2"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day4"]["2"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day4"]["2"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day4"]["2"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day4"]["2"]["classname"], "classID": table["day4"]["2"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day4"]["2"]["classname"]}
                                </div>
                                <div>{table["day4"]["2"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day5"]["2"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day5"]["2"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day5"]["2"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day5"]["2"]["classname"], "classID": table["day5"]["2"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day5"]["2"]["classname"]}
                                </div>
                                <div>{table["day5"]["2"]["teacher"]}</div>
                            </>)}
                        </td>
                        {showSat ? (
                            <td className={isBigScreen ? styles.data : styles.dataMobile}>
                                {isLoading ? (<></>) : (<>
                                    <div
                                        className={table["day6"]["2"].status ? styles.status : styles.status_hidden}
                                        style={{ "--backgroundColor": table["day6"]["2"].status === "調" ? "#007bff" : "#DB24BB" }}
                                    >
                                        {table["day6"]["2"].status}
                                    </div>
                                    <div
                                        className={styles.classname}
                                        onClick={() => {
                                            setDetail({ "name": table["day6"]["2"]["classname"], "classID": table["day6"]["2"]["classID"] });
                                            setShowDetail(true);
                                        }}
                                    >
                                        {table["day6"]["2"]["classname"]}
                                    </div>
                                    <div>{table["day6"]["2"]["teacher"]}</div>
                                </>)}
                            </td>
                        ) : (
                            <></>
                        )}
                    </tr>
                    <tr className={styles.classes}>
                        {isBigScreen ? <th className={join("noselect", styles.index)}>3</th> : <></>}
                        <th className={join("noselect", styles.indexMobile)}>10:15<br />|<br />11:05</th>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day1"]["3"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day1"]["3"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day1"]["3"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day1"]["3"]["classname"], "classID": table["day1"]["3"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day1"]["3"]["classname"]}
                                </div>
                                <div>{table["day1"]["3"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day2"]["3"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day2"]["3"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day2"]["3"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day2"]["3"]["classname"], "classID": table["day2"]["3"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day2"]["3"]["classname"]}
                                </div>
                                <div>{table["day2"]["3"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day3"]["3"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day3"]["3"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day3"]["3"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day3"]["3"]["classname"], "classID": table["day3"]["3"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day3"]["3"]["classname"]}
                                </div>
                                <div>{table["day3"]["3"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day4"]["3"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day4"]["3"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day4"]["3"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day4"]["3"]["classname"], "classID": table["day4"]["3"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day4"]["3"]["classname"]}
                                </div>
                                <div>{table["day4"]["3"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day5"]["3"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day5"]["3"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day5"]["3"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day5"]["3"]["classname"], "classID": table["day5"]["3"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day5"]["3"]["classname"]}
                                </div>
                                <div>{table["day5"]["3"]["teacher"]}</div>
                            </>)}
                        </td>
                        {showSat ? (
                            <td className={isBigScreen ? styles.data : styles.dataMobile}>
                                {isLoading ? (<></>) : (<>
                                    <div
                                        className={table["day6"]["3"].status ? styles.status : styles.status_hidden}
                                        style={{ "--backgroundColor": table["day6"]["3"].status === "調" ? "#007bff" : "#DB24BB" }}
                                    >
                                        {table["day6"]["3"].status}
                                    </div>
                                    <div
                                        className={styles.classname}
                                        onClick={() => {
                                            setDetail({ "name": table["day6"]["3"]["classname"], "classID": table["day6"]["3"]["classID"] });
                                            setShowDetail(true);
                                        }}
                                    >
                                        {table["day6"]["3"]["classname"]}
                                    </div>
                                    <div>{table["day6"]["3"]["teacher"]}</div>
                                </>)}
                            </td>
                        ) : (
                            <></>
                        )}
                    </tr>
                    <tr className={styles.classes}>
                        {isBigScreen ? <th className={join("noselect", styles.index)}>4</th> : <></>}
                        <th className={join("noselect", styles.indexMobile)}>11:15<br />|<br />12:05</th>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day1"]["4"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day1"]["4"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day1"]["4"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day1"]["4"]["classname"], "classID": table["day1"]["4"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day1"]["4"]["classname"]}
                                </div>
                                <div>{table["day1"]["4"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day2"]["4"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day2"]["4"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day2"]["4"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day2"]["4"]["classname"], "classID": table["day2"]["4"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day2"]["4"]["classname"]}
                                </div>
                                <div>{table["day2"]["4"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day3"]["4"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day3"]["4"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day3"]["4"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day3"]["4"]["classname"], "classID": table["day3"]["4"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day3"]["4"]["classname"]}
                                </div>
                                <div>{table["day3"]["4"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day4"]["4"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day4"]["4"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day4"]["4"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day4"]["4"]["classname"], "classID": table["day4"]["4"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day4"]["4"]["classname"]}
                                </div>
                                <div>{table["day4"]["4"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day5"]["4"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day5"]["4"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day5"]["4"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day5"]["4"]["classname"], "classID": table["day5"]["4"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day5"]["4"]["classname"]}
                                </div>
                                <div>{table["day5"]["4"]["teacher"]}</div>
                            </>)}
                        </td>
                        {showSat ? (
                            <td className={isBigScreen ? styles.data : styles.dataMobile}>
                                {isLoading ? (<></>) : (<>
                                    <div
                                        className={table["day6"]["4"].status ? styles.status : styles.status_hidden}
                                        style={{ "--backgroundColor": table["day6"]["4"].status === "調" ? "#007bff" : "#DB24BB" }}
                                    >
                                        {table["day6"]["4"].status}
                                    </div>
                                    <div
                                        className={styles.classname}
                                        onClick={() => {
                                            setDetail({ "name": table["day6"]["4"]["classname"], "classID": table["day6"]["4"]["classID"] });
                                            setShowDetail(true);
                                        }}
                                    >
                                        {table["day6"]["4"]["classname"]}
                                    </div>
                                    <div>{table["day6"]["4"]["teacher"]}</div>
                                </>)}
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
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day1"]["5"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day1"]["5"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day1"]["5"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day1"]["5"]["classname"], "classID": table["day1"]["5"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day1"]["5"]["classname"]}
                                </div>
                                <div>{table["day1"]["5"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day2"]["5"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day2"]["5"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day2"]["5"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day2"]["5"]["classname"], "classID": table["day2"]["5"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day2"]["5"]["classname"]}
                                </div>
                                <div>{table["day2"]["5"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day3"]["5"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day3"]["5"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day3"]["5"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day3"]["5"]["classname"], "classID": table["day3"]["5"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day3"]["5"]["classname"]}
                                </div>
                                <div>{table["day3"]["5"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day4"]["5"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day4"]["5"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day4"]["5"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day4"]["5"]["classname"], "classID": table["day4"]["5"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day4"]["5"]["classname"]}
                                </div>
                                <div>{table["day4"]["5"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day5"]["5"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day5"]["5"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day5"]["5"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day5"]["5"]["classname"], "classID": table["day5"]["5"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day5"]["5"]["classname"]}
                                </div>
                                <div>{table["day5"]["5"]["teacher"]}</div>
                            </>)}
                        </td>
                        {showSat ? (
                            <td className={isBigScreen ? styles.data : styles.dataMobile}>
                                {isLoading ? (<></>) : (<>
                                    <div
                                        className={table["day6"]["5"].status ? styles.status : styles.status_hidden}
                                        style={{ "--backgroundColor": table["day6"]["5"].status === "調" ? "#007bff" : "#DB24BB" }}
                                    >
                                        {table["day6"]["5"].status}
                                    </div>
                                    <div
                                        className={styles.classname}
                                        onClick={() => {
                                            setDetail({ "name": table["day6"]["5"]["classname"], "classID": table["day6"]["5"]["classID"] });
                                            setShowDetail(true);
                                        }}
                                    >
                                        {table["day6"]["5"]["classname"]}
                                    </div>
                                    <div>{table["day6"]["5"]["teacher"]}</div>
                                </>)}
                            </td>
                        ) : (
                            <></>
                        )}
                    </tr>
                    <tr className={styles.classes}>
                        {isBigScreen ? <th className={join("noselect", styles.index)}>6</th> : <></>}
                        <th className={join("noselect", styles.indexMobile)}>14:20<br />|<br />15:10</th>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day1"]["6"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day1"]["6"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day1"]["6"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day1"]["6"]["classname"], "classID": table["day1"]["6"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day1"]["6"]["classname"]}
                                </div>
                                <div>{table["day1"]["6"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day2"]["6"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day2"]["6"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day2"]["6"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day2"]["6"]["classname"], "classID": table["day2"]["6"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day2"]["6"]["classname"]}
                                </div>
                                <div>{table["day2"]["6"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day3"]["6"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day3"]["6"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day3"]["6"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day3"]["6"]["classname"], "classID": table["day3"]["6"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day3"]["6"]["classname"]}
                                </div>
                                <div>{table["day3"]["6"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day4"]["6"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day4"]["6"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day4"]["6"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day4"]["6"]["classname"], "classID": table["day4"]["6"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day4"]["6"]["classname"]}
                                </div>
                                <div>{table["day4"]["6"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day5"]["6"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day5"]["6"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day5"]["6"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day5"]["6"]["classname"], "classID": table["day5"]["6"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day5"]["6"]["classname"]}
                                </div>
                                <div>{table["day5"]["6"]["teacher"]}</div>
                            </>)}
                        </td>
                        {showSat ? (
                            <td className={isBigScreen ? styles.data : styles.dataMobile}>
                                {isLoading ? (<></>) : (<>
                                    <div
                                        className={table["day6"]["6"].status ? styles.status : styles.status_hidden}
                                        style={{ "--backgroundColor": table["day6"]["6"].status === "調" ? "#007bff" : "#DB24BB" }}
                                    >
                                        {table["day6"]["6"].status}
                                    </div>
                                    <div
                                        className={styles.classname}
                                        onClick={() => {
                                            setDetail({ "name": table["day6"]["6"]["classname"], "classID": table["day6"]["6"]["classID"] });
                                            setShowDetail(true);
                                        }}
                                    >
                                        {table["day6"]["6"]["classname"]}
                                    </div>
                                    <div>{table["day6"]["6"]["teacher"]}</div>
                                </>)}
                            </td>
                        ) : (
                            <></>
                        )}
                    </tr>
                    <tr className={styles.classes}>
                        {isBigScreen ? <th className={join("noselect", styles.index)}>7</th> : <></>}
                        <th className={join("noselect", styles.indexMobile)}>15:20<br />|<br />16:10</th>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day1"]["7"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day1"]["7"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day1"]["7"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day1"]["7"]["classname"], "classID": table["day1"]["7"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day1"]["7"]["classname"]}
                                </div>
                                <div>{table["day1"]["7"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day2"]["7"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day2"]["7"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day2"]["7"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day2"]["7"]["classname"], "classID": table["day2"]["7"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day2"]["7"]["classname"]}
                                </div>
                                <div>{table["day2"]["7"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day3"]["7"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day3"]["7"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day3"]["7"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day3"]["7"]["classname"], "classID": table["day3"]["7"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day3"]["7"]["classname"]}
                                </div>
                                <div>{table["day3"]["7"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day4"]["7"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day4"]["7"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day4"]["7"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day4"]["7"]["classname"], "classID": table["day4"]["7"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day4"]["7"]["classname"]}
                                </div>
                                <div>{table["day4"]["7"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day5"]["7"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day5"]["7"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day5"]["7"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day5"]["7"]["classname"], "classID": table["day5"]["7"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day5"]["7"]["classname"]}
                                </div>
                                <div>{table["day5"]["7"]["teacher"]}</div>
                            </>)}
                        </td>
                        {showSat ? (
                            <td className={isBigScreen ? styles.data : styles.dataMobile}>
                                {isLoading ? (<></>) : (<>
                                    <div
                                        className={table["day6"]["7"].status ? styles.status : styles.status_hidden}
                                        style={{ "--backgroundColor": table["day6"]["7"].status === "調" ? "#007bff" : "#DB24BB" }}
                                    >
                                        {table["day6"]["7"].status}
                                    </div>
                                    <div
                                        className={styles.classname}
                                        onClick={() => {
                                            setDetail({ "name": table["day6"]["7"]["classname"], "classID": table["day6"]["7"]["classID"] });
                                            setShowDetail(true);
                                        }}
                                    >
                                        {table["day6"]["7"]["classname"]}
                                    </div>
                                    <div>{table["day6"]["7"]["teacher"]}</div>
                                </>)}
                            </td>
                        ) : (
                            <></>
                        )}
                    </tr>
                    <tr className={styles.classes}>
                        {isBigScreen ? <th className={join("noselect", styles.index)}>8</th> : <></>}
                        <th className={join("noselect", styles.indexMobile)}>16:20<br />|<br />17:10</th>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day1"]["8"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day1"]["8"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day1"]["8"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day1"]["8"]["classname"], "classID": table["day1"]["8"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day1"]["8"]["classname"]}
                                </div>
                                <div>{table["day1"]["8"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day2"]["8"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day2"]["8"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day2"]["8"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day2"]["8"]["classname"], "classID": table["day2"]["8"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day2"]["8"]["classname"]}
                                </div>
                                <div>{table["day2"]["8"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day3"]["8"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day3"]["8"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day3"]["8"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day3"]["8"]["classname"], "classID": table["day3"]["8"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day3"]["8"]["classname"]}
                                </div>
                                <div>{table["day3"]["8"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day4"]["8"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day4"]["8"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day4"]["8"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day4"]["8"]["classname"], "classID": table["day4"]["8"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day4"]["8"]["classname"]}
                                </div>
                                <div>{table["day4"]["8"]["teacher"]}</div>
                            </>)}
                        </td>
                        <td className={isBigScreen ? styles.data : styles.dataMobile}>
                            {isLoading ? (<></>) : (<>
                                <div
                                    className={table["day5"]["8"].status ? styles.status : styles.status_hidden}
                                    style={{ "--backgroundColor": table["day5"]["8"].status === "調" ? "#007bff" : "#DB24BB" }}
                                >
                                    {table["day5"]["8"].status}
                                </div>
                                <div
                                    className={styles.classname}
                                    onClick={() => {
                                        setDetail({ "name": table["day5"]["8"]["classname"], "classID": table["day5"]["8"]["classID"] });
                                        setShowDetail(true);
                                    }}
                                >
                                    {table["day5"]["8"]["classname"]}
                                </div>
                                <div>{table["day5"]["8"]["teacher"]}</div>
                            </>)}
                        </td>
                        {showSat ? (
                            <td className={isBigScreen ? styles.data : styles.dataMobile}>
                                {isLoading ? (<></>) : (<>
                                    <div
                                        className={table["day6"]["8"].status ? styles.status : styles.status_hidden}
                                        style={{ "--backgroundColor": table["day6"]["8"].status === "調" ? "#007bff" : "#DB24BB" }}
                                    >
                                        {table["day6"]["8"].status}
                                    </div>
                                    <div
                                        className={styles.classname}
                                        onClick={() => {
                                            setDetail({ "name": table["day6"]["8"]["classname"], "classID": table["day6"]["8"]["classID"] });
                                            setShowDetail(true);
                                        }}
                                    >
                                        {table["day6"]["8"]["classname"]}
                                    </div>
                                    <div>{table["day6"]["8"]["teacher"]}</div>
                                </>)}
                            </td>
                        ) : (
                            <></>
                        )}
                    </tr>
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
                            "year": response.data["year"]
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
                            "year": response.data["year"]
                        }
                    }, "/table");
                }
                else {
                    throw Error("Failed to read data");
                };
            };
        }
        catch (error) {
            console.log(error.response.status);
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