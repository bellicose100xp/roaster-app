import express from "express";
import { db } from "../db/studentDb.js";
import { validateIncomingRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", (req, res) => {
    const { id, name, location } = /** @type {Object.<string, string|undefined>} */ (req.query);

    if (!id && !name && !location) {
        res.send(db.getStudents());
        return;
    }

    res.send(db.getStudentsQuery(id, name, location));
});

router.post("/", validateIncomingRequest, async (req, res) => {
    const { name, location } = /** @type {Object.<string, string>} */ (req.body);
    res.send(await db.addStudent(name, location));
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: "Error malformed or missing id" });
    }

    const { name: newName, location: newLocation } = req.body;
    const updateResult = await db.updateStudentById(id, newName, newLocation);

    if (!updateResult) {
        res.status(406).json({ error: "Student not found!" });
        return;
    }
    res.send(db.getStudents());
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: "Error malformed or missing id" });
    }

    const deleteResult = db.deleteStudentById(id);

    if (!deleteResult) {
        res.status(406).json({ error: "Student not found!" });
        return;
    }

    res.redirect(req.baseUrl);
});

export default router;
