import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT);

      req.userId = decoded.id;

      next();
    } catch (error) {
      return res.status(400).json({ message: "Нема доступу", code: "088" });
    }
  } else {
    return res.status(400).json({ message: "Нема доступу", code: "087" });
  }
};
