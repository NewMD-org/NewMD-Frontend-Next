

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head>
                <meta charset="utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <meta name="author" content="OnCloud" />
                <meta name="theme-color" content="#2f3542" />
                <meta name="copyright" content="Copyright (c) by OnCloud" />

                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta http-equiv="content-language" content="zh-TW" />
                <meta http-equiv="widow-target" Content="_top" />
                {/* <meta http-equiv="Content-Security-Policy" content={`
                default-src
                    "self"
                    *.cloudfront.net;
                img-src
                    *;
                child-srcP
                    "none";
                style-src
                    "self"
                    "unsafe-inline"
                    fonts.googleapis.com
                    cdn.jsdelivr.net
                    *.cloudfront.net;
                font-src
                    "self"
                    data:
                    fonts.gstatic.com;
                connect-src
                    *.newmd.eu.org
                    raw.githubusercontent.com
                    ws:;
                `} /> */}

                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat&display=optional" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretty-checkbox@3.0/dist/pretty-checkbox.min.css" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.2.1/dist/css/bootstrap.min.css"
                    integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous" />
            </Head>
            <body>
                <noscript>

                    <div class="noscriptBackground">
                        <h1 class="noscriptText">
                            We're sorry but NewMD doesn't work properly without JavaScript enabled. Please enable it to continue.
                        </h1>
                    </div>
                </noscript>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}