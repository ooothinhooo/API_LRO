const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const Art = require("../models/arts.models.js");
const Doc = require("../models/docs.models.js");
const Dis = require("../models/disscussion.models.js");
const { StatusCode } = require("../utils/constants.js");
const { jsonGenerate } = require("../utils/helpers.js");

exports.Login = async (req, res) => {
  const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { username, password, email } = req.body;
    const user = await User.findOne({
      $or: [
        {
          email: email,
        },
        {
          username: username,
        },
      ],
    });

    if (!user) {
      return res.json(
        jsonGenerate(
          StatusCode.UNPROCESSABLE_ENTITY,
          "Username or password is incorrect"
        )
      );
    }

    const verified = bcrypt.compareSync(password, user.password);

    if (!verified) {
      return res.json(
        jsonGenerate(
          StatusCode.UNPROCESSABLE_ENTITY,
          "Username or password is incorrect"
        )
      );
    }

    const token = Jwt.sign({ userId: user._id }, JWT_TOKEN_SECRET);

    return res.json(
      jsonGenerate(StatusCode.SUCCESS, "Login Successful", {
        userId: user._id,
        uid: user.uid,
        username: username,
        email: user.email,
        avatar: user.avatar,
        access: user.access,
        token: token,
        first_name: user.first_name,
        last_name: user.last_name,
      })
    );
  }

  res.json(
    jsonGenerate(
      StatusCode.VALIDATION_ERROR,
      "Validatiion error",
      errors.mapped()
    )
  );
};

exports.Register = async (req, res) => {
  const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const {
      form,
      first_name,
      last_name,
      username,
      email,
      password,
      avatar,
      isSex,
      phone,
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const userExist = await User.findOne({
      $or: [
        {
          email: email,
        },
        {
          username: username,
        },
      ],
    });

    //!User or Email already exists
    if (userExist) {
      return res.json(
        jsonGenerate(
          StatusCode.UNPROCESSABLE_ENTITY,
          "User or Email already exists"
        )
      );
    }
    //! save to db
    try {
      const result = await User.create({
        form: form,
        username: username,
        email: email,
        password: hashPassword,
        avatar: avatar,
        first_name: first_name,
        last_name: last_name,
        isSex: isSex,
        phone: phone,
      });

      const token = Jwt.sign({ userId: result._id }, JWT_TOKEN_SECRET);
      //! Registration successful
      res.json(
        jsonGenerate(StatusCode.SUCCESS, "Registration successful", {
          userId: result._id,
          token: token,
        })
      );
    } catch (error) {
      console.log(error);
    }
  } else {
    res.json(
      jsonGenerate(
        StatusCode.VALIDATION_ERROR,
        "Validation error",
        errors.mapped()
      )
    );
  }
};

exports.FindOneUser = async (req, res) => {
  try {
    // var uid = req.query.uid;
    const infoCreators = await User.findById({ _id: req.body._id })
      .select("-password")
      .populate("docs")
      .populate("articles")
      .exec();

    return res.json(
      jsonGenerate(StatusCode.SUCCESS, `User => ${req.body._id}`, infoCreators)
    );
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Error", error)
    );
  }
};

exports.UpdatePersonalInformation = async (req, res) => {
 try {
   const _id = req.userId;
   const { first_name, last_name, email, phone, avatar, isSex } = req.body;
   const data = { first_name, last_name, email, phone, avatar, isSex };
   const UserInfo = await User.findById(_id);
   let userExist = false;
   if (UserInfo.email != email) {
     userExist = await User.findOne({
       $or: [
         {
           email: email,
         },
       ],
     });
   }

   //!User or Email already exists
   if (userExist) {
     return res.json(
       jsonGenerate(
         StatusCode.UNPROCESSABLE_ENTITY,
         " Email  already exists",
         UserInfo.email
       )
     );
   }
   try {
     const result = await User.findByIdAndUpdate(_id, data);
     return res.json(
       jsonGenerate(
         StatusCode.SUCCESS,
         "Update Personal Information Successfully",
         result
       )
     );
   } catch (error) {
     return res.status(500).json("Internal server error ");
   }
 } catch (error) {}
};

exports.ChangeThePassword = async (req, res) => {
  // const newpass = ({ password } = req.body);
  const _id = req.userId;

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  const NewPass = { password };
  try {
    const result = await User.findByIdAndUpdate(_id, NewPass);
    return res.json(
      jsonGenerate(StatusCode.SUCCESS, "Update Succssfully", result)
    );
  } catch (error) {
    return res.status(500).json("Internal server error ");
  }
};

// exports.SearchData = async (req, res) => {
//   const PAGE_SIZE = 10;
//   const skip = 1;
//   try {
//     const { data } = req.body;
//     const list1 = await Doc.find({
//       $or: [
//         {
//           title: new RegExp(req.params.q, "i"),
//         },
//         {
//           tag: new RegExp(req.params.q, "i"),
//         },
//       ],
//     })
//       .skip(skip)
//       .limit(PAGE_SIZE);

//     const list2 = await Art.find({
//       $or: [
//         {
//           title: new RegExp(req.params.q, "i"),
//         },
//         {
//           tag: new RegExp(req.params.q, "i"),
//         },
//       ],
//     })
//       .skip(skip)
//       .limit(PAGE_SIZE);

//     const result = list1.concat(list2);
//     return res.json(
//       jsonGenerate(StatusCode.SUCCESS, "Data Succssfully", result)
//     );
//   } catch (error) {
//     return res.json(
//       jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Error", error)
//     );
//   }
// };



exports.SearchData = async (req, res) => {
    const PAGE_SIZE = 10;
    const skip = 1;
    var needle = req.params.q;
    try {
      const reDoc = await Doc.find({
        sku: { $regex: new RegExp(`${needle}$`) },
      });
      const reArt = await Art.find({
        sku: { $regex: new RegExp(`${needle}$`) },
      });
      // var result = { ...reDoc, ...reArt };
      const result = reDoc.concat(reArt);

      return res.json(
        jsonGenerate(StatusCode.SUCCESS, "Data Succssfully", result)
      );
    } catch (error) {
      return res.json(
        jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Error", error)
      );
    }
};
