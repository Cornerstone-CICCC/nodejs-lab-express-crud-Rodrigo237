interface Employee {
  id: string;
  firstname: string;
  lastname: string;
  age: number;
  isMarried: boolean;
}

const API = "http://localhost:3500/employees";

// Fetch all employees
const getEmployees = async (): Promise<Employee[]> => {
  const res = await fetch(API);
  if (!res.ok) throw new Error(`Failed to get employees: ${res.statusText}`);
  return await res.json();
};

// Make sure these functions are available in the window object
(window as any).editEmployee = function(id: string) {
    editEmployee(id).catch(console.error);
};

(window as any).deleteEmployeeHandler = function(id: string) {
    deleteEmployeeHandler(id).catch(console.error);
};

// DOM Elements
const addForm = document.getElementById('addForm') as HTMLFormElement;
const editForm = document.getElementById('editForm') as HTMLFormElement;
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const searchBtn = document.getElementById('searchBtn') as HTMLButtonElement;
const employeeList = document.getElementById('employeeList') as HTMLUListElement;

// Function to render employees list
const renderEmployees = (employees: Employee[]) => {
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
const renderSearchResults = (employees: Employee[]) => {
  const employeeInfo = document.getElementById('employeeInfo') as HTMLDivElement;
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
const addEmployee = async (
  firstname: string,
  lastname: string,
  age: number,
  isMarried: boolean
): Promise<Employee> => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstname, lastname, age, isMarried }),
  });
  if (!res.ok) throw new Error(`Failed to add employee: ${res.statusText}`);
  return await res.json();
};

// Update employee
const updateEmployee = async (
  id: string,
  firstname: string,
  lastname: string,
  age: number,
  isMarried: boolean
): Promise<Employee> => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstname, lastname, age, isMarried }),
  });
  if (!res.ok) throw new Error(`Failed to update employee: ${res.statusText}`);
  return await res.json();
};

// Delete employee
const deleteEmployee = async (id: string): Promise<Employee> => {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete employee: ${res.statusText}`);
  return await res.json();
};

// Search employees
const searchEmployees = async (firstname: string): Promise<Employee[]> => {
  const searchParams = new URLSearchParams({ firstname }).toString();
  const res = await fetch(`${API}/search?${searchParams}`);
  if (!res.ok) throw new Error(`Failed to search: ${res.statusText}`);
  const data = await res.json();
  return data;
};

// Function to handle search
const handleSearch = async () => {
  const searchTerm = searchInput.value.trim();
  const employeeInfo = document.getElementById('employeeInfo') as HTMLDivElement; 
  try {
    const employees = await searchEmployees(searchTerm);
    renderSearchResults(employees);
  } catch (error) {
    console.error('Error searching:', error);
    employeeInfo.innerHTML = '<p>Employees not found</p>';
  }
};

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
addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const firstname = (document.getElementById('addFirstname') as HTMLInputElement).value;
  const lastname = (document.getElementById('addLastname') as HTMLInputElement).value;
  const age = parseInt((document.getElementById('addAge') as HTMLInputElement).value);
  const isMarried = (document.getElementById('addMarried') as HTMLSelectElement).value === 'true';

  try {
    await addEmployee(firstname, lastname, age, isMarried);
    addForm.reset();
    const employees = await getEmployees();
    renderEmployees(employees);
  } catch (error) {
    console.error('Error adding employee:', error);
  }
});

//update employees info
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = (document.getElementById('editId') as HTMLInputElement).value;
  const firstname = (document.getElementById('editFirstname') as HTMLInputElement).value;
  const lastname = (document.getElementById('editLastname') as HTMLInputElement).value;
  const age = parseInt((document.getElementById('editAge') as HTMLInputElement).value);
  const isMarried = (document.getElementById('editMarried') as HTMLSelectElement).value === 'true';

  try {
    await updateEmployee(id, firstname, lastname, age, isMarried);
    editForm.reset();
    const employees = await getEmployees();
    renderEmployees(employees);
  } catch (error) {
    console.error('Error updating employee:', error);
  }
});

// Helper functions
async function editEmployee(id: string) {
  try {
    const employees = await getEmployees();
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
      (document.getElementById('editId') as HTMLInputElement).value = employee.id;
      (document.getElementById('editFirstname') as HTMLInputElement).value = employee.firstname;
      (document.getElementById('editLastname') as HTMLInputElement).value = employee.lastname;
      (document.getElementById('editAge') as HTMLInputElement).value = employee.age.toString();
      (document.getElementById('editMarried') as HTMLSelectElement).value = employee.isMarried.toString();
    }
  } catch (error) {
    console.error('Error editing employee:', error);
  }
}

async function deleteEmployeeHandler(id: string) {
  if (confirm('Are you sure you want to delete this employee?')) {
    try {
      await deleteEmployee(id);
      const employees = await getEmployees();
      renderEmployees(employees);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  }
}

//View info Employee
(window as any).viewEmployeeInfo = function(id: string) {
  viewEmployeeInfo(id).catch(console.error);
};

async function viewEmployeeInfo(id: string) {
  try {
    const employees = await getEmployees();
    const employee = employees.find(emp => emp.id === id);
    const employeeInfo = document.getElementById('employeeInfo') as HTMLDivElement;
    if (employee) {
      employeeInfo.innerHTML = `
        <p><strong>Name:</strong> ${employee.firstname} ${employee.lastname}</p>
        <p><strong>Age:</strong> ${employee.age}</p>
        <p><strong>Civil Status:</strong> ${employee.isMarried ? 'Married' : 'Single'}</p>
      `;
    } else {
      employeeInfo.innerHTML = '<p>Employee not found</p>';
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


// Initial load
window.addEventListener('load', async () => {
  try {
    const employees = await getEmployees();
    renderEmployees(employees);
  } catch (error) {
    console.error('Error loading employees:', error);
  }
});