/// <reference types="node" />

import { uid } from "uid"; // Generates 11 character UID by default
import axios from "axios";

/**
 * @typedef {Object} Student
 * @property {string} id
 * @property {string} name
 * @property {string} location
 * @property {string} photo
 */

/**
 * @typedef {Object.<string, Student>} Students
 */

class Roster {
    /**@type {Students} */
    #students = {};

    constructor() {}

    /**
     * @param {string} location
     * @returns {Promise<string>}
     */
    async #getPhoto(location) {
        let photoUrl = "";

        try {
            const response = await axios.get("https://api.unsplash.com/search/photos", {
                params: {
                    page: 1,
                    query: location,
                },
                headers: {
                    Authorization: process.env.UNSPLASH_API_KEY
                        /* cspell: disable-line */,
                },
            });
            photoUrl = response.data.results[0].urls.regular;
        } catch (error) {
            console.log("Error getting data from Unsplash", error);
            photoUrl = "https://placehold.co/600x400"
        }

        return photoUrl;
    }

    /**
     * @param {string} name
     * @param {string} location
     * @returns {Promise<Student>}
     */
    async addStudent(name, location) {
        const id = uid();
        this.#students[id] = {
            id,
            name,
            location,
            photo: await this.#getPhoto(location),
        };

        return this.#students[id];
    }

    /**
     * @param {string} id
     * @returns {Student}
     */
    getStudentById(id) {
        return this.#students[id];
    }

    /**
     * @param {string | undefined} id
     * @param {string | undefined} name
     * @param {string | undefined} location
     * @returns {Student | Student[]}
     */
    getStudentsQuery(id, name, location) {
        if (id) {
            return this.getStudentById(id);
        }

        if (name && location) {
            return Object.values(this.#students).filter(
                (student) => student.name === name && student.location === location
            );
        }

        if (name) {
            return Object.values(this.#students).filter((student) => student.name === name);
        }

        if (location) {
            return Object.values(this.#students).filter((student) => student.location === location);
        }

        return [];
    }

    /**
     * @returns {Students}
     */
    getStudents() {
        return this.#students;
    }

    /**
     * @param {string} id
     * @param {string} name
     * @param {string} location
     * @returns {Promise<Student|null>}
     */
    async updateStudentById(id, name, location) {
        if (!this.#students[id]) return null;

        if (name) this.#students[id].name = name;
        if (location) {
            this.#students[id].location = location;
            this.#students[id].photo = await this.#getPhoto(location);
        }

        return this.#students[id];
    }

    /**
     * @param {string} id
     * @returns {boolean}
     */
    deleteStudentById(id) {
        if (!this.#students[id]) return false;

        delete this.#students[id];

        return true;
    }
}

export const db = new Roster();

db.addStudent("harry", "london");
db.addStudent("hermione", "ireland");
