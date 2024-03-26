import { Entity } from "./Entity.js";

class Image extends Entity {
    static baseUrl = "/api/admin/images";
    static singular = "image";
    static plural = "images";
}

export { Image };