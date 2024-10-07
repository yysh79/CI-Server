"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const indexRout_js_1 = __importDefault(require("./routes/indexRout.js"));
const mongoDbConect_js_1 = require("./config/mongoDbConect.js");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./swagger_output.json"));
const cors_1 = __importDefault(require("cors"));
(0, mongoDbConect_js_1.connectDatabase)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use('/swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
app.use(express_1.default.json());
app.use('/', indexRout_js_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
