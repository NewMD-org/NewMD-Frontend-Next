import { useState } from "react";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { MantineProvider } from "@mantine/core";

import Version from "../components/pages/global/Version";

import "../styles/globals.css";


export default function NewMD({ Component, pageProps }) {
    const [state, setState] = useState({});

    return (
        <>
            <Analytics />
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme: "dark",
                }}
            >
                <Component {...pageProps} state={state} setState={setState} />
                <Version />
            </MantineProvider>
        </>
    );
}