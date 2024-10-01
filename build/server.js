"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoDbConect_js_1 = require("./config/mongoDbConect.js");
const indexRout_js_1 = __importDefault(require("./routes/indexRout.js"));
const express_1 = __importDefault(require("express"));
(0, mongoDbConect_js_1.connectDatabase)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/', indexRout_js_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
