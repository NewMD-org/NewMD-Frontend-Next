import axios from "axios";


// const apiURL0 = "https://cloud0.newmd.eu.org/ping";
// const apiURL1 = "https://cloud1.newmd.eu.org/ping";

const apiURL0 = "http://127.0.0.1:3001";
const apiURL1 = "http://127.0.0.1:3001";

async function testAPI() {
    console.log("Refresh NewMD_API: start");

    let errorMsg = null;
    let status0 = false;
    let status1 = false;

    let availableURL = [];

    try {
        const cloud0 = await axios.get(`${apiURL0}/ping`, {
            timeout: 2 * 1000,
            validateStatus: function (status) {
                return status >= 200 && status < 500; // default
            }
        });

        if (cloud0.data.includes("Service is up")) {
            status0 = true;
            availableURL.push(cloud0.config?.url.replace("/ping", ""));
            console.log("Refresh NewMD_API: cloud0 available");
        }
        else {
            throw new Error("cloud0 unavailable");
        };
    } catch (_) {
        console.log("Refresh NewMD_API: cloud0 unavailable");
    };

    try {
        const cloud1 = await axios.get(`${apiURL1}/ping`, {
            timeout: 2 * 1000
        });

        if (cloud1.data.includes("Service is up")) {
            status1 = true;
            availableURL.push(cloud1.config?.url.replace("/ping", ""));
            console.log("Refresh NewMD_API: cloud1 available");
        }
        else {
            throw new Error("cloud1 unavailable");
        };
    } catch (_) {
        console.log("Refresh NewMD_API: cloud1 unavailable");
    };

    if (availableURL[0]) {
        console.log("Refresh NewMD_API: using " + availableURL[0]);
    }
    else {
        errorMsg = "Refresh NewMD_API: all services unavailable";
        console.log("Refresh NewMD_API: all services unavailable");
    }

    return {
        errorMsg,
        availableURL,
        availability: {
            "cloud0": status0,
            "cloud1": status1,
        }
    };
}

export default class NewMD_API {
    constructor(timeoutSec) {
        this.timeoutSeconds = timeoutSec * 1000 | 0;
    }

    async login(ID, PWD, rememberMe) {
        const response = {
            error: true,
            message: null,
            data: {
                authorization: null,
                userDataStatus: null
            }
        };

        try {
            if (ID === "") {
                throw new Error("Missing Username");
            }
            else if (PWD === "") {
                throw new Error("Missing Password");
            }

            const res = await axios.post((await testAPI()).availableURL[0] + "/users/login",
                JSON.stringify({ ID, PWD, rememberMe }),
                {
                    timeout: this.timeoutSeconds,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            response["error"] = false;
            response["message"] = res.data["message"];
            response["data"]["authorization"] = res.headers["authorization"];
            response["data"]["userDataStatus"] = res.data["userDataStatus"];
        }
        catch (err) {
            const ststusCodeFilter = [
                400,
                401,
                500
            ];

            if (ststusCodeFilter.includes(err.response?.status)) {
                response["message"] = err.response?.data["message"];
            }
            else if (!err?.response) {
                response["message"] = "No Server Response";
            }
            else {
                response["message"] = "Unexpected Error";
            }
        };

        return response;
    }

    async table(jwt) {
        return await axios.get((await testAPI()).availableURL[0] + "/table?meetURL=false",
            {
                timeout: this.timeoutSeconds,
                headers: {
                    "Authorization": jwt,
                },
            }
        );
    }

    async viewvt(year, classID) {
        return await axios.get((await testAPI()).availableURL[0] + `/viewvt?year=${year}&classID=${classID}`,
            {
                timeout: this.timeoutSeconds,
            }
        );
    }

    async read(jwt) {
        return await axios.get((await testAPI()).availableURL[0] + "/database/read",
            {
                timeout: this.timeoutSeconds,
                headers: {
                    "Authorization": jwt,
                },
            }
        );
    }

    async save(jwt) {
        return await axios.get((await testAPI()).availableURL[0] + "/database/save",
            {
                timeout: this.timeoutSeconds,
                headers: {
                    "Authorization": jwt,
                },
            }
        );
    }

    async delete(jwt) {
        return await axios.get((await testAPI()).availableURL[0] + "/database/delete",
            {
                timeout: this.timeoutSeconds,
                headers: {
                    "Authorization": jwt,
                },
            }
        );
    }
}