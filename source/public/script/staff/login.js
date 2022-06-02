const inputs = document.querySelectorAll(".input-field");
const toggle_btn = document.querySelectorAll(".toggle");
const main = document.querySelector("main");
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");



// hide headers

navheader.style.display = 'none';

inputs.forEach((inp) => {
    inp.addEventListener("focus", () => {
        inp.classList.add("active");
    });
    inp.addEventListener("blur", () => {
        if (inp.value != "") return;
        inp.classList.remove("active");
    });
});

toggle_btn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        main.classList.toggle("sign-up-mode");
    });
});

function moveSlider() {
    let index = this.dataset.value;

    let currentImage = document.querySelector(`.img-${index}`);
    images.forEach((img) => img.classList.remove("show"));
    currentImage.classList.add("show");

    const textSlider = document.querySelector(".text-group");
    textSlider.style.transform = `translateY(${-(index - 1) * 2.8}rem)`;

    bullets.forEach((bull) => bull.classList.remove("active"));
    this.classList.add("active");
}

bullets.forEach((bullet) => {
    bullet.addEventListener("click", moveSlider);
});


// handle login button
const login_btn = document.querySelector('.login-btn');
const input_acc = document.querySelector('.input-acc');
const input_pass = document.querySelector('.input-pass');
const signinForm = document.querySelector('.sign-in-form');
const err = document.querySelector('.err-form')
login_btn.onclick = async (e) => {
    e.preventDefault();
    const { status, idstore, token } = await login_staff(input_acc.value, input_pass.value);
    if (status == "found") {
        window.localStorage.setItem('accessToken', token);
        window.location = `/dashboard-manager?idStore=${idstore}`
    }
    else {
        err.style.display = 'block';
    }
}

const btnForgotPass = document.querySelector('.btn-confirm__forgot-pass')
const inputEmail_forgot = document.querySelector('.input-email')
const inputPassFirst_forgot = document.querySelector('.input-pass-first')
const inputPassNext_forgot = document.querySelector('.input-pass-next')

const errEmail = document.querySelector('.err-email-forgot')
const errPassFirst = document.querySelector('.err-pass-first')
const errPassNext = document.querySelector('.err-pass-next')

function logErr(err, style, mess) {
    err.style.display = style
    err.textContent = mess
}

btnForgotPass.onclick = async (e) => {
    e.preventDefault();
    var flag = 0;
    if (inputEmail_forgot.value == "") {
        logErr(errEmail, 'block', 'Vui lòng nhập email')
    } else {
        const { status } = await checkExistEmail(inputEmail_forgot.value)
        if (status === 'exist') {
            logErr(errEmail, 'none', '')
            flag = 1;
        } else {
            logErr(errEmail, 'block', 'Email này không tồn tại trong hệ thống')
        }
    }

    if (inputPassFirst_forgot.value == "") {
        logErr(errPassFirst, 'block', 'Vui lòng nhập mật khẩu mới')
    } else {
        if (validatePassword(inputPassFirst_forgot.value)) {
            logErr(errPassFirst, 'none', '')
            if (flag == 1) flag = 2;
        } else {
            logErr(errPassFirst, 'block', 'Mật khẩu này quá yếu')
        }
    }

    if (inputPassNext_forgot.value == "") {
        logErr(errPassNext, 'block', 'Vui lòng nhập mật khẩu xác nhận')
    } else {
        if (inputPassNext_forgot.value !== inputPassFirst_forgot.value) {
            logErr(errPassNext, 'block', 'Vui lòng đúng mật khẩu xác nhận')
        } else {
            logErr(errPassNext, 'none', '')
            if (flag == 2) flag = 3;
        }
    }

    if (flag == 3) {
        const { status } = await sendEmailConfirm(inputEmail_forgot.value.trim(), inputPassNext_forgot.value);
        if (status == 'success') {
            main.classList.toggle("sign-up-mode");
            launch_toast('Hoàn tất. Vui lòng xác thực qua email')
            inputEmail_forgot.value = ""
            inputPassFirst_forgot.value = ""
            inputPassNext_forgot.value = ""
            inputs.forEach((inp) => {
                inp.classList.remove("active");
            });
        }

    }
}
input_acc.onfocus = () => err.style.display = 'none';
input_pass.onfocus = () => err.style.display = 'none';

window.addEventListener('load', () => {
    const accessToken = `${window.localStorage.getItem('accessToken')}`;
    if (accessToken != `null`) {
        (async () => {
            const { status, idstore } = await checkToken(accessToken);
            if (status == 'success') {
                window.location = `/dashboard-manager?idStore=${idstore}`
            }
        })();
    }
})


function launch_toast(mess) {
    var x = document.getElementById("toast")
    x.className = "show";
    x.textContent = '';
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    setTimeout(function () { x.textContent = mess }, 700);
}

async function sendEmailConfirm(email, password) {
    return (await instance.post('/login/send-email-verify', {
        email,
        password
    })).data;
}

async function checkExistEmail(email) {
    return (await instance.post('/login/check-exist-email', {
        email
    })).data;
}

async function login_staff(acc, pass) {
    return (await instance.post('/login', {
        username: acc,
        password: pass
    })).data;
}


