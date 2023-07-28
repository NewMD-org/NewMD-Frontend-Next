import styles from "./AccountSwitch.module.css";


export default function AccountSwitch({ rightText, leftText, checked = false, onChange }) {
    return (
        <div className={styles.switch} style={{ "--switchRightText": "'" + rightText + "'" }}>
            <input className={styles.switchCheckbox} type="checkbox" checked={checked} onChange={onChange} />
            <label className={styles.switchLabel} htmlFor="">
                <span className={styles.switchText}>{leftText}</span>
            </label>
        </div>
    );
}