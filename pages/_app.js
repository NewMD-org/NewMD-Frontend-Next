import { useState } from "react";
import Head from "next/head";

import "../styles/globals.css";


function NewMD({ Component, pageProps }) {
    const [state, setState] = useState({});

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Component {...pageProps} state={state} setState={setState} />
        </>
    );
}

export default NewMD;