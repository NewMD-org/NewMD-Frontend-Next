import Head from "next/head";

import styles from "./English.module.css";


export default function English() {
    return (
        <>
            <Head>
                <title>Privacy Policy | NewMD</title>
            </Head>
            <div className={styles.markdown_cntainer}>
                <h1 className={styles.atx} id="private-policy">Private Policy</h1>
                <p>Welcome to NewMD. In this Privacy Policy, we’ve provided detailed information on when and why we collect personal
                    information, how we use it, the limited conditions under which we may disclose it to others, and how we keep it
                    secure.</p>
                <h2 className={styles.atx} id="1who-we-are">1.Who We Are</h2>
                <ul>
                    <li>At newmd.eu.org, we are committed to maintaining the trust and confidence of all visitors to our web site. In
                        particular, we want you to know that newmd.eu.org is not in the business of selling, renting or trading email
                        lists with other companies and businesses for marketing purposes.</li>
                    <li>We take your privacy seriously and take measures to provide all visitors and users of newmd.eu.org with a safe
                        and secure environment.</li>
                </ul>
                <h2 className={styles.atx} id="2data-collection">2.Data Collection</h2>
                <ul>
                    <li>When someone visits newmd.eu.org, there may be an ability to submit comments on particular articles or pages.
                        When comments are submitted, you are entitled to use aliases or information that completely hides your identity.
                        When a comment is submitted, the relevant details (account, password) that you provide are stored.&nbsp; These
                        details are stored so that we can display your comment back to you, and to anyone viewing the comment sections
                        on the site. We do not verify information entered nor do we require verification.</li>
                </ul>
                <h2 className={styles.atx} id="3cookies">3.Cookies</h2>
                <ul>
                    <li>newmd.eu.org may set and access newmd.eu.org cookies on your computer. Cookies are used to provide our system
                        with the basic information to provide the services you are requesting. Cookies can be cleared at any time from
                        your internet browser settings.</li>
                </ul>
                <h2 className={styles.atx} id="4third-parties">4.Third Parties</h2>
                <ul>
                    <li>There may be some circumstances where your IP address, geographic location, and other browser related details
                        may be shared with third party companies.&nbsp; We may share your above mentioned data with following third
                        party companies from time to time.</li>
                </ul>
                <h2 className={styles.atx} id="5access-to-your-personal-information">5.Access to Your Personal Information</h2>
                <ul>
                    <li>You are entitled to view, amend, or delete the personal information that we hold. Please cocntact Discord:<a
                        title="Discord" href="https://discord.com/users/755269122597585018">꧁AAAA꧂#2713</a> and we will work with you
                        to remove any of your personal data we may have.</li>
                </ul>
                <h2 className={styles.atx} id="6changes-to-our-privacy-policy">6.Changes to Our Privacy Policy</h2>
                <ul>
                    <li>We may make changes to our Privacy Policy in the future, however, the most current version of the policy will
                        govern our processing of your personal data and will always be available to you.</li>
                </ul>
            </div>
        </>
    );
}