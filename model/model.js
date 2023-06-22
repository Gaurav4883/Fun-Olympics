const { Sequelize, DataTypes } = require("sequelize")
const db = require("./connection")


// 1. User
const User = db.define("user", {
    id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    },
    photo: {
        type: DataTypes.STRING,
        defaultValue: "img/default.png"
    },
    password: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "user"
    },
    suspended: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    code: {
        type: DataTypes.STRING
    }

})

// 2. Admin
const Admin = db.define("admin", {
    id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "admin",
    },
    photo: {
        type: DataTypes.STRING,
        defaultValue: "img/default.png",
    },
});

// Messages
const Messages = db.define("messages", {
    id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    phonenumber: {
        type: DataTypes.STRING,
    },
    message: {
        type: DataTypes.TEXT,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

// POSTS
// const Posts = db.define("posts",{
// })

//Associations
// Posts.belongsTo(User, {type: Sequelize.UUID} )


// db.sync({ alter: true })

module.exports = {
    User,
    Admin,
    Messages
}
