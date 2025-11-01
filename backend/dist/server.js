"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const employees_routes_1 = require("./routes/employees.routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3500;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Use employee routes
app.use('/', employees_routes_1.employeeRouter);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
