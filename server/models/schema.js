export default (sequelize, DataTypes) => {
  const Schema = sequelize.define("GraphQLSchema", {
      name: DataTypes.STRING,
      schema: DataTypes.TEXT
  });
  return Schema;
};