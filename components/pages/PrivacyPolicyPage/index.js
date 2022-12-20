import Image from "next/image";

import Message from "./components/Message";

import styles from "./PrivacyPolicyPage.module.css";
import logo from "./logo.svg";


function join(...array) {
    return array.join(" ");
}

export default function PrivacyPolicyPage() {
    return (
        <div className={styles.background}>
            <Image className={styles.backgroundImage} alt="background image" src="/background.svg" draggable="false" fill />
            <Image className={join(styles.logo, "noselect")} alt="logo" src={logo} draggable="false" />
            <Message />
        </div>
    );
}