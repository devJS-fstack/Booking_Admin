
const navheader = document.querySelector('.navbar');

navheader.style.display = 'none'

// create instance axios config



const instance = axios.create({
    baseURL: '',
    timeOut: 3 * 100000,
    headers: {
        'Content-Type': 'application/json'
    },
});

// xu ly data truoc khi xuong server
instance.interceptors.request.use((config) => {
    //console.log('before request');

    return config;
}, err => {
    return Promise.reject(err)
})

// xu ly data khi response tu server
instance.interceptors.response.use((config) => {
    //console.log('before response: ');

    return config;
}, err => {
    return Promise.reject(err)
})


// check Token 


// }
async function checkToken(accessToken) {
    return (await instance.post('/checkToken', {
        accessToken
    })).data;
}

async function checkDuplicatePhone(phone) {
    return (await instance.post('/regis/checkDuplicatePhone', {
        data: {
            phone: phone
        }
    })).data;
}

async function checkDuplicateEmail(email) {
    return (await instance.post('/regis/checkDuplicateEmail', {
        data: {
            email: email
        }
    })).data;
}

async function login() {
    return (await instance.post('/login', {
        data: {
            account: inputAccount.value,
            password: inputPassword.value,
        }
    })).data;
}


const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const validatePhone = (phone) => {
    return /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/.test(phone);
}

const validatePassword = (pass) => {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(pass);
}