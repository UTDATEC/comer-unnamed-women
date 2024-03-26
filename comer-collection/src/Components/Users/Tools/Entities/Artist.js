import { Entity } from "./Entity.js";

class Artist extends Entity {
    static baseUrl = "/api/admin/artists";
    static singular = "artist";
    static plural = "artists";
}

export { Artist };