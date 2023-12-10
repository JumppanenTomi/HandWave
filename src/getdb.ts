//import { remote } from "electron";
import path from "path";
import {DataTypes, Model, Sequelize} from "sequelize";

/**
 * Represents a static variable of type string.
 *
 * @type {string}
 * @name __static
 */
declare const __static: string;

// todo try loading db from userData

//const univDb = path.join(remote.app.getPath("userData"), "data.db")

// todo the below is the path to local db under src/data.db
/**
 * Determines if the build is in production mode.
 *
 * @type {boolean}
 * @readonly
 *
 * @description
 * The `isBuild` variable is used to check if the current build is in production mode.
 * It is a read-only variable that is determined by comparing the value of the `NODE_ENV` environment variable with the string "production".
 *
 * @example
 * if (isBuild) {
 *   console.log("The build is in production mode");
 * } else {
 *   console.log("The build is not in production mode");
 * }
 */
const isBuild = process.env.NODE_ENV === "production";
/**
 * File path for the database.
 *
 * @type {string}
 */
const locDb = path.join("data.db");

// setup the connection to make sure it works
/**
 * A Sequelize instance for database connection.
 *
 * @typedef {Object} SequelizeInstance
 * @property {string} dialect - The SQL dialect to be used for the connection.
 * @property {string} storage - The path to the SQLite database file.
 * @property {boolean} logging - Whether to enable logging of database events.
 * @property {Object} define - Configuration options for Sequelize model definition.
 * @property {boolean} define.timestamps - Whether to enable creation of "createdAt" and "updatedAt" fields in models.
 * @property {boolean} define.underscored - Whether to use underscored naming convention for table name and model attributes.
 */
const sequelize = new Sequelize({
  dialect: "sqlite",
  // todo change this to locDb for using db inside src/data.db
  storage: locDb,
  // ** db event logging true in dev and false in production
  logging: process.env.NODE_ENV !== "production" ? true : false,
  define: {
    timestamps: false,
    underscored: true,
  },
});

/**
 * Class representing a Gesture.
 * @extends Model
 */
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

/**
 * @class Action
 * @extends Model
 *
 * The Action class represents an action that can be performed.
 *
 * @property {string | null} press - The button to be pressed. Can be null if no button is specified.
 * @property {string | null} key - The key to be pressed. Can be null if no key is specified.
 * @property {number | null} delay - The delay in milliseconds before the action is performed. Can be null if no delay is specified.
 * @property {string | null} type - The type of action. Can be null if no type is specified.
 * @property {number | null} id - The unique identifier of the action. Can be null if no id is specified.
 */
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

Gesture.hasMany(Action, { as: "actions", foreignKey: "gestureId" });
Gesture.sync();
Action.belongsTo(Gesture, { foreignKey: "gestureId", targetKey: "id" });
Action.sync();

export { sequelize, Gesture, Action };
