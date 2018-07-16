module.exports = (sequelize, DataTypes) => {
    const Schema = sequelize.define("Resolver", {
        type: DataTypes.STRING,
        field: DataTypes.STRING,
        requestMapping: DataTypes.TEXT,
        responseMapping: DataTypes.TEXT
    });
    return Schema;
};
