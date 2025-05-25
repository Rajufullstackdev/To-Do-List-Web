let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");
let todoForm = document.getElementById("todoForm");
let clearCompletedButton = document.getElementById("clearCompletedButton");

function getTodoListFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    return parsedTodoList === null ? [] : parsedTodoList;
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

saveTodoButton.onclick = function() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
};

function onAddTodo(event) {
    if (event) event.preventDefault();
    let userInputElement = document.getElementById("todoUserInput");
    let userInputValue = userInputElement.value.trim();

    if (userInputValue === "") {
        userInputElement.classList.add("is-invalid");
        userInputElement.setAttribute("aria-invalid", "true");
        userInputElement.focus();
        return;
    } else {
        userInputElement.classList.remove("is-invalid");
        userInputElement.removeAttribute("aria-invalid");
    }

    todosCount += 1;

    let newTodo = {
        text: userInputValue,
        uniqueNo: todosCount,
        isChecked: false
    };
    todoList.push(newTodo);
    createAndAppendTodo(newTodo);
    userInputElement.value = "";
    userInputElement.focus();
}

addTodoButton.onclick = function(event) {
    onAddTodo(event);
};
todoForm.onsubmit = onAddTodo;

function onTodoStatusChange(checkboxId, labelId, todoId) {
    let labelElement = document.getElementById(labelId);
    labelElement.classList.toggle("checked");

    let todoObjectIndex = todoList.findIndex(function(eachTodo) {
        return "todo" + eachTodo.uniqueNo === todoId;
    });

    if (todoObjectIndex > -1) {
        todoList[todoObjectIndex].isChecked = !todoList[todoObjectIndex].isChecked;
    }
}

function onDeleteTodo(todoId) {
    let todoElement = document.getElementById(todoId);
    if (todoElement) todoItemsContainer.removeChild(todoElement);

    let deleteElementIndex = todoList.findIndex(function(eachTodo) {
        return "todo" + eachTodo.uniqueNo === todoId;
    });

    if (deleteElementIndex > -1) {
        todoList.splice(deleteElementIndex, 1);
    }
}

function createAndAppendTodo(todo) {
    let todoId = "todo" + todo.uniqueNo;
    let checkboxId = "checkbox" + todo.uniqueNo;
    let labelId = "label" + todo.uniqueNo;

    let todoElement = document.createElement("li");
    todoElement.className = "todo-item-container d-flex flex-row align-items-center";
    todoElement.id = todoId;
    todoElement.setAttribute("role", "listitem");
    todoItemsContainer.appendChild(todoElement);

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = checkboxId;
    inputElement.checked = todo.isChecked;
    inputElement.className = "checkbox-input";
    inputElement.setAttribute("aria-label", "Mark todo as done");
    inputElement.onclick = function() {
        onTodoStatusChange(checkboxId, labelId, todoId);
    };
    todoElement.appendChild(inputElement);

    let labelContainer = document.createElement("div");
    labelContainer.className = "label-container d-flex flex-row align-items-center";
    todoElement.appendChild(labelContainer);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.className = "checkbox-label";
    labelElement.textContent = todo.text;
    if (todo.isChecked) {
        labelElement.classList.add("checked");
    }
    labelContainer.appendChild(labelElement);

    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.className = "delete-icon-container";
    labelContainer.appendChild(deleteIconContainer);

    let deleteIcon = document.createElement("i");
    deleteIcon.className = "far fa-trash-alt delete-icon";
    deleteIcon.setAttribute("tabindex", "0");
    deleteIcon.setAttribute("aria-label", "Delete todo");
    deleteIcon.onclick = function() {
        onDeleteTodo(todoId);
    };
    deleteIcon.onkeypress = function(e) {
        if (e.key === "Enter" || e.key === " ") {
            onDeleteTodo(todoId);
        }
    };
    deleteIconContainer.appendChild(deleteIcon);
}

// Clear completed todos feature
clearCompletedButton.onclick = function() {
    let remainingTodos = [];
    todoList.forEach(function(todo) {
        if (!todo.isChecked) {
            remainingTodos.push(todo);
        } else {
            let todoElement = document.getElementById("todo" + todo.uniqueNo);
            if (todoElement) {
                todoItemsContainer.removeChild(todoElement);
            }
        }
    });
    todoList = remainingTodos;
};

// Render any existing todos
for (let todo of todoList) {
    createAndAppendTodo(todo);
}