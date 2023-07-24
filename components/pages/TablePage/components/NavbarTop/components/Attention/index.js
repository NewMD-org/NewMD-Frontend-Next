import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import NewMD_API from "../../../../../../api/NewMD_API";

import styles from "./Attention.module.css";


function join(...array) {
    return array.join(" ");
}

export default function Attention({ setIsLoading, setShowAttention, setUserDataStatus, authorization }) {
    const router = useRouter();

    const [agree, setAgree] = useState(false);

    const saveData = async (token) => {
        setIsLoading(true);
        try {
            console.log("Save user data : start");
            const t0 = performance.now();
            const response = await new NewMD_API(60).save(token);
            if (response.status === 200) {
                const response = await new NewMD_API(40).read(token);
                if (response.status === 200) {
                    setUserDataStatus("true");
                    const t1 = performance.now();
                    console.log(`Save user data : success (took ${Math.round(t1 - t0) / 1000} seconds)`);
                    sessionStorage.setItem("userDataStatus", "true");
                    console.log(response.data["table"]);
                    return router.replace({
                        pathname: "/table",
                        query: {
                            "userDataStatus": "true",
                            "table": JSON.stringify(response.data["table"]),
                            "year": response.data["year"]
                        }
                    }, "/table");
                }
                else {
                    throw Error("Joanne is smart");
                };
            }
            else {
                throw Error("Joanne is smart");
            };
        }
        catch (err) {
            setUserDataStatus("false");
            if (!err?.response) {
                console.log("Save user data : no server response");
            };
            console.log("Save user data : failed");
        }
        finally {
            setIsLoading(false);
        };
    };

    const closeModal = useCallback(_ => {
        setAgree(false);
        setShowAttention(false);
    }, [setShowAttention]);

    useEffect(() => {
        if (agree === true) {
            saveData(authorization);
            closeModal();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [agree]);

    return (
        <div className={join(styles.modal_container, "noselect")}>
            <div className={styles.outside_close} onClick={() => closeModal()}></div>
            <div className={join(styles.modal, "fadeIn")} style={{ "--fadeInDuration": "1s" }}>
                <h1 className={styles.modal__title}>注意 !</h1>
                <p className={styles.modal__text}>啟用儲存功能可以加快課表的讀取速度，不過您的身份證字號和密碼會被儲存在我們的伺服器以便我們更新您的課表</p>
                <p className={styles.modal__footer}>請查看 <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" title="Privacy Policy">隱私權條款</a> 來了解更多資訊</p>
                <div className={styles.button_container}>
                    <button className={styles.button_cancel} onClick={() => closeModal()}>取消</button>
                    <button className={styles.button_continue} onClick={() => setAgree(true)}>確認</button>
                </div>
            </div>
        </div >
    );
}