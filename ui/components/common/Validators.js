const Validators = {
    String: {
        nonBlank: s => s
                && typeof s === typeof ""
                && s.length > 0,
        defined: s => s && typeof s === typeof "",
        minLength: l => s => Validators.String.nonBlank(s) && s.length >= l,
        maxLength: l => s => Validators.String.nonBlank(s) && s.length < l
    },
    Number: {
        natural: n => !Number.isNaN(n) && parseInt(n, 10) > 0
    },
    Boolean: {
        valid: b => typeof b === typeof true
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
