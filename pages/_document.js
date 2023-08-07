import { Html, Head, Main, NextScript } from "next/document";
import { createGetInitialProps } from "@mantine/next";


const getInitialProps = createGetInitialProps();

export default function Document() {
    return (
        <Html lang="zh-TW">
            <Head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

                <meta name="author" content="OnCloud" />
                <meta name="theme-color" content="#2f3542" />
                <meta name="description" content="想快速看到明道課表嗎？ NewMD 課表提供更快速、更穩定的查詢，並擁有更好看的介面。快來試試吧！" />
                <meta name="copyright" content="Copyright (c) by OnCloud" />

                <meta httpEquiv="content-Type" content="text/html; charset=utf-8" />
                <meta httpEquiv="content-language" content="zh-TW" />
                <meta httpEquiv="widow-target" content="_top" />

                {/* <!-- Twitter --> */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="NewMD Timetable - Beautiful & Faster version of MDHS timetable" />
                <meta name="twitter:description" content="想快速看到明道課表嗎？ NewMD 課表提供更快速、更穩定的查詢，並擁有更好看的介面。快來試試吧！" />
                <meta name="twitter:site" content="@" />
                <meta name="twitter:creator" content="@" />
                <meta name="twitter:image" content="https://i.ibb.co/F4jtbXJ/Open-Graph.png" />

                {/* <!-- Open Graph --> */}
                <meta property="og:url" content="https://newmd.eu.org" />
                <meta property="og:title" content="NewMD Timetable - Beautiful & Faster version of MDHS timetable" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="想快速看到明道課表嗎？ NewMD 課表提供更快速、更穩定的查詢，並擁有更好看的介面。快來試試吧！" />
                <meta property="og:image" content="https://i.ibb.co/F4jtbXJ/Open-Graph.png" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

Document.getInitialProps = getInitialProps;