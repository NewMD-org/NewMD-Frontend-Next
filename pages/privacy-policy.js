import Head from "next/head";

import PrivacyPolicyPage from "../components/pages/PrivacyPolicyPage";


export default function PrivacyPolicy() {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <title>隱私權條款 | NewMD</title>
                <meta name="author" content="OnCloud" />
                <meta name="theme-color" content="#2f3542" />
                <meta name="description" content="隱私權政策。" />
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
            <PrivacyPolicyPage />
        </>
    );
}