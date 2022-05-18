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
login_btn.onclick = async (e) => {
    e.preventDefault();
    const { status, idstore } = await login_staff(input_acc.value, input_pass.value);
    if (status === "found") {
        console.log(idstore)
        window.location = `/dashboard-manager?idStore=${idstore}`
        // signinForm.submit();
    }
    else {

    }
}



async function login_staff(acc, pass) {
    return (await instance.post('/login', {
        username: acc,
        password: pass
    })).data;
}


