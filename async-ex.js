let bonjour = (callback) => {
    setTimeout(()=>{
        console.log('Hello')    
        callback();
    }, 2000);
};

let bye = (x) =>{
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Hello bye');
            resolve('bye'+x)
        },x);
    });
    return promise;
};


bonjour = () => {
    const promise = new Promise((resolve, reject) =>{
        setTimeout(()=>{
            console.log('Hello bonjour');    
            resolve('bonjour');
        }, 2000);
    });
    return promise;
};

bonjour()
.then(text => {
    console.log(`${text} done`);
    bye(1500)
    .then(textBye => {
        console.log(`${textBye} done`);
        bye(3000)
        .then(textBye => {
            console.log(`${textBye} done`);
        });
    });
    return 'second '+text;
})
.then(text => {
    console.log(`${text} done`);
    bye(1500)
    .then(textBye => {
        console.log(`${textBye} done`);
        bye(3000)
        .then(textBye => {
            console.log(`${textBye} done`);
        });
    });
});

