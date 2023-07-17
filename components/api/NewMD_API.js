import axios from "axios";


const apiURL0 = "https://cloud0.newmd.eu.org";
const apiURL1 = "https://cloud1.newmd.eu.org";

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

        if (cloud0.data["service"] === "up") {
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

        if (cloud1.data["service"] === "up") {
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

    async ping() {
        let res = {
            "service": String,
            "uptime": String,
            "version": {
                "current": String,
                "latest": String,
                "upToDate": Boolean
            }
        };

        res = (await axios.get((await testAPI()).availableURL[0] + "/ping",
            {
                timeout: this.timeoutSeconds,
            }
        )).data;

        return res;
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

        if (ID === "") {
            response["message"] = "Missing Username";
            return response;
        }
        else if (PWD === "") {
            response["message"] = "Missing Password";
            return response;
        }
        else if (!isValidID(ID)) {
            response["message"] = "Invalid ID";
            return response;
        }

        try {
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
            const statusCodeFilter = [
                400,
                401,
                500
            ];

            if (statusCodeFilter.includes(err.response?.status)) {
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

function isValidID(id) {
    let studIdNumber = id.toUpperCase();

    if (studIdNumber.length != 10) {
        return false;
    }
    if (isNaN(studIdNumber.substr(1, 9)) || (!/^[A-Z]$/.test(studIdNumber.substr(0, 1)))) {
        return false;
    }

    var idHeader = "ABCDEFGHJKLMNPQRSTUVXYWZIO";

    studIdNumber = (idHeader.indexOf(studIdNumber.substring(0, 1)) + 10) + "" + studIdNumber.substr(1, 9);
    let s = parseInt(studIdNumber.substr(0, 1)) +
        parseInt(studIdNumber.substr(1, 1)) * 9 +
        parseInt(studIdNumber.substr(2, 1)) * 8 +
        parseInt(studIdNumber.substr(3, 1)) * 7 +
        parseInt(studIdNumber.substr(4, 1)) * 6 +
        parseInt(studIdNumber.substr(5, 1)) * 5 +
        parseInt(studIdNumber.substr(6, 1)) * 4 +
        parseInt(studIdNumber.substr(7, 1)) * 3 +
        parseInt(studIdNumber.substr(8, 1)) * 2 +
        parseInt(studIdNumber.substr(9, 1));

    let checkNum = parseInt(studIdNumber.substr(10, 1));
    if ((s % 10) == 0 || (10 - s % 10) == checkNum) {
        return true;
    }
    else {
        return false;
    }
}