"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServerResponse = void 0;
const createServerResponse = (isSuccessful, data, displayMessage = null, description = null, exception = null) => {
    return {
        isSuccessful,
        displayMessage,
        description,
        exception,
        timestamp: new Date().toISOString(),
        data,
    };
};
exports.createServerResponse = createServerResponse;
