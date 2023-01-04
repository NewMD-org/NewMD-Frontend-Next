import { useEffect, useState } from "react";
import { hasCookie, getCookie, setCookie } from "cookies-next";

import NavbarTop from "./components/NavbarTop";
import ClassesTable from "./components/ClassesTable";
import Loader from "./components/Loader";
import Christmas from "../../Themes/Christmas";

import styles from "./Table.module.css";


function controlTheme(themeName, setThemeFunction) {
    const themeNameFilter = [
        "Christmas",
        // "NewYear"
    ];
    if (!themeNameFilter.includes(themeName)) return false;

    if (hasCookie("theme") && (typeof (JSON.parse(getCookie("theme") || "{}")) === "object")) {
        const themeCookie = JSON.parse(getCookie("theme") || "{}");
        if (Object.values(themeCookie).filter(value => typeof (value) === "boolean")) {
            setCookie(
                "theme",
                themeCookie,
                {
                    path: "/",
                    maxAge: 60 * 60 * 24 * 400,
                }
            );
            return setThemeFunction(themeCookie[themeName]);
        }
    }
    else {
        setCookie(
            "theme",
            JSON.stringify({
                "Christmas": false
            }),
            {
                path: "/",
                maxAge: 60 * 60 * 24 * 400,
            }
        );
    }

    // Add schedule here
    return setThemeFunction(false);
}

export default function TablePage({ state, authorization }) {
    const [isLoading, setIsLoading] = useState(true);
    const [enableChristmas, setEnableChristmas] = useState(false);

    useEffect(() => {
        console.log(getCookie("theme") || "{}");
        controlTheme("Christmas", setEnableChristmas);
    }, []);

    function _setEnableChristmas(checked) {
        setEnableChristmas(checked);
        if (checked) {
            var newThemeCookie = JSON.parse(getCookie("theme") || "{}");
            newThemeCookie["Christmas"] = true;
            setCookie(
                "theme",
                JSON.stringify(newThemeCookie),
                {
                    path: "/",
                    maxAge: 60 * 60 * 24 * 400,
                }
            );
        }
        else {
            var newThemeCookie = JSON.parse(getCookie("theme") || "{}");
            newThemeCookie["Christmas"] = false;
            setCookie(
                "theme",
                JSON.stringify(newThemeCookie),
                {
                    path: "/",
                    maxAge: 60 * 60 * 24 * 400,
                }
            );
        }
    }

    return (
        <>
            <div className={styles.background}>
                {isLoading ? <Loader /> : <></>}
                <NavbarTop state={state} authorization={authorization} enableChristmas={enableChristmas} _setEnableChristmas={_setEnableChristmas} />
                <ClassesTable isLoading={isLoading} setIsLoading={setIsLoading} state={state} authorization={authorization} enableSnow={enableChristmas} />
                {enableChristmas ? <Christmas /> : <></>}
            </div>
        </>
    );
};