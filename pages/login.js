import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import cookie from "react-cookies";
import NewMD_API from "./api/NewMD_API";
import LoginPage from "../components/Login/index";
import { Loader } from "../components/Login/components/Loader";
import { useRouter } from "next/router";


function isValidAuth() {
    try {
        return [
            typeof (localStorage.getItem("authorization")) === "string",
            JSON.stringify(Object.keys(jwt_decode(localStorage.getItem("authorization")))) === JSON.stringify(["userID", "userPWD", "rememberMe", "iat", "exp"]),
            jwt_decode(localStorage.getItem("authorization")).exp >= (new Date().getTime() / 1000)
        ].every(test => test === true);
    }
    catch (err) {
        return false;
    };
}

export default function Login({ state, setState }) {
    const router = useRouter();

    const [success, setSuccess] = useState(false);
    const [isLoading, setLoading] = useState(true);
    // const [userDataStatus, setUserDataStatus] = useState("false");

    const autoLogin = async () => {
        console.log("Auto login : start");
        const t0 = performance.now();
        try {
            if (isValidAuth()) {
                console.log("Local Storage - authorization : found");
                const rememberMe = jwt_decode(localStorage.getItem("authorization")).rememberMe === "true";
                const ID = jwt_decode(localStorage.getItem("authorization")).userID;
                const PWD = jwt_decode(localStorage.getItem("authorization")).userPWD;

                if (cookie.load("navigate") === "true") {
                    console.log("Cookie - navigate : found");
                    const response = await new NewMD_API(10).login(ID, PWD, rememberMe.toString());
                    if (response["error"] === false) {
                        localStorage.setItem("authorization", response["data"]["authorization"]);
                        cookie.save("navigate", "true", { path: "/", maxAge: 60 * 60 * 24 * 7 });
                        const t1 = performance.now();
                        console.log(`Auto login : success (took ${Math.round(t1 - t0) / 1000} seconds)`);
                        setState();
                        router.push({
                            pathname: "/table",
                            query: { "userDataStatus": response["data"]["userDataStatus"] }
                        }, "/table");
                    }
                    else {
                        throw Error("joanne is smart");
                    };
                }
                else {
                    cookie.remove("navigate");
                    console.log("Cookie - navigate : not found");
                    console.log("Auto login : failed");

                    setLoading(false);
                    return setSuccess(false);
                };
            }
            else {
                throw new Error("Local Storage - authorization : invalid");
            };
        }
        catch (err) {
            console.log(err.message);
            console.log("Auto login : failed");
            console.log("Clear local storage and cookie");

            localStorage.clear();
            cookie.remove("navigate");
            setLoading(false);
            return setSuccess(false);
        };
    };

    useEffect(() => {
        autoLogin();
        // setSuccess(false);
        // setLoading(true);
    }, []);

    return (
        isLoading ? (
            <Loader />
        ) : (
            <LoginPage />
            // success ? (
            //     router.push("/table")
            // ) : (
            //     <LoginPage />
            // )
        )
    );
}