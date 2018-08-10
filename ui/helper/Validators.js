const MAX_PORT_NUM = 65535;
const Validators = {
    String: {
        nonBlank: s => s
                && typeof s === typeof ""
                && s.trim().length > 0,
        minLength: l => s => Validators.String.nonBlank(s) && s.length >= l,
        maxLength: l => s => Validators.String.nonBlank(s) && s.length < l
    },
    Number: {
        natural: n => {
            if (!n) {
                return false;
            }
            const n0 = n.toString();
            const n1 = Math.abs(n);
            const n2 = parseInt(n0, 10);
            return !Number.isNaN(n1) && n2 === n1 && n1.toString() === n;
        }
    },
    Port: {
        valid: p => Validators.Number.natural(p) && parseInt(p, 10) <= MAX_PORT_NUM
    },
    Boolean: {
        valid: b => typeof b === typeof true
    },
    URL: {
        valid: u => {
            try {
                return !!new URL(u);
            } catch (e) {
                return false;
            }
        }
    },
    Password: {
        valid: p => typeof p === "string"
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
    const increase = details ? 3 : 2;

    if (validations && validations.length % increase === 0) {
        result = true; // Init value

        // Don't exit early, always evaluate all inputs to gather all the results
        // in the detaile object
        while (index < validations.length) {
            const validationResult = validations[index](validations[index + 1]);
            result = result && validationResult;

            if (details) {
                details[validations[index + 2]] = validationResult ? "success" : "error";
            }
            index += increase;
        }
    }

    return result ? "success" : "error";
};

/**
 * Same as Validate but only 1 validation has to pass.
 * @param validations The validations array
 * @param details An object to store the validation results per field. Must be set if Field Names
 * are used in the validations
 * @returns {string} "success" on success, otherwise "error"
 */
const ValidateAny = (validations, details) => {
    let result = false;
    let index = 0;

    // One validation takes 3 arguments if fiel names are used (validator, input valud and field name)
    // and only two if not (validator, input value)
    const increase = details ? 3 : 2;

    if (validations && validations.length % increase === 0) {
        result = true; // Init value

        // Don't exit early, always evaluate all inputs to gather all the results
        // in the detaile object
        while (index < validations.length) {
            const validationResult = validations[index](validations[index + 1]);
            result = result || validationResult;

            if (details) {
                details[validations[index + 2]] = validationResult ? "success" : "error";
            }
            index += increase;
        }
    }

    return result ? "success" : "error";
};

export { Validators, Validate, ValidateAny };
