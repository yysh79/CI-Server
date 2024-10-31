"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocument = void 0;
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/*.js']; // נתיבי הקבצים שלך
const doc = {
    info: {
        title: 'My API',
        version: '1.0.0',
    },
};
const generateSwagger = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, swagger_autogen_1.default)(outputFile, endpointsFiles, doc);
        console.log('Swagger file generated successfully!');
    }
    catch (error) {
        console.error('Error generating Swagger file:', error);
    }
});
generateSwagger();
exports.swaggerDocument = doc;
