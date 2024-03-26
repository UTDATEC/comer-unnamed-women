import { Entity } from "./Entity.js";

class User extends Entity {
    static baseUrl = "/api/admin/users";
    static singular = "user";
    static plural = "users";
}

export { User };