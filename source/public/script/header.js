const btnLogin = document.getElementById("btnLogin");
const formLogin = document.getElementById("formLogin");
const errLogin = document.querySelector('.err-login');
const errRegis = document.querySelector('.err-regis');
const errSpan = document.querySelector('.err-regis span');
const modalLogin = document.getElementById('modalLogin');
const nameUser = document.querySelector('.name-user');
const dropDownMenu = document.querySelector('.dropdown-menu');
const btnRegis = document.getElementById('btn-regis');
const formRegis = document.getElementById('formRegis');
const modalRegis = document.getElementById('regisModal');
const navheader = document.querySelector('.navbar');

navheader.style.display = 'none'



// create instance axios config

const inputAccount = document.querySelector('[name=inputAccount]');
const inputPassword = document.querySelector('[name=inputPassword]');

// get value input regis modal
const fullnameRegis = document.querySelector('[name=inputName]');
const phoneRegis = document.querySelector('[name=inputPhone]');
const emailRegis = document.querySelector('[name=inputEmail]');
const passwordRegis = document.querySelector('[name=inputPasswordNew]');

const instance = axios.create({
    baseURL: '',
    timeOut: 3 * 1000,
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

// xu ly login submit

btnLogin.onclick = async (e) => {
    e.preventDefault();
    const { status, elements } = await login();


    if (status == 'fail') {
        errLogin.style.display = 'block';
    }
    else {
        window.localStorage.setItem('accessToken', elements.token);
        window.localStorage.setItem('phoneCustomer', elements.phoneCustomer);
        $('#modalLogin').modal('hide');
        nameUser.innerHTML = elements.nameUser;
        dropDownMenu.innerHTML = `
            <a class="dropdown-item" data-toggle="modal" >Lịch sử tỏa sáng</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item log-out" data-toggle="modal">Đăng xuất</a>
            `
        window.location.href = '/';
        const dropdownItem = document.querySelector('.log-out')
        dropdownItem.onclick = () => {
            window.localStorage.clear();
            nameCustomerElement.innerHTML = 'Khách hàng';
            dropDownMenu.innerHTML = `
                <a class="dropdown-item" data-toggle="modal" data-target="#modalLogin">Đăng
                            nhập</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" data-toggle="modal" data-target="#regisModal">Đăng ký</a>
                `
        }
    }
}

// handle regis submit
const spanName = document.querySelector('.err-name');
const spanPhone = document.querySelector('.err-phone');
const spanEmail = document.querySelector('.err-email');
const spanPass = document.querySelector('.err-pass');
const notiRegis = (style, textErr, itemFocus, span) => {
    span.style.display = style;
    span.textContent = textErr;
    if (itemFocus) itemFocus.focus();
}

const checkNameRegis = () => {
    if (fullnameRegis.value == '') {
        notiRegis('block', 'Anh vui lòng nhập họ tên của mình ạ', fullnameRegis, spanName);
        return false;
    }
    else {
        notiRegis('none', '', null, spanName);
        return true;
    }
}
var checkPhoneVar = false;
var checkEmailVar = false;
const checkPhoneRegis = async () => {
    if (phoneRegis.value == '') {
        notiRegis('block', 'Anh vui lòng nhập số điện thoại của mình ạ', phoneRegis, spanPhone);
        checkPhoneVar = false;
    }
    else {
        if (!validatePhone(phoneRegis.value)) {
            notiRegis('block', 'Anh vui lòng nhập đúng số điện thoại của mình ạ', phoneRegis, spanPhone);
            checkPhoneVar = false;
        }
        else {
            const { status } = await checkDuplicatePhone(phoneRegis.value);
            if (status == 'found') {
                notiRegis('block', 'Số điện thoại này đã được dùng, anh vui lòng nhập lại ạ', phoneRegis, spanPhone);
                checkPhoneVar = false;
            }
            else {
                notiRegis('none', '', null, spanPhone);
                checkPhoneVar = true;
            }
        }
    }
}

const checkEmailRegis = async () => {
    if (emailRegis.value == '') {
        notiRegis('block', 'Anh vui lòng nhập email của mình ạ', emailRegis, spanEmail);
        checkEmailVar = false;
    }
    else {
        if (!validateEmail(emailRegis.value)) {
            notiRegis('block', 'Anh vui lòng nhập đúng email của mình ạ', emailRegis, spanEmail);
            checkEmailVar = false;
        }
        else {
            const { status } = await checkDuplicateEmail(emailRegis.value);
            if (status == 'found') {
                notiRegis('block', 'Email này đã được dùng, anh vui lòng nhập lại ạ', emailRegis, spanEmail);
                checkEmailVar = false;
            }
            else {
                notiRegis('none', '', null, spanEmail);
                checkEmailVar = true;
            }
        }
    }
}

const checkPasswordRegis = () => {
    if (passwordRegis.value == '') {
        notiRegis('block', 'Anh vui lòng nhập mật khẩu của mình ạ', passwordRegis, spanPass);
        return false;
    }
    else {
        if (!validatePassword(passwordRegis.value)) {
            notiRegis('block', 'Mật khẩu phải có ít nhất 8 kí tự, trong đó có ít nhất 1 kí tự số và 1 kí tự in hoa', passwordRegis, spanPass);
            return false;
        }
        else {
            notiRegis('none', '', null, spanPass);
            return true;
        }
    }
}

const verifyEmail_form = document.getElementById('verifyEmail');
const verifyPhone_input = document.getElementById('verify-input');

btnRegis.addEventListener('click', async (e) => {
    e.preventDefault();
    if (checkNameRegis()) {
        checkPhoneRegis();
        if (checkPhoneVar) {
            checkEmailRegis();
            if (checkEmailVar) {
                if (checkPasswordRegis()) {
                    formRegis.action = "/regis/verify-email"
                    formRegis.submit();
                }
            }
        }
    }
})



phoneRegis.onfocus = async () => {
    checkNameRegis();
}
emailRegis.onfocus = async () => {
    if (checkNameRegis())
        checkPhoneRegis();
}
passwordRegis.onfocus = async () => {
    if (checkNameRegis()) {
        checkPhoneRegis();
        if (checkPhoneVar) {
            checkEmailRegis();
            if (checkEmailVar) {
            }
        }
    }
}




// check Token 
const accessToken = `${window.localStorage.getItem('accessToken')}`;
if (accessToken != `null`) {
    (async () => {
        const { status, nameCustomer, phoneCustomer } = await checkToken();
        const nameCustomerElement = document.querySelector('.name-user');
        nameCustomerElement.innerHTML = nameCustomer;
        dropDownMenu.innerHTML = `
            <a class="dropdown-item" data-toggle="modal" >Lịch sử tỏa sáng</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item log-out" data-toggle="modal">Đăng xuất</a>
            `
        if (status) {
            const btnLogout = document.querySelector('.log-out')
            clickLogout(btnLogout);
        }
    })();

    function clickLogout(dropdownItem) {
        const nameCustomerElement = document.querySelector('.name-user');
        dropdownItem.onclick = () => {
            window.localStorage.clear();
            nameCustomerElement.innerHTML = 'Khách hàng';
            dropDownMenu.innerHTML = `
                <a class="dropdown-item" data-toggle="modal" data-target="#modalLogin">Đăng
                            nhập</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" data-toggle="modal" data-target="#regisModal">Đăng ký</a>
                `
            window.location.href = '/';
        }
    }
}
async function checkToken() {
    return (await instance.post('/checkToken', {
        data: {
            accessToken: accessToken,
        }
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