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
const API = "http://localhost:3500/employees";
// Fetch all employees
const getEmployees = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(API);
    if (!res.ok)
        throw new Error(`Failed to get employees: ${res.statusText}`);
    return yield res.json();
});
// Make sure these functions are available in the window object
window.editEmployee = function (id) {
    editEmployee(id).catch(console.error);
};
window.deleteEmployeeHandler = function (id) {
    deleteEmployeeHandler(id).catch(console.error);
};
// DOM Elements
const addForm = document.getElementById('addForm');
const editForm = document.getElementById('editForm');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const employeeList = document.getElementById('employeeList');
// Function to render employees list
const renderEmployees = (employees) => {
    employeeList.innerHTML = '';
    employees.forEach(emp => {
        const li = document.createElement('li');
        li.innerHTML = `
      <span>${emp.firstname} ${emp.lastname}</span>
      <button onclick="viewEmployeeInfo('${emp.id}')">View</button>
      <button onclick="editEmployee('${emp.id}')">Edit</button>
      <button onclick="deleteEmployeeHandler('${emp.id}')">Delete</button>
    `;
        employeeList.appendChild(li);
    });
};
// Function to render search results
const renderSearchResults = (employees) => {
    const employeeInfo = document.getElementById('employeeInfo');
    if (!employees || employees.length === 0) {
        employeeInfo.innerHTML = '<p>No Employees</p>';
        return;
    }
    const resultsHtml = employees.map(emp => `
    <div class="search-result">
      <h3>Name: ${emp.firstname} ${emp.lastname}</h3>
      <p>Age: ${emp.age}</p>
      <p>Civil Status: ${emp.isMarried ? 'Married' : 'Single'}</p>
    </div>
  `).join('');
    employeeInfo.innerHTML = `
    <div class="search-results">
      ${resultsHtml}
    </div>
  `;
};
// Add employee
const addEmployee = (firstname, lastname, age, isMarried) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, age, isMarried }),
    });
    if (!res.ok)
        throw new Error(`Failed to add employee: ${res.statusText}`);
    return yield res.json();
});
// Update employee
const updateEmployee = (id, firstname, lastname, age, isMarried) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, age, isMarried }),
    });
    if (!res.ok)
        throw new Error(`Failed to update employee: ${res.statusText}`);
    return yield res.json();
});
// Delete employee
const deleteEmployee = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(`${API}/${id}`, { method: "DELETE" });
    if (!res.ok)
        throw new Error(`Failed to delete employee: ${res.statusText}`);
    return yield res.json();
});
// Search employees
const searchEmployees = (firstname) => __awaiter(void 0, void 0, void 0, function* () {
    const searchParams = new URLSearchParams({ firstname }).toString();
    const res = yield fetch(`${API}/search?${searchParams}`);
    if (!res.ok)
        throw new Error(`Failed to search: ${res.statusText}`);
    const data = yield res.json();
    return data;
});
// Function to handle search
const handleSearch = () => __awaiter(void 0, void 0, void 0, function* () {
    const searchTerm = searchInput.value.trim();
    const employeeInfo = document.getElementById('employeeInfo');
    try {
        const employees = yield searchEmployees(searchTerm);
        renderSearchResults(employees);
    }
    catch (error) {
        console.error('Error searching:', error);
        employeeInfo.innerHTML = '<p>Employees not found</p>';
    }
});
// Event Handlers
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
    }
});
//add listeners of the form
//add new employee
addForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const firstname = document.getElementById('addFirstname').value;
    const lastname = document.getElementById('addLastname').value;
    const age = parseInt(document.getElementById('addAge').value);
    const isMarried = document.getElementById('addMarried').value === 'true';
    try {
        yield addEmployee(firstname, lastname, age, isMarried);
        addForm.reset();
        const employees = yield getEmployees();
        renderEmployees(employees);
    }
    catch (error) {
        console.error('Error adding employee:', error);
    }
}));
//update employees info
editForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const firstname = document.getElementById('editFirstname').value;
    const lastname = document.getElementById('editLastname').value;
    const age = parseInt(document.getElementById('editAge').value);
    const isMarried = document.getElementById('editMarried').value === 'true';
    try {
        yield updateEmployee(id, firstname, lastname, age, isMarried);
        editForm.reset();
        const employees = yield getEmployees();
        renderEmployees(employees);
    }
    catch (error) {
        console.error('Error updating employee:', error);
    }
}));
// Helper functions
function editEmployee(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const employees = yield getEmployees();
            const employee = employees.find(emp => emp.id === id);
            if (employee) {
                document.getElementById('editId').value = employee.id;
                document.getElementById('editFirstname').value = employee.firstname;
                document.getElementById('editLastname').value = employee.lastname;
                document.getElementById('editAge').value = employee.age.toString();
                document.getElementById('editMarried').value = employee.isMarried.toString();
            }
        }
        catch (error) {
            console.error('Error editing employee:', error);
        }
    });
}
function deleteEmployeeHandler(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (confirm('Are you sure you want to delete this employee?')) {
            try {
                yield deleteEmployee(id);
                const employees = yield getEmployees();
                renderEmployees(employees);
            }
            catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    });
}
//View info Employee
window.viewEmployeeInfo = function (id) {
    viewEmployeeInfo(id).catch(console.error);
};
function viewEmployeeInfo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const employees = yield getEmployees();
            const employee = employees.find(emp => emp.id === id);
            const employeeInfo = document.getElementById('employeeInfo');
            if (employee) {
                employeeInfo.innerHTML = `
        <p><strong>Name:</strong> ${employee.firstname} ${employee.lastname}</p>
        <p><strong>Age:</strong> ${employee.age}</p>
        <p><strong>Civil Status:</strong> ${employee.isMarried ? 'Married' : 'Single'}</p>
      `;
            }
            else {
                employeeInfo.innerHTML = '<p>Employee not found</p>';
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
// Initial load
window.addEventListener('load', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield getEmployees();
        renderEmployees(employees);
    }
    catch (error) {
        console.error('Error loading employees:', error);
    }
}));
