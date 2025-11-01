import { Request,Response, Router } from "express";
import cors from 'cors'
import { Employee } from "../types/employee";
import {v4 as uuidv4} from 'uuid'

//in-memory
let employees: Employee[] = []

export const employeeRouter = Router()

//GET all employees
employeeRouter.get('/employees',(req:Request,res:Response)=>{
    res.json(employees)
})

//SEARCH by firstname
employeeRouter.get('/employees/search',(req:Request,res:Response)=>{
    const firstname = req.query.firstname?.toString().toLowerCase()
    const results = employees.filter( t => t.firstname.toLowerCase().includes(firstname || ''))
    res.json(results)
})

//GET employee by ID
employeeRouter.get('/employees/:id',(req:Request,res:Response)=>{
    const employee = employees.find(t => t.id === req.params.id)
    employee ? res.json(employee) : res.status(404).send('Employee not found')
})

//POST new employee
employeeRouter.post('/employees',(req:Request,res:Response)=>{
    const newEmployee: Employee = {id: uuidv4(),...req.body}
    employees.push(newEmployee)
    res.status(201).json(newEmployee)
})

//PUT update employee
employeeRouter.put('/employees/:id',(req:Request,res:Response)=>{
    const indexEmployee = employees.findIndex(t => t.id === req.params.id)
    if(indexEmployee !== -1){
        employees[indexEmployee] = {...employees[indexEmployee], ...req.body}
        res.json(employees[indexEmployee])
    }else{
        res.status(404).send('Employee not found')
    }
})

//DELETE employee
employeeRouter.delete('/employees/:id',(req:Request,res:Response)=>{
    const indexE = employees.findIndex(t => t.id === req.params.id)
    if(indexE !== -1){
        const deleteEmployee = employees.splice(indexE,1)
        res.json(deleteEmployee[0])
    }else{
        res.status(404).send('Employee not found')
    }
})
