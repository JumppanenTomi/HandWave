import path from "path";
import {DataTypes, Model, Sequelize} from "sequelize";

const locDb = path.join("data.db");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: locDb,
    logging: process.env.NODE_ENV !== "production",
    define: {
        timestamps: false,
        underscored: true,
    },
});

class Gesture extends Model {
    public name!: string | null;
    public trigger!: string | null;
    public id!: number | null;
}

Gesture.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trigger: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "gestures",
        sequelize,
    }
);

class Action extends Model {
    public press!: string | null;
    public key!: string | null;
    public delay!: number | null;
    public type!: string | null;
    public id!: number | null;
}

Action.init(
    {
        press: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        key: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        delay: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "actions",
        sequelize,
    }
);

Gesture.hasMany(Action, {as: "actions", foreignKey: "gestureId"});
Gesture.sync();
Action.belongsTo(Gesture, {foreignKey: "gestureId", targetKey: "id"});
Action.sync();

export {sequelize, Gesture, Action};