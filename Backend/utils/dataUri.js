const DataUriParser = require("datauri/parser");
const path = require("path");

const getDataUri = (file) => {
    const parser = new DataUriParser();
    const ext = path.extname(file.originalname);
    return parser.format(ext, file.buffer);
};

module.exports = getDataUri;
