
var boxList = Array.from(document.querySelectorAll("[data-title]"));
var temp = '';
for (var index = 0; index < boxList.length; index++){
    temp += boxList[index].getAttribute("data-title") + " ";
}

function addClassToBody(){
    var classOfBody = document.querySelector(".container");
    temp = classOfBody.getAttribute("class") + temp;
    classOfBody.setAttribute("class", "")
    
}

var dropdownList = document.querySelectorAll(".dropdown")
dropdownList.forEach(function(dropdownBtn){
    var btn = dropdownBtn.querySelector(".btn-dropdown")
    btn.addEventListener('click', function(event){
        if (dropdownBtn.classList.value.indexOf("open") != -1){
            dropdownBtn.classList.remove("open")
        } else{
            return dropdownBtn.classList.add("open");
        }
    });
})


var listSelect = Array.from(document.querySelectorAll("select[name]"));
listSelect.forEach(function(select){
    var listOption = Array.from(select.querySelectorAll("option"))
    listOption.forEach(function(option){
    var divWrapper = document.createElement("div");
        divWrapper.classList.add("custom-select");
        divWrapper.innerText = option.innerText;
    var divSelect = document.createElement("div");
        divSelect.classList.add("selected");
        divSelect.setAttribute("value", option.getAttribute("value"))
    console.log(divSelect)
    });
});
 
 function getComments() {
    return new Promise (function(resolve) {
       setTimeout(function(){
          resolve(comments)
       },1000)
    })
 }
 function getUsersbyIds(usersIds) {
    return new Promise(function(resolve) {
          var result = users.filter(function(user){
             return usersIds.includes(user.id)
          })
          resolve(result)
    })
 }
 
 getComments()
    .then(function(comments) {
        var usersIds = comments.map(function(comment){
            return comment.user_id
        }) 
            return getUsersbyIds(usersIds)
                .then(function(users) {
                    return {
                    users: users,
                    comments: comments
                    }
                })
    })
    .then(function(data) {
       var commentBlock = document.getElementById('comment-block');
       var html ='';
       data.comments.forEach(function(comment) {
          var user = data.users.find(function(user){
             return comment.user_id === user.id
          });
          html += `<li> ${user.name}: ${comment.content} </li>`
       })
       commentBlock.innerHTML = html
    }) 

var courseApi = "http://localhost:3000/courses";
function start() {
    getCourses(renderCourses);
    handleCreateForm();
}

start();

function getCourses(callback) {
    fetch(courseApi)
        .then( (response) => {
            return response.json();
        })
        .then(callback);
}

function createCourses(data, callback){
    var option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    };
    fetch(courseApi, option)
        .then( (response) => {
            return response.json();
        })
        .then(callback);
}


function handleCreateForm() {
    var createBtn = document.querySelector('#create');
    createBtn.onclick = function() {
        var name = document.querySelector('input[name="name"]').value;
        var description = document.querySelector('input[name="description"]').value;
        var formData = {
            name: name,
            description: description
        }
        createCourses(formData, function(){
            getCourses(renderCourses);
        })
    } 
   
}

function handleDeleteCourse(id){
    var option = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(courseApi + '/' + id, option)
        .then( (response) => {
            return response.json();
        })
        .then(function(){
            var deleteCourse = document.querySelector('.list-item' + id);
            if(deleteCourse){
                deleteCourse.remove();
            }
        });
}

// sua lai
function renderCourses(courses){
    var listCoursesBlock = document.querySelector('#list-courses');

    var html = courses.map(course =>{
       return `
       <li class=" list-item-${course.id}"> 
       <h4 id="textname-${course.id}">${course.name}</h4>
       <p id= "textDescription-${course.id}"> ${course.description}</p>
       <button onclick="handleDeleteCourse(${course.id})">xóa</boutton>
        <button onclick="hendleupdateCourses(${course.id})">Sửa</button>

       </li>
       `
    })
    listCoursesBlock.innerHTML=html.join('')

}

update
function hendleupdateCourses(id){

   var textName = document.querySelector('#textname-'+id).textContent
   var textDescriptom = document.querySelector('#textDescription-'+id).textContent
   var name= document.querySelector('input[name="name"]');
   var description= document.querySelector('input[name="description"]');
   var btnUpdate = document.querySelector('#even');

    name.value = textName;
    description.value = textDescriptom;

    var addBtnUpdate =`<button id="update">Change</button>`;
    var addBtnCreate =`<button id="create">Create</button>`;

    btnUpdate.innerHTML = addBtnUpdate;
    var editBtn = document.querySelector('#update');

    editBtn.onclick= function(){
        var data ={
            name:name.value,
            description:description.value
        };
        updateSourse(data,function() {
            getCouses(renderCourses);
       },id)
       //   Gán lại input bằng rỗng 
       name.value='';
       description.value='';
       // thêm lại botton create.
       btnUpdate.innerHTML=addBtnCreate;
       handleCreatForm();
       }
}
function updateSourse(data ,callback,id){
   
    var options = {
        method:'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(coursesAPI+ '/' +id,options)
        .then(function(response){
            return response.json();
        }).then(callback)
}


Logger = (log, type = 'log', notice) => {
    console[type](log)
    alert(notice)
}
Logger('Message', 'warn', 'cảnh báo')



