import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "./Home.module.css";


export default function HomePage() {
    return (
        <div className={styles.container}>
            <Head>
                <meta charset="utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
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
                <meta name="keywords" Lang="EN" content="NewMD, Timetable, Mingdao, MDHS" />
                <meta name="keywords" Lang="zh-TW" content="NewMD, 課表, 明道, 明道中學" />
                <meta name="distribution" content="local" />
                <meta name="revisit-after" content="1" />

                {/* <!-- Twitter --> */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="NewMD Timetable - Beautiful & Faster version of MDHS timetable" />
                <meta name="twitter:description" content="想快速看到明道課表嗎？ NewMD 課表提供更快速、更穩定的查詢，並擁有更好看的介面。快來試試吧！" />
                <meta name="twitter:site" content="@" />
                <meta name="twitter:creator" content="@" />
                <meta name="twitter:image" content="https://i.imgur.com/tPYMyLP.png" />

                {/* <!-- Open Graph --> */}
                <meta property="og:url" content="https://newmd.eu.org" />
                <meta property="og:title" content="NewMD Timetable - Beautiful & Faster version of MDHS timetable" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="想快速看到明道課表嗎？ NewMD 課表提供更快速、更穩定的查詢，並擁有更好看的介面。快來試試吧！" />
                <meta property="og:image" content="https://i.imgur.com/tPYMyLP.png" />

                {/* <!-- http-equiv --> */}


            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to <a href="https://nextjs.org">NewMD</a> !
                </h1>

                <p className={styles.description}>
                    a beautiful & faster version of MDHS timetable website.
                </p>

                <div className={styles.grid}>
                    <Link href="/login" className={styles.card} >
                        <h2>Login &rarr;</h2>
                        <p>
                            Login to NewMD timetable.
                        </p>
                    </Link>
                </div>
            </main >

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{" "}
                    <span className={styles.logo}>
                        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                    </span>
                </a>
            </footer>
        </div >
    );
}