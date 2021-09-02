const { MongoClient, ObjectId } = require("mongodb");
// const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const config = require("config");

const secret = config.get("secret");
const { getDatabase } = require("../Configs/mongoDb");

const login = async (req, res) => {
  const dbObject = await getDatabase();

  const user = await dbObject
    .collection("Users")
    .findOne({ email: req.body.email })
    .catch((e) => {
      res.send({ valid: false, message: e.message });
      return;
    });

  if (user) {
    const password = Buffer.from(user.password, "base64").toString();

    if (req.body.password == password) {
      var token = jwt.sign(
        {
          _id: user._id,
          asset_class: user.asset_class,
          user_name: user.first_name,
        },
        process.env.secret || secret,
        { expiresIn: 10 * 60 * 60 }
      );
      res.send({ valid: true, message: "User Found", token: token });
      return;
    }
    res.send({ valid: false, message: "Invalid Username or Password" });
    return;
  }
  res.send({ valid: false, message: "User not Registered" });
};

const register = async (req, res) => {
  const dbObject = await getDatabase();

  const user = await dbObject
    .collection("Users")
    .findOne({ email: req.body.email })
    .catch((e) => {
      res.send({ valid: false, message: e.message });
      return;
    });

  if (user) {
    res.send({ valid: false, message: "Email Already Registerd" });
    return;
  }

  req.body.password = Buffer.from(req.body.password).toString("base64");

  const result = await dbObject
    .collection("Users")
    .insertOne(req.body)
    .catch((e) => {
      res.send({ valid: false, message: e.message });
      return;
    });

  if (result) {
    res.send({ valid: true, message: "User Registered Successfully" });
    return;
  }

  res.send({ valid: false, message: "User could not be Registered" });
};

const login_direct = async (req, res) => {
  const login = req.body;
  console.log(login);
  try {
    const dbObject = await getDatabase();

    const user = await dbObject.collection("Users").findOne(login);
    if (user) {
      const token = jwt.sign(
        {
          _id: user._id,
          asset_class: user.asset_class,
          user_name: user.first_name,
        },
        process.env.secret || secret,
        { expiresIn: 10 * 60 * 60 }
      );
      res.send({ valid: true, message: "User Found", token: token });
      return;
    }
    const { insertedId } = await dbObject.collection("Users").insertOne(login);

    const token = jwt.sign(
      {
        _id: insertedId,
        asset_class: login.asset_class,
        user_name: login.first_name,
      },
      process.env.secret || secret,
      { expiresIn: 10 * 60 * 60 }
    );
    res.send({ valid: true, message: "User Found", token: token });
  } catch (e) {
    res.send({ valid: false, message: e.message });
  }
};

module.exports = { login, register, login_direct };
