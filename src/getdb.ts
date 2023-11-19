//import { remote } from "electron";
import path from 'path';
import { DataTypes, Model, Sequelize } from 'sequelize';
declare const __static: string;

// todo try loading db from userData

//const univDb = path.join(remote.app.getPath("userData"), "data.db")

// todo the below is the path to local db under src/data.db
const isBuild = process.env.NODE_ENV === 'production';
const locDb = path.join(
    // eslint-disable-next-line
    __dirname,
    //isBuild ? __dirname : __static,
    '../../../../../../src/data.db',
);

// setup the connection to make sure it works
const sequelize = new Sequelize({
    dialect: 'sqlite',
    // todo change this to locDb for using db inside src/data.db
    storage: locDb,
    // ** db event logging true in dev and false in production
    logging: (process.env.NODE_ENV !== 'production') ? true : false,
    define: {
        timestamps: false,
        underscored: true,
    },
});

class Gesture extends Model {
    public name!: string | null;
    public trigger!: string | null;
    public id!: number | null
}

Gesture.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    trigger: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: "gestures",
    sequelize
})

class Action extends Model {
    public press!: string | null;
    public key!: string | null;
    public type!: string | null;
    public id!: number | null
}

Action.init({
    press: {
        type: DataTypes.STRING,
        allowNull: true
    },
    key: {
        type: DataTypes.STRING,
        allowNull: true
    },
    delay: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: "actions",
    sequelize
})

Gesture.hasMany(Action, { as: 'actions', foreignKey: 'gestureId' });
Gesture.sync()
Action.belongsTo(Gesture, { foreignKey: "gestureId", targetKey: "id" });
Action.sync()

export { sequelize, Gesture, Action };