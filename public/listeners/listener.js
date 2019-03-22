// var headerLink = document.querySelectorAll(".headerItems a li");
// console.log(headerLink);

// headerLink.forEach(function(lk){
//     lk.addEventListener('click', function(e){
//         e.target.classList.add("active");
//     });
// });
function toArray(obj) {
    var array = [];
    // iterate backwards ensuring that length is an UInt32
    for (var i = obj.length >>> 0; i--;) { 
      array[i] = obj[i];
    }
    return array;
}

var windows = document;
var mainDiv = document.querySelector('.mainDiv');
var loginOverlay= document.getElementById('login-overlay');
var signupOverlay= document.getElementById('signup-overlay');
var resetOverlay= document.getElementById('reset-overlay');

var loginBtn = document.getElementById('login-btn');
var signupBtn = document.getElementById('signup-btn');
var resetPasswordBtn = document.getElementById('reset-password-btn');

var dropDownMenu =  document.getElementById('dropdown');
var navbar_collapse = document.getElementById('navbar');

console.log(dropDownMenu);

console.log(loginOverlay);
console.log(loginBtn);
if (loginBtn){
    loginBtn.addEventListener('click', function(e){
        loginOverlay.classList.add("overlay");
        loginOverlay.classList.remove("hide");
        signupOverlay.classList.remove("overlay");
        signupOverlay.classList.add("hide");
        resetOverlay.classList.remove("overlay");
        resetOverlay.classList.add("hide");
        var messages = document.querySelector('.messageDanger');
        if (messages){
            messages.parentNode.removeChild(messages);
        }
        console.log(messages);
            
        e.stopPropagation();
    
    });
}

if (signupBtn){
    signupBtn.addEventListener('click', function(e){
        signupOverlay.classList.add("overlay");
        signupOverlay.classList.remove("hide");
        loginOverlay.classList.remove("overlay");
        loginOverlay.classList.add("hide");
        resetOverlay.classList.remove("overlay");
        resetOverlay.classList.add("hide");
        var messages = document.querySelector('.messageDanger');
        if (messages){
            messages.parentNode.removeChild(messages);
        }
        console.log(messages);
    
        e.stopPropagation();
    
    });
}
if (resetPasswordBtn){
    resetPasswordBtn.addEventListener('click', function(e){
        resetOverlay.classList.add("overlay");
        resetOverlay.classList.remove("hide");
        signupOverlay.classList.remove("overlay");
        signupOverlay.classList.add("hide");
        loginOverlay.classList.remove("overlay");
        loginOverlay.classList.add("hide");
        var messages = document.querySelector('.messageDanger');
        if (messages){
            messages.parentNode.removeChild(messages);
        }
        console.log(messages);
    
        e.stopPropagation();
    });
}

document.addEventListener('click', e=>{
    signupOverlay.classList.add("hide");
    signupOverlay.classList.remove("overlay");
    loginOverlay.classList.remove("overlay");
    loginOverlay.classList.add("hide");
    console.log(e);
    if (toArray(navbar_collapse.classList).indexOf('in') != -1){
        navbar_collapse.classList.toggle("in");
    }

    if (e.target.className === 'navbar-toggle' || e.target.className ==='icon-bar'){
        navbar_collapse.classList.toggle("in");
    }

    var messages = document.querySelector('.messageDanger');
    if (messages){
        messages.parentNode.removeChild(messages);
    }
    console.log(messages);


});

loginOverlay.addEventListener('click', e=>{
    e.stopPropagation();
});
signupOverlay.addEventListener('click', e=>{
    e.stopPropagation();
});

dropDownMenu.addEventListener('click', e=>{
    dropDownMenu.classList.toggle("open");
    e.stopPropagation();
})
