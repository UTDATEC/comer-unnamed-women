import { Entity } from "./Entity.js";

class Course extends Entity {
    static baseUrl = "/api/admin/courses";
    static singular = "course";
    static plural = "courses";
}

export { Course };