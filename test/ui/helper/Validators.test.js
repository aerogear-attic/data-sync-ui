import { Validate, Validators } from "../../../ui/helper/Validators";

it("should correctly validate a bunch of cases", () => {
    const result = Validate([
        Validators.String.nonBlank, "some random string",
        Validators.Number.natural, "123",
        Validators.URL.valid, "http://localhost",
        Validators.Port.valid, "123"
    ]);

    expect(result).toEqual("success");
});

it("should find a wrong value from a bunch of validations", () => {
    const result = Validate([
        Validators.String.nonBlank, "some random string",
        Validators.Number.natural, null,
        Validators.URL.valid, "http://localhost",
        Validators.Port.valid, "123"
    ]);

    expect(result).toEqual("error");
});

it("should correctly validate a bunch of cases and put results in a details object", () => {
    const results = {};

    Validate([
        Validators.String.nonBlank, "some random string", "string",
        Validators.String.nonBlank, null, "nullString",
        Validators.Port.valid, "123", "port"
    ], results);

    expect(results).toEqual({
        string: "success",
        nullString: "error",
        port: "success"
    });

    Validate([
        Validators.String.nonBlank, "some random string", "string",
        Validators.String.nonBlank, null, "nullString",
        Validators.Port.valid, "123", "port",
        Validators.URL.valid, "http://localhost", "url"
    ], results);

    expect(results).toEqual({
        string: "success",
        nullString: "error",
        port: "success",
        url: "success"
    });
});

describe("String", () => {
    it("should validate the min length and not only spaces", () => {
        const stringShort = "too short";
        const stringLong = "this is not too short";

        expect(Validate([Validators.String.minLength(10), stringShort])).toEqual("error");
        expect(Validate([Validators.String.minLength(10), " ".repeat(20)])).toEqual("error");
        expect(Validate([Validators.String.minLength(10), stringLong])).toEqual("success");
    });

    it("should validate the max length and not only spaces", () => {
        const stringShort = "not long";
        const stringLong = "this is too long!!";

        expect(Validate([Validators.String.maxLength(10), stringLong])).toEqual("error");
        expect(Validate([Validators.String.maxLength(10), "".repeat(3)])).toEqual("error");
        expect(Validate([Validators.String.maxLength(10), stringShort])).toEqual("success");
    });

    it("should validate a non blank string", () => {
        expect(Validate([Validators.String.nonBlank, null])).toEqual("error");
        expect(Validate([Validators.String.nonBlank, undefined])).toEqual("error");
        expect(Validate([Validators.String.nonBlank, NaN])).toEqual("error");
        expect(Validate([Validators.String.nonBlank, ""])).toEqual("error");
        expect(Validate([Validators.String.nonBlank, "   "])).toEqual("error");
    });
});

describe("Number", () => {
    it("should validate a natural number", () => {
        expect(Validate([Validators.Number.natural, "4"])).toEqual("success");
        expect(Validate([Validators.Number.natural, "0"])).toEqual("success");

        expect(Validate([Validators.Number.natural, 4])).toEqual("error");
        expect(Validate([Validators.Number.natural, 0])).toEqual("error");
        expect(Validate([Validators.Number.natural, -0])).toEqual("error");
        expect(Validate([Validators.Number.natural, NaN])).toEqual("error");
        expect(Validate([Validators.Number.natural, undefined])).toEqual("error");
        expect(Validate([Validators.Number.natural, null])).toEqual("error");
        expect(Validate([Validators.Number.natural, 1.1])).toEqual("error");
        expect(Validate([Validators.Number.natural, -1])).toEqual("error");
        expect(Validate([Validators.Number.natural, -1.1])).toEqual("error");
        expect(Validate([Validators.Number.natural, "-0"])).toEqual("error");
        expect(Validate([Validators.Number.natural, "1.1"])).toEqual("error");
        expect(Validate([Validators.Number.natural, "-1"])).toEqual("error");
        expect(Validate([Validators.Number.natural, "-1.1"])).toEqual("error");
    });
});

describe("Port", () => {
    it("should validate a valid port", () => {
        expect(Validate([Validators.Port.valid, "22"])).toEqual("success");
        expect(Validate([Validators.Port.valid, "0"])).toEqual("success");
        expect(Validate([Validators.Port.valid, "65535"])).toEqual("success");

        expect(Validate([Validators.Port.valid, "22.22"])).toEqual("error");
        expect(Validate([Validators.Port.valid, ""])).toEqual("error");
        expect(Validate([Validators.Port.valid, "asdf"])).toEqual("error");
        expect(Validate([Validators.Port.valid, "-1"])).toEqual("error");
        expect(Validate([Validators.Port.valid, "-0"])).toEqual("error");
        expect(Validate([Validators.Port.valid, 22.22])).toEqual("error");
        expect(Validate([Validators.Port.valid, 0])).toEqual("error");
        expect(Validate([Validators.Port.valid, 22])).toEqual("error");
        expect(Validate([Validators.Port.valid, 65535])).toEqual("error");
        expect(Validate([Validators.Port.valid, -1])).toEqual("error");
        expect(Validate([Validators.Port.valid, null])).toEqual("error");
        expect(Validate([Validators.Port.valid, undefined])).toEqual("error");
        expect(Validate([Validators.Port.valid, NaN])).toEqual("error");
    });
});

describe("Boolean", () => {
    it("should validate a valid boolean", () => {
        expect(Validate([Validators.Boolean.valid, true])).toEqual("success");
        expect(Validate([Validators.Boolean.valid, false])).toEqual("success");
        expect(Validate([Validators.Boolean.valid, 1])).toEqual("error");
        expect(Validate([Validators.Boolean.valid, null])).toEqual("error");
    });
});

describe("URL", () => {
    it("should validate a valid url", () => {
        expect(Validate([Validators.URL.valid, "http://hello"])).toEqual("success");
        expect(Validate([Validators.URL.valid, "https://hello"])).toEqual("success");
        expect(Validate([Validators.URL.valid, "localhost:8080"])).toEqual("success");
        expect(Validate([Validators.URL.valid, "not an url"])).toEqual("error");
        expect(Validate([Validators.URL.valid, 123])).toEqual("error");
        expect(Validate([Validators.URL.valid, {}])).toEqual("error");
    });
});

describe("Password", () => {
    it("should validate a password as long as it is a string", () => {
        expect(Validate([Validators.Password.valid, ""])).toEqual("success");
        expect(Validate([Validators.Password.valid, "123123"])).toEqual("success");
        expect(Validate([Validators.Password.valid, "null"])).toEqual("success");
        expect(Validate([Validators.Password.valid, null])).toEqual("error");
        expect(Validate([Validators.Password.valid, undefined])).toEqual("error");
        expect(Validate([Validators.Password.valid, NaN])).toEqual("error");
        expect(Validate([Validators.Password.valid, 1234])).toEqual("error");
    });
});
