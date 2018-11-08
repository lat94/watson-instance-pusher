import fetch from "node-fetch";

class GenericRequestService {
    constructor() {
        this.header = { "Content-Type": "application/json" };
    }

    _postPutDelete(address, method, body, header = this.header) {
        return fetch(address, {
            method: method,
            body: JSON.stringify(body),
            headers: header
        }).then(response => response.json())
        .catch(error => error);
    }

    put(address, body, header = this.header) {
        return this._postPutDelete(address, "PUT", body, header);
    }
    
    get(address, header = this.header) {
        return fetch(address, {
            method: "GET",
            headers: header
        }).then(response => response.json())
        .catch(error => error);
    }
}
export default new GenericRequestService();