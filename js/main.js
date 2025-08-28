let form = document.querySelector("form"),
    addbtn = form.querySelector("button"),
    inputs = Array.from(form.querySelectorAll("input")),
    tbody = document.querySelector("tbody"),
    modal = document.querySelector(".modal"),
    modalbody = modal.querySelector(".modal-body"),
    modalheader = modal.querySelector("h1"),
    modalconfirmbtn = modal.querySelector(".confirm"),
    students=[]

if (localStorage.getItem("student") !== null) {
    students = JSON.parse(localStorage.getItem("student")) || []
    showstudent(students)
}

function checkcontent() {
    if (students.length == 0) {
        document.querySelector(".nodata").classList.remove("d-none")
    } else {
        document.querySelector(".nodata").classList.add("d-none")
    }
}
checkcontent();

function updatelocalstorage() {
    localStorage.setItem("student", JSON.stringify(students))
}

function addstudent() {
    let studentdata = {}
    inputs.forEach(function (input) {
        let inputname = input.name,
            inputvalue = input.value
        studentdata[inputname] = inputvalue
    })
    students.push(studentdata)
    studentdata.id = students.length
    return studentdata
}

function showstudent(students) {
    tbody.innerHTML = ``
    students.forEach(function (student, index) {
        let row = `
            <tr">
                <td>${index+1}</td>
                <td>${student.firstname}</td>
                <td>${student.lastname}</td>
                <td>${student.email}</td>
                <td>${student.age}</td>
                <td>${student.phone}</td>
                <td>
                    <button class="btn btn-info text-light" onclick="editstudent(this, ${student.id})">edit</button>
                    <button class="btn btn-primary text-light d-none undo" onclick="undo(this)">undo</button>
                    <button class="btn btn-danger text-light" onclick="deletestudent(${student.id})" data-bs-toggle="modal" data-bs-target="#staticBackdrop">delete</button>
                </td>
            </tr>
        `
        tbody.innerHTML += row
    })
}

function clearform() {
    form.reset()
    inputs.forEach(function (input) {
        input.classList.remove("is-valid", "alert", "is-invalid")
        input.nextElementSibling.classList.add("d-none")
    })
    addbtn.classList.remove("btn-info")
    addbtn.setAttribute("data-type", "add")
    addbtn.innerHTML = "add"
    addbtn.removeAttribute("data-bs-toggle")
    addbtn.removeAttribute("data-bs-target")
}

function checkvalidation() {
    let check = true;
    inputs.forEach(function (input) {
        if (input.classList.contains("is-invalid")) {
            check = false
        }
    })
    return check
}

function getindex(studentid) {
    let index = students.findIndex(function (student) {
        return student.id == studentid
    })
    return index
}

function deletestudent(studentid) {
    deletemodal()
    modalconfirmbtn.onclick = function () {
        let currentstudentindex = getindex(studentid)
        students.splice(currentstudentindex, 1)
        updatelocalstorage()
        showstudent(students)
        clearform()
        checkcontent()
    }
}

function undo(that) {
    clearform()
    that.classList.add("d-none")
    that.previousElementSibling.classList.remove("d-none")
}

let editstudentindex
function editstudent(that, studentid) {
    addbtn.innerHTML = "edit"
    addbtn.classList.add("btn-info")
    addbtn.setAttribute("data-bs-toggle", "modal")
    addbtn.setAttribute("data-bs-target", "#staticBackdrop")
    addbtn.setAttribute("data-type", "edit")
    editstudentindex = getindex(studentid)
    addbtn.setAttribute("data-index", editstudentindex)
    let studentdata = students[editstudentindex]
    inputs.forEach(function (input) {
        let name = input.getAttribute("name")
        input.value = studentdata[name]
    })
    that.nextElementSibling.classList.remove("d-none")
    that.classList.add("d-none")
}

// form adding and editing

function formadd() {
    let student = addstudent();
    updatelocalstorage()
    showstudent(students)
    // checkcontent()
    addbtn.setAttribute("data-type", "add")
}

function editform() {
    editmodal()
    modalconfirmbtn.onclick = function () {
        let editedstudent = {};
        inputs.forEach(function (input) {
            let name = input.getAttribute("name")
            editedstudent[name] = input.value
        })
        editedstudent.id = addbtn.getAttribute("data-index")
        students[addbtn.getAttribute("data-index")] = editedstudent
        updatelocalstorage()
        showstudent(students)
        clearform()
        tbody.querySelectorAll("tr")[editstudentindex].classList.add("table-success")
        setTimeout(function () {
            tbody.querySelectorAll("tr")[editstudentindex].classList.remove("table-success")
        }, 1500)
    } 
}

// editing modal content

function editmodal() {
    modalbody.innerHTML = "do you want to save changes?"
    modalheader.innerHTML = "edit"
    modalconfirmbtn.innerHTML = "yes, save"
    modalconfirmbtn.classList.add("btn-info")
    modalconfirmbtn.classList.remove("btn-danger")
}
function deletemodal() {
    modalbody.innerHTML = "Are you sure?"
    modalheader.innerHTML = "delete"
    modalconfirmbtn.innerHTML = "yes, delete"
    modalconfirmbtn.classList.remove("btn-info")
    modalconfirmbtn.classList.add("btn-danger")
}


form.addEventListener("submit", function (event) {
    event.preventDefault()

    let check = checkvalidation();

    if (!check) {
        return 0;
    }
    
    if (addbtn.getAttribute("data-type") === "add") {
        formadd()
        clearform()
        checkcontent()
    } else {
        editform()
    }
    document.querySelector(".clear").classList.remove("active")

})


inputs.forEach(function (input, index) {
    let regexarr = [/^[A-Za-z]{1}[a-z]+$/, /^[A-Za-z]{1}[a-z]+$/, /^[A-Za-z]+[_\.]*\w*@(gmail|outlook)\.(com|io)$/, /^[1-6][0-9]$/, /^(02)?(01)(0|1|2|5)[0-9]{8}$/]
    input.addEventListener("blur", function () {
        if (input.value == "") {
            input.nextElementSibling.innerHTML = "this field is required"
        } else {
            input.nextElementSibling.innerHTML = "invalid"
        }
        if (regexarr[index].test(input.value.trim())) {
            input.classList.add("is-valid", "alert", "alert-success")
            input.classList.remove("is-invalid", "alert-danger")
            input.nextElementSibling.classList.add("d-none")
        } else {
            input.classList.remove("is-valid", "alert-success")
            input.classList.add("is-invalid", "alert", "alert-danger")
            input.nextElementSibling.classList.remove("d-none")
        }
    })
})

inputs.forEach(function (input) {
    input.onfocus = function () {
        document.querySelector(".clear").classList.add("active")
    }
})
document.querySelector(".clear > button").addEventListener("click", function () {
    clearform()
    this.parentElement.classList.remove("active")
})