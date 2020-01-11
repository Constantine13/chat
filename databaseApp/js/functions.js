function stickyGrid(){
    if (window.pageYOffset > sticky) {
        grid.classList.add("sticky");
      } else {
        grid.classList.remove("sticky");
      }
}

function loginWithSocial(id, name, email, social){
    getDataOnce(`users/${id}`).then(function(data){
        user = data.val()
        if(user != null){
            isBlocked = user.isBlocked
            if(!isBlocked){
                updateState(user)
                logIn(user)
            }else{
                logToggle()
                logOut()
            }
        }else{
            user = createUser(id, name, email, social)
            logIn(user)
        }
    })
}

function updateState(user){
    date = getDate()
    updateDatabase(`users/${user.id}/signInTime`, date)
    updateDatabase(`users/${user.id}/email`, user.email)
    updateDatabase(`users/${user.id}/name`, user.name)
}

function getDataOnce(path){
    return database.ref(path).once('value')
}

function updateDatabase(path, data){
    update = {}
    update[path] = data
    database.ref().update(update)
}

function getDate(){
    return (new Date).toString()
}

function createUser(id, name, email, account){
    date = getDate()
    user = {
        id : id,
        name : name,
        email : email,
        signUpTime : date,
        signInTime : date,
        account : account,
        isBlocked : false
    }
    updateDatabase(`users/${id}/`, user)
    return user
}

function hidePageContent(){
    elements = document.getElementsByClassName('hide')
    for (var i = 0; i < elements.length; i++){
        elements[i].style.visibility = 'hidden'
    }
}

function logToggle(){
    for (var i = 0; i < switchables.length; i++){
        if(switchables[i].style.visibility == 'hidden'){
            switchables[i].style.visibility = 'visible'
        }else{
            switchables[i].style.visibility = 'hidden'
        }
    }
}

function formRow(currentUser){
    return  `<tr>
                <th>${currentUser.id}</th>
                <th>${currentUser.name}</th>
                <th>${currentUser.email}</th>
                <th>${currentUser.signInTime}</th>
                <th>${currentUser.signUpTime}</th>
                <th>${currentUser.isBlocked}</th>
                <th>${currentUser.account}</th>
                <th>
                    <input class="checkbox selector" type="checkbox" value="${currentUser.id}"/>
                </th>
            </tr>`
}

function fillTable(data){
    html = ''
    data = data.val()
    for (var prop in data) {
        if (Object.prototype.hasOwnProperty.call(data, prop)) {
            currentUser = data[prop]
            if(user.id == currentUser.id && currentUser.isBlocked){
                logOut()
            }
            temp = formRow(currentUser)
            html += temp
        }
    }
    tableBody.innerHTML = html
}

function checkAll(mainCheckbox) {
    var checkboxes = document.getElementsByTagName('input');
    for(var i=0; i < checkboxes.length; i++) {
      if(checkboxes[i].type == 'checkbox') {
        checkboxes[i].checked = mainCheckbox.checked;
      }
    }
}

function getCheckedIds(){
    var checkboxes = document.getElementsByClassName('selector');
    ids = []
    for(var i=0; i < checkboxes.length; i++) {
        if(checkboxes[i].checked) {
          ids.push(checkboxes[i].value)
        }
      }
    return ids
}

function tryToLog(){
    try{
        var token = /access_token=([^&]+)/.exec(document.location.hash)[1]
        $.ajax({
            url: "https://login.yandex.ru/info",
            type: 'get',
            data:{
                format:'json',
                with_openid_identity: 1,
                    oauth_token : token
                },
            success: function(data){
                loginWithSocial(data.id, data.first_name, data.emails[0], 'yandex')
            }
        })
    }catch(e){}
}