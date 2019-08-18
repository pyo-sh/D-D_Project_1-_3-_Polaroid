const express = require('express');
const users = express.Router();
const jwtSecret = require('../config/jwtConfig');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

users.post('/fblogin', (req, res, next) => {
    passport.authenticate('facebook', (err, users, info) => {
        console.log("user, info " + users, info );
        if(err){
            console.error(`error ${err}`);
        }
        if (info !== undefined) {
            console.log(info);
            console.error(info.message);
            if (info.message === 'bad id'){
                req.status(401).send(info.message);
            } else {
                res.status(403).send(info.message);
            }
        }else {
            req.logIn(users, () => {
                User.findOne({
                    where : {
                        ID: req.body.ID,
                    }
                }).then(user => {
                    if(user){
                            let token = jwt.sign(user.dataValues, jwtSecret.secret, {
                            expiresIn: 60 * 60,
                        })
                        res.status(200).send({
                            auth: true,
                            token,
                            message: 'user found & logged in'
                        });
                    } 
                    else {
                      res.status(400).json({ error: 'User does not exist '})
                  };
                });
            });
        }
    })(req, res, next);
});

users.post('/login', (req, res, next) => {  // 로그인
    passport.authenticate('login', (err, users, info) => {
        if (err) {
            console.error(`error ${err}`);
        }
        if (info !== undefined) {
            console.log(info);
            console.error(info.message);
            if (info.message === 'bad id'){
                req.status(401).send(info.message);
            }else {
                res.status(403).send(info.message);
            }
        } else {
            req.logIn(users, () => {
                User.findOne({
                    where : {
                        ID: req.body.ID,
                    }
                }).then(user => {
                    if(user){
                        if(bcrypt.compareSync(req.body.PASSWORD, user.PASSWORD)){
                            let token = jwt.sign(user.dataValues, jwtSecret.secret, {
                                expiresIn: 60 * 60,
                        })
                        res.status(200).send({
                            auth: true,
                            token,
                            message: 'user found & logged in'
                        });
                    };
                  } else {
                      res.status(400).json({ error: 'User does not exist '})
                  };
                });
            });
        }
    })(req, res, next);
});

users.post('/register', (req, res, next) => {   // 유저 등록
    passport.authenticate('register', (err, user, info) => {
        if(err){
            console.error(err);
        }
        if (info !== undefined){
            console.error(info.message);
            res.status(403).send(info.message);
        } else {
            req.logIn(user, error => {
                console.log(user);
                const today =new Date();
                const userData = {
                    ID : req.body.ID,
                    PASSWORD: req.body.PASSWORD,
                    email : req.body.email,
                    nickname : req.body.nickname,
                    created: today,
                };
                console.log(userData);
                User.findOne({
                    where: {
                        ID: req.body.ID,
                    },
                }).then(user => {
                    console.log(user);
                    if(!user){
                        bcrypt.hash(req.body.PASSWORD, 10, (err,hash) => {
                            userData.PASSWORD = hash;
                            console.log(userData);
                            User.create(userData)
                            .then(user => {
                                res.json({status : user.ID + 'registerd'})
                                })
                            .catch(err => {
                                res.send('error :' + err);
                                })
                            })
                    } else {
                         res.json({error: 'User already exist'})
                    }
                })
            })
        }
    })(req, res, next);
})

users.get('/finduser', (req, res, next) => {  // 유저 찾기
    passport.authenticate('jwt', { session: false}, (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined){
            console.log(info.message);
        } else if (user.ID === req.query.username) {
            User.findOne({
                where: {
                    ID: req.query.username,
                },
            }).then((userInfo) => {
                if(userInfo !== null){
                    console.log('user found in db from findUsers');
                    res.status(200).send({
                        auth: true,
                        ID : userInfo.ID,
                        PASSWORD : userInfo.PASSWORD,
                        email : userInfo.email,
                        nickname : userInfo.nickname,
                        message: 'user found in db',
                    });
                }else {
                    console.error('no user exists in db with that username');
                    res.status(401).send('no user exists in db with that username');
                }
            })(req, res, next);
        } ;
    });
});

users.post('/reset', (req, res) => { // 패스워드 리셋
    const { ID, PASSWORD } = req.body; // id와 패스워드를 받아서 id를 찾아 패스워드를 바꿈
    User.findOne({
        where : {
            ID : ID
        }
    }).then((user) => {
        if (user == null) {
            console.error('password reset link is invalid or has expired');
            res.status(403).send('password reset link is invalid or has expired');
        } else {
            bcrypt.hash(PASSWORD, 10, (err,hash) => {
                const hashPassword = hash;
                user.update({
                    PASSWORD : hashPassword
                })
                res.status(200).send({
                    ID: user.ID,
                    message: 'password reset link a-ok',
                });
            })
        }
    })
});

const BCRYPT_SALT_ROUNDS = 12;
users.put('/updatepassword', (req, res, next) => { // 패스워드 바꿀 때
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.error(err);
        }
        if (info !== undefined){
            console.error(info.message);
            res.status(403).send(info.message);
        }else {
            User.findOne({
                where: {
                    ID : req.body.ID,
                },
            }).then((userInfo) => {
                if(userInfo != null) {
                    console.log('user found in db');
                    bcrypt
                        .hash(req.body.PASSWORD, BCRYPT_SALT_ROUNDS)
                        .then((hashedPassword) => {
                            userInfo.update({
                                PASSWORD: hashedPassword,
                            });
                        })
                        .then(() => {
                            console.log('password updated');
                            res.status(200).send({ auth: true, message: 'password updated'});
                        });
                } else {
                    console.error('no user exists in db to update');
                    res.status(404).json('no user exists in db to update');
                }
            });
        }
    })(req, res, next);
});

users.put('/updateuser', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) =>{
        if (err) {
            console.error(err);
        }
        if (info !== undefined) {
            console.error(info.message);
            res.status(403).send(info.message);
        } else{
            User.findOne({
                where : {
                    ID : req.body.ID,
                },
            }).then((userInfo) => {
                console.log('user found in db');
                userInfo
                    .update({
                        nickname :  req.body.nickname,
                        email : req.body.email
                    })
                    .then(() => {
                        console.log('user updated');
                        res.status(200).send({auth : true, message: 'user update'});
                    })
            });
        }
    })(req, res, next);
});

users.delete('/delete/:userID', (req, res) => {
            console.log(req.params.userID);
            User.destroy({
                where : {
                    ID: req.params.userID
                },
            })
            .then((userInfo) => {
                if (userInfo === 1) {
                    console.log('user deleted from db');
                    res.status(200).send('user deleted from db');
                } else {
                    console.error('user not found in db');
                    res.status(404).send('no user with that username to delete ');
                }
            })
            .catch((error) => {
                console.error('problem communicating with db');
                res.status(500).send(error);
            })
})

users.post('/findpassword', (req, res) => { // 해당 주소로 들어왔을때만 ok하게 어떻게 하나.......
    if (req.body.ID === '') {
      res.status(400).send('ID required');
    }
    console.error(req.body.ID);
    User.findOne({
      where: {
        ID: req.body.ID,
      },
    }).then((user) => {
      if (user === null) {
        console.error('ID not in database');
        res.status(403).send('ID not in db');
      } else {
        // const token = crypto.randomBytes(20).toString('hex');
        const uservalue = {
            ID : req.body.ID,
            auth : true,
        }
        let token = jwt.sign(uservalue, jwtSecret.secret, {
            expiresIn: 60 * 60,
        })
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'ansejrrhkd@gmail.com', // 바꾸자
            pass: 'dkelektm123!', // 바꾸자
          },
        });

        const mailOptions = {
          from: 'mySqlDemoEmail@gmail.com',
          to: `${user.email}`,
          subject: 'Link To Reset Password',
          text:
            'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
            + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
            + `https://localhost:3000/user/reset/${req.body.ID}/${token}\n`
            + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
        };

        console.log('sending mail');

        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.error('there was an error: ', err);
          } else {
            console.log('here is the res: ', response);
            res.status(200).json('recovery email sent');
          }
        });
      }
    });
  });



module.exports = users;