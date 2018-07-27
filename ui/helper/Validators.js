const MAX_PORT_NUM = 65535;
const Validators = {
    String: {
        nonBlank: s => s
                && typeof s === typeof ""
                && s.length > 0,
        minLength: l => s => Validators.String.nonBlank(s) && s.length >= l,
        maxLength: l => s => Validators.String.nonBlank(s) && s.length < l
    },
    Number: {
        natural: n => !Number.isNaN(n) && parseInt(n, 10) > 0
    },
    Port: {
        valid: p => Validators.Number.natural(p) && p < MAX_PORT_NUM
    },
    Boolean: {
        valid: b => typeof b === typeof true
    }
};

/**
 * Run a number of validations that have to be passed in an array of the form:
 * [
 *  <Validator 1>, <Input Value 1>
 *  ...
 *  <Validator N>, <Input Value N>
 * ]
 *
 * It always has to be exactly one validator per input value, so the total length
 * of the array mod 2 must be zero.
 *
 * @param validations The validations array
 * @returns {string} "success" on success, otherwise "error"
 */
const Validate = validations => {
    let result = false;
    let index = 0;

    if (validations && validations.length % 2 === 0) {
        result = true; // Init value
        while (result && index < validations.length) {
            result = result && validations[index](validations[index + 1]);
            index += 2;
        }
    }

    return result ? "success" : "error";
};

export { Validators, Validate };
