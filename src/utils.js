module.exports = {
    exists: (str) => {
        const path = require("path");
        const fs = require("fs");
        return fs.existsSync(path.join(str));
    }
};
