export const validateIncomingRequest = (req, res, next) => {
    
    /* This middleware handles errors */
    const { name, location } = /** @type {Object.<string, string | undefined>} */ (req.body);

    if (!name || !location) {
        res.status(400).json({ error: "Name and location required" });
        return;
    }

    // next is the reference to the next fn in the chain. Executing it calls the next function in the chain.
    next();
};
