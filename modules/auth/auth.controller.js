var bcrypt = require ('bcrypt');
var jwtUtils = require ('../../utils/jwt.utils');
var models = require ('../../models/index');
const debug = require ('debug') ('app:auth.controller');
var mailer = require("nodemailer");

//routes
module.exports = {
  register: function (req, res, next) {
    debug ('register');

    console.log (req.body);

    var email = req.body.email;
    var nickname = req.body.nickname;
    var password = req.body.password;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;

    if (!password || !firstname || !lastname || !nickname || !email) {
      return res.status (400).json ({error: 'missing paramaters'});
    }

    // TODO verification

    return models.User
      .findOne ({
        attributes: ['email'],
        where: {email: email},
      })
      .then (function (userFound) {
        if (!userFound) {
          bcrypt.hash (password, 5, function (err, bcryptedPassword) {
            var newUser = models.User
              .create ({
                password: bcryptedPassword,
                firstname: firstname,
                lastname: lastname,
                nickname: nickname,
                email: email,
              })
              .then (function (newUser) {
                return res.status (200).json ({
                  user: newUser,
                  token: jwtUtils.generateTokenForUser (newUser),
                });
              })
              .catch (function (err) {
                console.log ('Error add user');
                console.log ('Log : ' + err);
                return res.status (500).json ({error: 'cannot add user'});
              });
          });
        } else {
          return res.status (409).json ({error: 'Email already used'});
        }
      })
      .catch (function (err) {
        console.log ('Error verify user:');
        console.log ('Log : ' + err);
        return res.status (500).json ({error: 'unable to verify user'});
      });
  },
  login: function (req, res, next) {
    debug ('login');

    var email = req.body.email;
    var password = req.body.password;

    if (email == null || password == null) {
      return res.status (400).json ({error: 'missing parameters'});
    }

    return Promise.resolve ().then (login ()).catch (next);

    function login () {
      return models.User
        .find ({
          exclude: ['password'],
          where: {email: email},
        })
        .then (function (userFound) {
          if (userFound) {
            bcrypt.compare (password, userFound.password, function (
              errBycrypt,
              resBycrypt
            ) {
              if (resBycrypt) {
                return res.status (200).json ({
                  user: userFound,
                  token: jwtUtils.generateTokenForUser (userFound),
                });
              } else {
                return res.status (403).json ({error: 'invalid password'});
              }
            });
          } else {
            return res.status (404).json ({error: 'user not exist in DB'});
          }
        })
        .catch (function (err) {
          return res.status (500).json ({error: 'unable to verify user'});
        });
    }
  },
  forgotPassword: function (req, res, next) {
    debug ('forgotPassword');

    console.log (req.body);

    var email = req.body.email;

    if (!email) {
      return res.status (400).json ({error: 'missing email'});
    }

    return models.User
        .find ({
          exclude: ['password'],
          where: {email: email},
        }).then(function (userFound) {
          if (userFound) {
            var state = "err";
            var randompass = Math.random().toString(36).slice(-8);
            console.log(randompass);

            var transporter = mailer.createTransport({
              service: "Gmail",
              auth: {
                user: "contact.mandareen@gmail.com",
                pass: "20ManDa1reEn8"
              },
              tls: {
                rejectUnauthorized: false
              }
            });
            var mail = {
              from: "contact.mandareen@gmail.com",
              to: email,
              subject:
                  "[No-Reply] Changement de mot de passe - My Youtuber",
              html:
                  "<p>Bonjour</p>" +
                  "<br><p>Vous avez fait une requête de modification de mot passe pour votre compte my-youtuber</p>" +
                  "<br><p>Votre nouveau mot de passe est: '" +
                  randompass +
                  "'</p>"
            };
            transporter.sendMail(mail, function (error, response) {
              if (error) {
                state = "err";
                Logs.LogError("500", "sendEmailPassword : " + err);
                return res.status(500).json({ error: "Send mail failed" });
              } else {
                state = "ok";
                Logs.LogError("200", "sendEmailPassword : " + err);
                return res.status(200).json({ message: "email send" });
              }
            });


            bcrypt.hash (randompass, 5, function (err, bcryptedPassword) {
              return models.User.update(
                  {
                    password: bcryptedPassword
                  },
                  {
                    where: { email: email }
                  }
              ).then(function (result) {
                return res.json(result);
              }).catch(function (err) {
                console.log("Error changing password");
                console.log("Log : " + err);
                Logs.LogError(500, "sendEmailPassword : " + err);
                return res
                    .status(500)
                    .json({Error: "Cannot change password"});
              });
            });
          } else {
            return res.status(404).json({error: "User not found"});
          }
        })
  },
};
