import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import responseHelper from '../../helpers/apiResponse';
import models from '../../models';
import config from '../../config';

let userCtrl = {};

function encryptPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve({hash: hash, salt: salt});
            });
        });
    })
}

function getPasswordFromSalt(password,salt) {
 return new Promise((resolve, reject) => {
     bcrypt.hash(password, salt, function (err, hash) {
         if (err) {
             return reject(err);
         }
         resolve(hash);
     });
 });
}

userCtrl.register = async (req, res) => {
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('firstName', 'firstName is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return responseHelper.validationErrorResponse(req, res, errors);
    }
    try {
        let password = await encryptPassword(req.body.password);
        let userData = {
            username: req.body.username,
            password: password.hash,
            salt: password.salt,
            firstName: req.body.firstName,
            lastname: req.body.lastname
        };
        let checkUser = await models.users.findOne({username: req.body.username});
        if (checkUser) {
            responseHelper.sendServerError(req, res, 'username already taken', 422);
            return;
        }
        let userModelData = await models.users.create(userData);
        userModelData = userModelData.toObject();
        delete userModelData.password;
        delete userModelData.salt;
        userModelData.token = jwt.sign(userModelData, config.jwtSecret, { expiresIn: '365d' });
        responseHelper.sendSuccess(req, res, userModelData, 'User Added successfully');
    }
    catch (err) {
        console.log(err);
        responseHelper.sendServerError(req, res, err, 500);

    }
};

userCtrl.login = async (req, res) => {
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('password', 'firstName is required').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return responseHelper.validationErrorResponse(req, res, errors);
    }
    try {
        let checkUser = await models.users.findOne({username: req.body.username},{
           username :1,
           firstName :1,
           lastName :1,
           createdAt :1,
            salt:1,
            password: 1
        }).lean();
        if (!checkUser) {
            responseHelper.sendServerError(req, res, 'invalid username or password', 401);
            return;
        }
        if(checkUser.password !== await getPasswordFromSalt(req.body.password,checkUser.salt)) {
            responseHelper.sendServerError(req, res, 'invalid username or password', 401);
            return;
        }
        delete checkUser.salt;
        delete checkUser.password;
        checkUser.token = jwt.sign(checkUser, config.jwtSecret, { expiresIn: '365d' });
        responseHelper.sendSuccess(req, res, checkUser, 'User logged in successfully');
    } catch(err) {
        console.log(err);
        responseHelper.sendServerError(req, res, err, 500);
    }
};

module.exports = userCtrl;