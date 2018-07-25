const Validators = {
    String: {
        defined: s => s
                && typeof s === typeof ""
                && s.length > 0
    },
    Number: {
        natural: n => !Number.isNaN(n) && parseInt(n, 10) > 0
    }
};

/**
 * Run a number of validations that have to be passed in an array of the form:
 * [
 *  <Validation Function 1>, <Validation Subject 1>
 *  ...
 *  <Validation Function N>, <Validation Subject N>
 * ]
 * @param validations The validations array
 * @returns {string} "success" on success, otherwise "error"
 */
const Validate = validations => {
    let result = false;

    if (validations && validations.length % 2 === 0) {
        result = true; // Init value
        for (let i = 0; i < validations.length; i += 2) {
            result = result && validations[i](validations[i + 1]);
        }
    }

    return result ? "success" : "error";
};

export { Validators, Validate };
