import { createContext, useState } from "react";


const SettingsContext = createContext({});
export default SettingsContext;

export function StateProvider() {
    const [color, setColor] = useState("#dee4fd");
    const [snowflakeCount, setSnowflakeCount] = useState(200);

    return (
        <SettingsContext.Provider
            value={{
                color,
                setColor,
                snowflakeCount,
                setSnowflakeCount
            }}
        ></SettingsContext.Provider>
    );
}
