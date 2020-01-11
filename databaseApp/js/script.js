var firebaseConfig = {
    apiKey: "AIzaSyC1w7YPQfvAU1BVNL14HURvKIYIEZrQoZ8",
    databaseURL: "https://web-test-2191e.firebaseio.com",
    projectId: "web-test-2191e",
    storageBucket: "web-test-2191e.appspot.com",
    messagingSenderId: "145508912382",
    appId: "1:145508912382:web:8e47fc2d87ead175d5a9af"
  };
firebase.initializeApp(firebaseConfig);

VK.init({
    apiId: 7217440 
});

window.onscroll = function() {stickyGrid()};
var grid = document.getElementById('grid')
var sticky = grid.offsetTop;
loggedWith = null

database = firebase.database()

switchables = document.getElementsByClassName('switchable')
vkButton = document.getElementById('button-vk')
tableBody = document.getElementById('table-body')
table = document.getElementById('table-container')
blockButton = document.getElementById('button-block')
unblockButton = document.getElementById('button-unblock')
deleteButton = document.getElementById('button-delete')
statusAlert = document.getElementById('status')
hidePageContent()
tryToLog()

function vkLogIn(){
    VK.Auth.login(function(vkUser){
        user = vkUser.session.user
        id = user.id
        name = `${user.first_name} ${user.last_name}`
        loginWithSocial(id, name, '', 'vk')
    })
}

function onSignIn(googleUser) {
    profile = googleUser.getBasicProfile()
    id = profile.getId()
    loginWithSocial(id, profile.getName(), profile.getEmail(), 'google')
}

function yandexLogIn(){
    window.location.href = 'https://oauth.yandex.ru/authorize?client_id=f49a71ce12a247fcbccf7fcd49d01436&display=popup&response_type=token'
}

function logOut(){      
    switch(loggedWith){
        case 'google': {
            auth2 = gapi.auth2.getAuthInstance()
            auth2.signOut()
            break
        }
        case 'vk': {
            VK.Auth.logout()
            break
        }
    }
    logToggle()
    loggedWith = null
    tableBody.innerHTML = ''
    
}

function logIn(user){
    loggedWith = user.account
    statusAlert.innerHTML = `Logged as ${user.name} with ${user.account}`
    logToggle()
    getDataOnce('users/').then(data =>{
        fillTable(data)
    })
    database.ref('users/').on('value', data =>{
        fillTable(data)
    })
}

function changeBlockState(state){
    ids = getCheckedIds()
    updates = {}
    ids.forEach(item =>{
        updateDatabase('users/' + item + '/isBlocked', state)
    })
}

function deleteSelected(){
    ids = getCheckedIds()
    ids.forEach(item =>{
        database.ref('users/' + item).remove()
        if(item == user.id){
            logOut()
        }
    })
}