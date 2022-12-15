import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
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
                    Welcome to <a href="https://nextjs.org">Next.js!</a>
                </h1>

                <p className={styles.description}>
                    Get started by editing{" "}
                    <code className={styles.code}>pages/index.js</code>
                </p>

                <div className={styles.grid}>
                    <a href="https://nextjs.org/docs" className={styles.card}>
                        <h2>Documentation &rarr;</h2>
                        <p>Find in-depth information about Next.js features and API.</p>
                    </a>

                    <a href="https://nextjs.org/learn" className={styles.card}>
                        <h2>Learn &rarr;</h2>
                        <p>Learn about Next.js in an interactive course with quizzes!</p>
                    </a>

                    <a
                        href="https://github.com/vercel/next.js/tree/canary/examples"
                        className={styles.card}
                    >
                        <h2>Examples &rarr;</h2>
                        <p>Discover and deploy boilerplate example Next.js projects.</p>
                    </a>

                    <a
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.card}
                    >
                        <h2>Deploy &rarr;</h2>
                        <p>
                            Instantly deploy your Next.js site to a public URL with Vercel.
                        </p>
                    </a>
                </div>
            </main>

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
        </div>
    );
}