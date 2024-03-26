import { Entity } from "./Entity.js";

class Exhibition extends Entity {
    static baseUrl = "/api/admin/exhibitions";
    static singular = "exhibition";
    static plural = "exhibitions";

    static handleMultiCreate() {
        return Promise.reject("MultiCreate is not allowed for exhibitions");
    }
}

class MyExhition extends Exhibition {
    static baseUrl = "/api/user/exhibitions";
}

export { Exhibition, MyExhition };