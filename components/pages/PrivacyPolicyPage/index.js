import Image from "next/image";

import Message from "./components/Message";

import styles from "./PrivacyPolicyPage.module.css";


function join(...array) {
    return array.join(" ");
}

export default function PrivacyPolicyPage() {
    return (
        <div className={styles.background}>
            <Image className={join(styles.logo, "noselect")} alt="logo" src="/logo.svg" width={709} height={225} draggable="false" priority />
            <Message />
        </div>
    );
}