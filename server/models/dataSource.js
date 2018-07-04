export default (sequelize, DataTypes) => {
    const DataSource = sequelize.define("DataSource", {
        name: DataTypes.STRING,
        type: DataTypes.ENUM("InMemory", "Postgres"),
        config: DataTypes.JSON
    });
    return DataSource;
};
