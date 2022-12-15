import State from "../components/StateProvider.js";
import "../styles/globals.css";

function NewMD({ Component, pageProps }) {
    return (
        <State.Provider>
            <Component {...pageProps} />
        </State.Provider>
    );
}

export default NewMD;