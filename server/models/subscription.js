module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define("Subscription", {
        type: DataTypes.ENUM("Subscription"),
        field: DataTypes.STRING,
        topic: DataTypes.STRING,
        filter: DataTypes.JSON
    });

    return Subscription;
};
