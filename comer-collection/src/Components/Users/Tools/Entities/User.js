import { sendAuthenticatedRequest } from "../HelperMethods/APICalls.js";
import { Entity } from "./Entity.js";

class User extends Entity {
    static baseUrl = "/api/admin/users";
    static singular = "user";
    static plural = "users";

    static handleChangeUserAccess(userId, newAccess) {
        return new Promise((resolve, reject) => {
            sendAuthenticatedRequest("PUT", `${this.baseUrl}/${userId}/access`, { access_level: newAccess }).then(() => {
                resolve("User access updated");
            }).catch(() => {
                reject("Failed to update user access");
            });
        });
    }
}

export { User };