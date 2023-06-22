const Router = require("express").Router()
const bcrypt = require("bcryptjs")
const passport = require("passport")
const { Sequelize, Op } = require("sequelize")

var randomstring = require("randomstring")
const { User, Admin, Messages } = require("../model/model")

const {
    ensureAuthenticated,
    forwardAuthenticated,
    adminAuthenticated,
} = require("../config/auth");

const client = require("../config/mailer")
const mailuser = process.env.MAILID;

var auth;
var data;

const authCheck = function (req, res, next) {
    if (req.isAuthenticated()) {
        auth = true;
        data = req.user;
    } else {
        auth = false;
        data = ""
    }
    next()
}

const authCheckUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        auth = true;
        data = req.user;
        if (req.user.role == "user") return next();

    } else {
        auth = false;
        var data = "no";
        res.render("pages/login", { data, auth, currentRoute: "" });
    }
};

Router.get("/", authCheck, async (req, res) => {
    res.render('pages/index', { data, auth, currentRoute: "" })
})

Router.get("/login", forwardAuthenticated, authCheck, async (req, res) => {
    res.render('pages/login', { data, auth, currentRoute: 'login', })
})

Router.get("/register", forwardAuthenticated, authCheck, async (req, res) => {
    res.render('pages/register', { data, auth, currentRoute: 'register', })
})

Router.get("/news", authCheckUser, (req, res) => {
    res.render("pages/news", { auth, data });
});
Router.get("/games", authCheckUser, (req, res) => {
    res.render("pages/games", { auth, data });
});
Router.get("/channel", authCheckUser, (req, res) => {
    res.render("pages/channel", { auth, data });
});
Router.get("/schedule", authCheckUser, (req, res) => {
    res.render("pages/schedule", { auth, data });
});
Router.get("/gallery", authCheckUser, (req, res) => {
    res.render("pages/gallery", { auth, data });
});
Router.get("/contact", authCheckUser, (req, res) => {
    res.render("pages/contact", { auth, data });
});


Router.post("/contact", async (req, res) => {
    const { email, name, phonenumber, message } = req.body;

    await Messages.create({
        name, email, phonenumber, message
    })
})

Router.post("/register", async (req, res) => {
    var {
        name,
        email,
        phone,
        password,
    } = req.body

    var user = await User.findOne({ where: { email: email } })

    if (user) {
        var data = {
            title: "user exists",
        }
        return res.json(data)
    }

    var salt = bcrypt.genSaltSync(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    await User.create({
        name, email, phone, password: hashedPassword,
    })

    var data = {
        title: "success",
    }
    return res.json(data)
})

Router.post("/login", (req, res, next) => {
    passport.authenticate("user-login", (err, user, info) => {
        if (err === "no user") {
            var data = {
                title: "no user",
            }
            return res.json(data)
        }
        if (err === "password") {
            var data = {
                title: "password"
            }
            return res.json(data)
        }
        if (!user) {
            var data = {
                title: "no user"
            }
            return res.json(data)
        }
        if (user.suspended == true) {
            var data = {
                title: "suspended"
            }
            return res.json(data)
        }

        // Login user for session
        req.logIn(user, (err) => {
            if (err) {
                var data = {
                    title: "error"
                }
                return res.json(data)
            }
            if (user.role == "admin") {
                var data = {
                    title: "admin",
                    user: user
                }
                res.json(data)
            }
            var data = {
                title: "user",
                user: user
            }
            res.json(data)
        })
    })(req, res, next)
})

//Logout
Router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/login");
    });
});







module.exports = Router