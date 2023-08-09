import axios from "axios";


const apiURLs = ["https://cloud0.newmd.eu.org", "https://cloud1.newmd.eu.org"];

async function testAPI() {
    const availableURLs = await Promise.all(apiURLs.map(async url => {
        try {
            const response = await axios.get(`${url}/ping`, {
                timeout: 2 * 1000,
                validateStatus: status => status >= 200 && status < 500
            });

            if (response.data["service"] === "up") {
                console.log(`Refresh NewMD_API: ${url} available`);
                return url;
            }
        }
        catch (_) {
            console.log(`Refresh NewMD_API: ${url} unavailable`);
        }
    }));

    const availableURL = availableURLs.find(Boolean);

    if (!availableURL) {
        console.log("Refresh NewMD_API: all services unavailable");
        throw new Error("All services unavailable");
    }

    console.log("Refresh NewMD_API: using " + availableURL);

    return {
        availableURL,
        availability: availableURLs.reduce((acc, url, idx) => ({ ...acc, [`cloud${idx}`]: Boolean(url) }), {})
    };
}

export default class NewMD_API {
    constructor(timeoutSec) {
        this.timeoutSeconds = timeoutSec * 1000 | 0;
        this.api = null;
    }

    async init() {
        this.api = await testAPI();
    }

    async request(method, url, data, jwt) {
        const headers = jwt ? { "Authorization": jwt } : {};
        if (data) headers["Content-Type"] = "application/json";
        return await axios({
            method,
            url: this.api.availableURL + url,
            data,
            timeout: this.timeoutSeconds,
            headers,
        });
    }

    async ping() {
        const res = await this.request("get", "/ping");
        return res.data;
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
            response["message"] = "請輸入身份證字號";
            return response;
        }
        else if (PWD === "") {
            response["message"] = "請輸入密碼";
            return response;
        }
        else if (!isValidID(ID)) {
            response["message"] = "請輸入有效的身份證字號";
            return response;
        }

        try {
            const data = { ID, PWD, rememberMe };
            const res = await this.request("post", "/users/login", data, null);

            response["error"] = false;
            response["message"] = res.data["message"];
            response["data"]["authorization"] = res.headers["authorization"];
            response["data"]["userDataStatus"] = res.data["userDataStatus"];
        }
        catch (error) {
            if (error.response?.status === 401) {
                response["message"] = "身份證字號或密碼錯誤";
            }
            else {
                response["message"] = "發生錯誤，請再試一次";
            }
        };

        return response;
    }

    async table(jwt) {
        const res = await this.request("get", "/table?meetURL=false", null, jwt);
        return res;
    }

    async viewvt(year, classID) {
        const res = await this.request("get", `/viewvt?year=${year}&classID=${classID}`);
        return res;
    }

    async read(jwt) {
        const res = await this.request("get", "/database/read", null, jwt);
        return res;
    }

    async save(jwt) {
        const res = await this.request("get", "/database/save", null, jwt);
        return res;
    }

    async delete(jwt) {
        const res = await this.request("get", "/database/delete", null, jwt);
        return res;
    }

    async suggestClassname(original, replacement, jwt) {
        const data = { original, replacement };
        const res = await this.request("post", "/classnamesuggestion", data, jwt);
        return res;
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