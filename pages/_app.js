import { useState } from "react";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";

import Version from "../components/pages/global/Version";


export default function NewMD({ Component, pageProps }) {
    const [state, setState] = useState({});

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Component {...pageProps} state={state} setState={setState} />
            <Analytics />
            <Version />
        </>
    );
}