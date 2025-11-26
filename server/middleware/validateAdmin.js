
const isAdmin = (req, res, next) => {
    const role = req.infoUser?.role;

    if (role !== "admin") {
        return res.status(403).json({ message: "Solo los administradores pueden realizar esta acción" });
    }

    next();
};

export default isAdmin