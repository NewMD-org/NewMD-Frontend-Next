import axios from "axios";


async function testAPI() {
    console.log("Refresh NewMD_API: start");

    var status0 = false;
    var status1 = false;

    var availableURL = [];

    try {
        const cloud0 = await axios.get("https://cloud0.newmd.eu.org/ping", {
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
        const cloud1 = await axios.get("https://cloud1.newmd.eu.org/ping", {
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

    console.log("Refresh NewMD_API: using " + availableURL[0]);

    return {
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
            status: null,
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
            };

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
            response["status"] = res.status;
            response["data"]["authorization"] = res.headers["authorization"];
            response["data"]["userDataStatus"] = res.data["userDataStatus"];
        }
        catch (err) {
            const errorMessageFilter = [
                "Missing Username",
                "Missing Password"
            ];

            const ststusCodeFilter = [
                400,
                401,
                500
            ];

            response["status"] = err.response?.status;

            if (errorMessageFilter.includes(err.message)) {
                response["message"] = err.message;
            }
            else if (ststusCodeFilter.includes(err.response?.status)) {
                response["message"] = err.response?.data;
            }
            else if (!err?.response) {
                response["message"] = "No Server Response";
            }
            else {
                response["message"] = "Unexpected Error";
            };
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