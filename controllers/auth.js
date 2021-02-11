const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const keys = require("../config/keys");
const errorHandler = require("../utils/errorHandler");
const path = require('path');

module.exports.getUser = async function(req, res) {
  const candidate = await User.findOne({ _id: req.params.id });
  if (candidate) {
    res.status(200).json(candidate);
  } else {
    errorHandler(res, e);
  }
};

module.exports.login = async function(req, res) {
  // находим по емейлу пользователя
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    // Проверка пароля, пользователь существует
    const passwordResult = bcrypt.compareSync(
      req.body.password,
      candidate.password
    );
    if (passwordResult) {
      // Генерация токена, пароли совпали
      const token = jwt.sign(
        {
          email: candidate.email,
          userId: candidate._id
        },
        keys.jwt,
        // время срока годности токена
        { expiresIn: 60 * 60 * 60 }
      );
      res.status(200).json({
        // используется в паспорте для стратегии доступа
        token: `Bearer ${token}`,
        _id: candidate._id
      });
    } else {
      // Пароли не совпали
      res.status(401).json({
        message: "Пароли не совпадают. Попробуйте снова."
      });
    }
  } else {
    // Пользователя нет, ошибка
    res.status(404).json({
      message: "Пользователь с таким email не найден."
    });
  }
};

module.exports.register = async function(req, res) {
  // email password
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    // Пользователь существует, нужно отправить ошибку
    res.status(409).json({
      message: "Такой email уже занят. Попробуйте другой."
    });
  } else {
    // Нужно создать пользователя
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt),
      imageSrc: req.file ? req.file.path : "uploads\\default.png",
      role: req.body.role,
      nickName: req.body.nickName
    });

    try {
      await user.save();
      res.status(201).json(user);
    } catch (e) {
      errorHandler(res, e);
    }
  }
};
