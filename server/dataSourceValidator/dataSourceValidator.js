const validators = require("./validators");

module.exports = async (type, config) => {
    if (!(type in validators)) {
        return {status: false, message: `Cannot test data source with type ${type}`}
    }

    const validator = validators[type];
    return await validator(config);
};
