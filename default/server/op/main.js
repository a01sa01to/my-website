"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnError = void 0;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const notAllowed_1 = __importDefault(require("./notAllowed"));
const main_1 = __importDefault(require("./opendata/main"));
const opendata_old_1 = require("./opendata_old");
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
const new_dirname = path_1.default.join(__dirname, '..', '..');
app.set('json spaces', 2);
app.use((req, res) => {
    if (req.hostname.startsWith('www')) {
        res.redirect(301, `https://a01sa01to.com${req.path}`);
        return;
    }
    console.log(req.path);
    for (let nonAllow of notAllowed_1.default) {
        if (req.path.match(new RegExp(nonAllow))) {
            res.status(404).sendFile(path_1.default.join(new_dirname, `err/404.html`));
            return;
        }
    }
    if (req.path.includes('opendata/data/')) {
        (0, opendata_old_1.opendataRequest_old)(req, res);
        return;
    }
    if (req.path.includes('opendata/api/')) {
        (0, main_1.default)(req, res);
        return;
    }
    if (!req.path.includes('.')) {
        const rewritePath = path_1.default.join(new_dirname, `${req.path}.html`);
        if (fs_1.default.existsSync(rewritePath)) {
            res.sendFile(rewritePath);
            return;
        }
    }
    if (req.path.endsWith('/')) {
        const rewritePath = path_1.default.join(new_dirname, `${req.path}index.html`);
        if (fs_1.default.existsSync(rewritePath)) {
            res.sendFile(rewritePath);
            return;
        }
    }
    res.sendFile(path_1.default.join(new_dirname, req.path));
});
const ReturnError = (err, req, res, next) => {
    console.error(err);
    res
        .status(err.statusCode)
        .sendFile(path_1.default.join(new_dirname, `err/${err.statusCode}.html`));
};
exports.ReturnError = ReturnError;
app.use((err, req, res, next) => ReturnError(err, req, res, next));
app.listen(port, () => console.log(`Listening on ${port}`));
