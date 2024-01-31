import { useRouter } from "next/router";
import { useEffect } from "react";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import NewMD_API from "../../../../../../api/NewMD_API";

import styles from "./Attention.module.css";


export default function Attention({ setIsLoading, showAttention, setShowAttention, setUserDataStatus, authorization }) {
    const router = useRouter();

    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        if (showAttention) {
            open();
        }
        else {
            close();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAttention]);

    return (
        <Modal
            title="注意!"
            centered
            radius="md"
            className={styles.modal_container}
            styles={{
                content: { background: "linear-gradient(90deg,#243342,#362d53)" },
                header: { background: "transparent" },
                body: { background: "transparent" }
            }}
            overlayProps={{
                color: "#000000",
                opacity: 0.55,
                blur: 3,
            }}
            transitionProps={{
                transition: "pop",
                duration: 200,
                timingFunction: "linear"
            }}

            opened={opened}
            onClose={() => setShowAttention(false)}
        >
            <p className={styles.modal__text}>啟用儲存功能可以加快課表的讀取速度，不過您的身份證字號和密碼會被我們儲存，以便更新您的課表</p>
            <p className={styles.modal__footer}>請查看 <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" title="Privacy Policy">隱私權條款</a> 來了解更多資訊</p>
            <div className={styles.button_container}>
                <button className={styles.button_cancel} onClick={() => setShowAttention(false)}>取消</button>
                <button className={styles.button_continue} onClick={() => {
                    saveData(authorization);
                    setShowAttention(false);
                }}>確認</button>
            </div>
        </Modal>
    );

    async function saveData(token) {
        const API_60s = new NewMD_API(60);
        await API_60s.init();
        const API_40s = new NewMD_API(40);
        await API_40s.init();

        setIsLoading(true);
        try {
            const t0 = performance.now();
            const saveResponse = await API_60s.save(token);
            if (saveResponse.status === 200) {
                const readResponse = await API_40s.read(token);
                if (readResponse.status === 200) {
                    setUserDataStatus("true");
                    const t1 = performance.now();
                    sessionStorage.setItem("userDataStatus", "true");
                    return router.replace({
                        pathname: "/table",
                        query: {
                            "userDataStatus": "true",
                            "table": JSON.stringify(readResponse.data["table"]),
                            "year": readResponse.data["year"],
                            "updateAt": readResponse.data["updatedAt"]
                        }
                    }, "/table");
                }
                else {
                    throw new Error("Failed to read user data after save");
                };
            }
            else {
                throw new Error("Failed to save user data");
            };
        }
        catch (err) {
            setUserDataStatus("false");
            if (!err?.response) {
                console.error("Save user data: no server response");
            }
            console.error("Save user data: failed");
        }
        finally {
            setIsLoading(false);
        };
    };
}