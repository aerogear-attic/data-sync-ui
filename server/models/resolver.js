module.exports = (sequelize, DataTypes) => {
    const Resolver = sequelize.define("Resolver", {
        type: DataTypes.STRING,
        field: DataTypes.STRING,
        preHook: DataTypes.STRING,
        postHook: DataTypes.STRING,
        requestMapping: DataTypes.TEXT,
        responseMapping: DataTypes.TEXT,
        publish: DataTypes.TEXT
    });
    return Resolver;
};
