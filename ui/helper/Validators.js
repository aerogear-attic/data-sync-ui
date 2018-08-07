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
 * or
 *
 * [
 *  <Validator 1>, <Input Value 1>, <Field Name>
 *  ...
 *  <Validator N>, <Input Value N>, <Field Name>
 * ]
 *
 * @param validations The validations array
 * @param details An object to store the validation results per field. Must be set if Field Names
 * are used in the validations
 * @returns {string} "success" on success, otherwise "error"
 */
const Validate = (validations, details) => {
    let result = false;
    let index = 0;

    // One validation takes 3 arguments if fiel names are used (validator, input valud and field name)
    // and only two if not (validator, input value)
    let increase = details ? 3 : 2 ;

    if (validations && validations.length % increase === 0) {
        result = true; // Init value
        while (result && index < validations.length) {
            result = result && validations[index](validations[index + 1]);
            if (details) {
                details[validations[index + 2]] = result ? "success" : "error";
            }
            index += increase;
        }
    }

    return result ? "success" : "error";
};

export { Validators, Validate };
