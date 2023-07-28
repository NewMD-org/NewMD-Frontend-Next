import { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";

import NavbarTop from "./components/NavbarTop";
import ClassesTable from "./components/ClassesTable";
import Loader from "./components/Loader";
import Christmas from "../../Themes/Christmas";


const themeNameFilter = [
    "聖誕節"
];

export default function TablePage({ state, authorization }) {
    const [isLoading, setIsLoading] = useState(true);
    const [decoration, setDecoration] = useState();
    const [retryTimes, setRetryTimes] = useState(0);

    useEffect(() => {
        const themeName = getCookie("theme");
        if (themeNameFilter.includes(themeName)) {
            setDecoration(themeName);
        }
    }, []);

    useEffect(() => {
        console.log("Selected decoration : " + decoration);
        setCookie(
            "theme",
            decoration,
            {
                path: "/",
                maxAge: 60 * 60 * 24 * 400,
            }
        );
    }, [decoration]);

    return (
        <>
            {isLoading ? <Loader retryTimes={retryTimes} /> : <></>}
            <NavbarTop state={state} authorization={authorization} decoration={decoration} setDecoration={setDecoration} />
            <ClassesTable isLoading={isLoading} setIsLoading={setIsLoading} state={state} authorization={authorization} decoration={decoration} retryTimes={retryTimes} setRetryTimes={setRetryTimes} />
            {(() => {
                switch (decoration) {
                    case "聖誕節": {
                        return Christmas();
                    }
                    default: {
                        return;
                    }
                }
            })()}
        </>
    );
}