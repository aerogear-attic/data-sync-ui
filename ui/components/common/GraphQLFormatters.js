const formatType = type => {
    let result = "";
    switch (type.kind) {
        case "LIST":
            result += "[";
            result += formatType(type.ofType);
            result += "]";
            break;
        case "NON_NULL":
            result += formatType(type.ofType);
            result += "!";
            break;
        default:
            result += type.name;
    }

    return result;
};

export { formatType };
