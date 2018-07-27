const formatType = type => {
    let result = "";
    switch (type.kind) {
        case "LIST":
            result += `[${formatType(type.ofType)}]`;
            break;
        case "NON_NULL":
            result += `${formatType(type.ofType)}!`;
            break;
        default:
            result += type.name;
    }

    return result;
};

export { formatType };
