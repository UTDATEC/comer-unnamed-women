import { sendAuthenticatedRequest } from "../HelperMethods/APICalls.js";

export const capitalized = (string) => {
    return string.substr(0, 1).toUpperCase() + string.substr(1).toLowerCase();
};

class Entity {

    static baseUrl = null;

    static singular = "item";
    static plural = "items";


    static handleMultiCreate([...newItems]) {
        return Promise.allSettled(newItems.map((newItem) => {
            return new Promise((resolve, reject) => {
                sendAuthenticatedRequest("POST", `${this.baseUrl}`, newItem).then(() => {
                    resolve();
                }).catch((e) => {
                    reject(e);
                });
            });
        }));
    }


    static handleDelete(itemId) {
        return new Promise((resolve, reject) => {
            sendAuthenticatedRequest("DELETE", `${this.baseUrl}/${itemId}`).then(() => {
                resolve(`${capitalized(this.singular)} deleted`);
            }).catch(() => {
                reject(`Failed to delete ${this.singular.toLowerCase()}`);
            });
        });
    }
}

export { Entity };