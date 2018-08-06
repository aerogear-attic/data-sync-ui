import { Validate, Validators } from "../../../ui/helper/Validators";

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
        expect(Validate([Validators.Number.natural, 4])).toEqual("success");
        expect(Validate([Validators.Number.natural, 0])).toEqual("success");
        expect(Validate([Validators.Number.natural, -0])).toEqual("success");
        expect(Validate([Validators.Number.natural, 1.1])).toEqual("error");
        expect(Validate([Validators.Number.natural, -1])).toEqual("error");
        expect(Validate([Validators.Number.natural, -1.1])).toEqual("error");
    });
});

describe("Port", () => {
    it("should validate a valid port", () => {
        expect(Validate([Validators.Port.valid, 0])).toEqual("success");
        expect(Validate([Validators.Port.valid, 22])).toEqual("success");
        expect(Validate([Validators.Port.valid, 65535])).toEqual("error");
        expect(Validate([Validators.Port.valid, -1])).toEqual("error");
        expect(Validate([Validators.Port.valid, ""])).toEqual("error");
        expect(Validate([Validators.Port.valid, null])).toEqual("error");
        expect(Validate([Validators.Port.valid, undefined])).toEqual("error");
        expect(Validate([Validators.Port.valid, NaN])).toEqual("error");
        expect(Validate([Validators.Port.valid, "222"])).toEqual("error");
        expect(Validate([Validators.Port.valid, 22.22])).toEqual("error");
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
