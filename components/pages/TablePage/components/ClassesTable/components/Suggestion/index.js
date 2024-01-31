import { useCallback, useEffect, useState } from "react";
import { Modal, Tooltip } from "@mantine/core";

import styles from "./Suggestion.module.css";


export default function Suggestion({ opened, onClose, original }) {
    return (
        <Modal
            title={"修改:" + original}
            centered
            radius="md"
            className={styles.modal_container}
            styles={{
                content: { background: "linear-gradient(90deg,#243342,#362d53)" },
                header: { background: "transparent" },
                body: { background: "transparent" }
            }}
            overlayProps={{
                opacity: 0,
                zIndex: 201
            }}
            transitionProps={{
                transition: "pop",
                duration: 200,
                timingFunction: "linear"
            }}

            opened={opened}
            onClose={onClose}
        >

        </Modal>
    );
}