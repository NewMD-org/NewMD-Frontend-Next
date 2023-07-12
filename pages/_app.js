import { useState, useEffect } from "react";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { MantineProvider } from "@mantine/core";
import Script from "next/script";
import { useRouter } from "next/router";

import Version from "../components/pages/global/Version";
import gtag from "../gtag";

import "../styles/globals.css";


export default function NewMD({ Component, pageProps }) {
    const [state, setState] = useState({});
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = url => {
            gtag.pageView(url);
        };
        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [router.events]);

    return (
        <>
            <Analytics />
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
            />
            <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.GA_TRACKING_ID}', {
                        page_path: window.location.pathname,
                    });
                    `
                }}
            />
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