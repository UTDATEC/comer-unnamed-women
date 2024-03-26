import { Entity } from "./Entity.js";

class Tag extends Entity {
    static baseUrl = "/api/admin/tags";
    static singular = "tag";
    static plural = "tags";
}

export { Tag };