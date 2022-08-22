import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Register

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const isUsed = await User.findOne({ username });

    if (isUsed) {
      return res.json({ message: `Користувач '${username}' уже існує` });
    }

    const salt = bcrypt.genSaltSync(10);

    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hash,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
        username,
      },
      process.env.JWT,
      { expiresIn: "3d" }
    );

    await newUser.save();

    res
      .status(200)
      .json({ newUser, token, message: "Регістрація пройшла успішно" });
  } catch (error) {
    res.json("Помилка при створенні користувача");
    console.log("Помилка при створенні користувача::::", error);
  }
};

//Login

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        message: `Користувача '${username}' не існує`,
      });
    }

    const pass = await bcrypt.compare(password, user.password);

    if (!pass) {
      return res.json({
        message: "Неправильний логін або пароль!",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username,
      },
      process.env.JWT,
      { expiresIn: "3d" }
    );

    res.status(200).json({ user, token, message: "Ви увійшли в систему" });
  } catch (error) {
    res.json({ message: "Помилка при авторизациї" });
    console.log("Помилка при авторизації користувача::::", error);
  }
};

//Get Me

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(400).json({ message: "Такого користувача немає!" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username,
      },
      process.env.JWT,
      { expiresIn: "3d" }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: "Немає доступу", code: "086" });
  }
};
