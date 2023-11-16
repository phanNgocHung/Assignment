const myDB= require("../models/admin.model");

exports.Signup = async (req,res,next) => {
        const fullName = req.body.fullName;
        const username = req.body.username;
        const password = req.body.password;
        await myDB.create({
            fullName: fullName,
            username: username,
            password: password,
        });
        res.redirect('/signup');
}