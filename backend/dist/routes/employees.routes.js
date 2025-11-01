"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeRouter = void 0;
const express_1 = require("express");
const uuid_1 = require("uuid");
//in-memory
let employees = [];
exports.employeeRouter = (0, express_1.Router)();
//GET all employees
exports.employeeRouter.get('/employees', (req, res) => {
    res.json(employees);
});
//SEARCH by firstname
exports.employeeRouter.get('/employees/search', (req, res) => {
    var _a;
    const firstname = (_a = req.query.firstname) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase();
    const results = employees.filter(t => t.firstname.toLowerCase().includes(firstname || ''));
    res.json(results);
});
//GET employee by ID
exports.employeeRouter.get('/employees/:id', (req, res) => {
    const employee = employees.find(t => t.id === req.params.id);
    employee ? res.json(employee) : res.status(404).send('Employee not found');
});
//POST new employee
exports.employeeRouter.post('/employees', (req, res) => {
    const newEmployee = Object.assign({ id: (0, uuid_1.v4)() }, req.body);
    employees.push(newEmployee);
    res.status(201).json(newEmployee);
});
//PUT update employee
exports.employeeRouter.put('/employees/:id', (req, res) => {
    const indexEmployee = employees.findIndex(t => t.id === req.params.id);
    if (indexEmployee !== -1) {
        employees[indexEmployee] = Object.assign(Object.assign({}, employees[indexEmployee]), req.body);
        res.json(employees[indexEmployee]);
    }
    else {
        res.status(404).send('Employee not found');
    }
});
//DELETE employee
exports.employeeRouter.delete('/employees/:id', (req, res) => {
    const indexE = employees.findIndex(t => t.id === req.params.id);
    if (indexE !== -1) {
        const deleteEmployee = employees.splice(indexE, 1);
        res.json(deleteEmployee[0]);
    }
    else {
        res.status(404).send('Employee not found');
    }
});
