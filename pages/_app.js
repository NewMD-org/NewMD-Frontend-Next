import State from "../components/StateProvider.js";
import "../styles/globals.css";

function NewMD({ Component, pageProps }) {
    return (
        <State>
            <Component {...pageProps} />
        </State>
    );
}

export default NewMD;