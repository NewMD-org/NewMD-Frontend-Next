import Head from "next/head";

import HomePage from "../components/pages/HomePage";


export default function Home() {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <title>NewMD Timetable - Beautiful & Faster version of MDHS timetable</title>
                <meta name="author" content="OnCloud" />
                <meta name="theme-color" content="#2f3542" />
                <meta name="description" content="想快速看到明道課表嗎？ NewMD 課表提供更快速、更穩定的查詢，並擁有更好看的介面。快來試試吧！" />
                <meta name="copyright" content="Copyright (c) by OnCloud" />

                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/logo192.png" />
                <link rel="manifest" href="/manifest.json" />

                {/* <!-- Search Engine Optimization --> */}
                <meta name="keywords" lang="EN" content="NewMD, Timetable, Mingdao, MDHS" />
                <meta name="keywords" lang="zh-TW" content="NewMD, 課表, 明道, 明道中學" />
                <meta name="distribution" content="local" />
                <meta name="revisit-after" content="1" />
            </Head>
            <HomePage />
        </>
    );
}