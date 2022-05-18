draw(bookings.map(obj => {
    var hour = obj.HourStart > 9 ? obj.HourStart : `0${obj.HourStart}`;
    var minute = obj.MinuteStart > 9 ? obj.MinuteStart : `0${obj.MinuteStart}`;
    return {
        title: obj.PhoneCustomer,
        start: `${obj.DateBook}T${hour}:${minute}:00`,
    }
}))



const sidebar = document.querySelector('.sidebar');

$('.sidebar__header__actions__close').click(function () {
    sidebar.classList.remove('active');
    $('.sidebar-overlay').remove();
})

const dateBook_info = document.querySelector('.adm-appointment-info-section-datetime__date span')
const timeBook_info = document.querySelector('.adm-appointment-info-section-datetime__time span')
const avatar_info = document.querySelector('.avatar-employe_book');
const nameEmployee_info = document.querySelector('.adm-appointment-info-section-employee__text__name span');
const nameCustomer_info = document.querySelector('.adm-appointment-info-section-customers__item__name span');
const emailCustomer_info = document.querySelector('.adm-appointment-info-section-customers__item__email span');
const phoneCustomer_info = document.querySelector('.adm-appointment-info-section-customers__item__phone span');
const serviceBook_info = document.querySelector('.service-list__book');
const paymentBook_info = document.querySelector('.payment-book');
const statusBook_info = document.querySelector('.status-symbol');


function draw(data) {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: data,
        eventClick: async (info) => {
            let date = info.event.start;
            let dateBook = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            const { status, booking, customer } = await getInfoBooking(info.event.title, dateBook);
            // render
            if (status == 'success') {
                statusBook_info.textContent = `${booking[0].StatusBook}`
                var day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
                var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
                var hour = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
                var minute = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
                dateBook_info.textContent = `${day}-${month}-${date.getFullYear()}`
                timeBook_info.textContent = `${hour}:${minute}`
                nameEmployee_info.textContent = `${booking[0].SurName} ${booking[0].NameStaff}`;
                avatar_info.style.backgroundImage = `url('${booking[0].PathImgStaff}')`;
                nameCustomer_info.textContent = `${customer[0].NameCustomer}`;
                emailCustomer_info.textContent = `${customer[0].EmailCustomer}`;
                phoneCustomer_info.textContent = `${customer[0].PhoneCustomer}`;
                html = ``;
                booking.forEach((item, index) => {
                    html += `<div class="adm-appointment-info-section-service">
                    <span>${item.NameService}</span>
                    <span>${item.ListPrice}.000đ</span>
                </div>`
                })
                serviceBook_info.innerHTML = html;
                paymentBook_info.textContent = `${booking[0].Payment}.000đ`;
                sidebar.classList.add('active');
                $('<div class="sidebar-overlay"></div>').insertAfter('.sidebar')
                $('.sidebar-overlay').click(function () {
                    sidebar.classList.remove('active');
                    $('.sidebar-overlay').remove();
                })
            }
        }
    });

    calendar.render();
}

const itemEmployee = document.querySelectorAll('.category')
var indexPre_em = 0;
itemEmployee.forEach((item, index) => {
    item.onclick = async () => {
        itemEmployee[indexPre_em].classList.remove('active');
        item.classList.add('active');
        indexPre_em = index;
        if (index == 0) {
            draw(bookings.map(obj => {
                var hour = obj.HourStart > 9 ? obj.HourStart : `0${obj.HourStart}`;
                var minute = obj.MinuteStart > 9 ? obj.MinuteStart : `0${obj.MinuteStart}`;
                return {
                    title: obj.PhoneCustomer,
                    start: `${obj.DateBook}T${hour}:${minute}:00`,
                }
            }))
        } else {
            var idEmployee = item.getAttribute('data-employee');

            //  handle render booking
            const { status, bookings } = await getBook_idEmployee(idEmployee)
            if (status == 'success') {
                draw(bookings.map(obj => {
                    var hour = obj.HourStart > 9 ? obj.HourStart : `0${obj.HourStart}`;
                    var minute = obj.MinuteStart > 9 ? obj.MinuteStart : `0${obj.MinuteStart}`;
                    return {
                        title: obj.PhoneCustomer,
                        start: `${obj.DateBook}T${hour}:${minute}:00`,
                    }
                }))

            }
        }

    }
})

const numServiceText = document.querySelectorAll('.num-bookings')

function renderNumBooking_idEmployee() {
    itemEmployee.forEach(async (item, index) => {
        var idEmployee = item.getAttribute('data-employee');
        const { status, bookings, lengthBook } = await getBook_idEmployee(idEmployee)
        if (index > 0) {
            if (status == 'success') {
                if (lengthBook > 0) {
                    numServiceText[index - 1].textContent = `Có ${lengthBook} lịch hẹn mới`;
                } else {
                    numServiceText[index - 1].textContent = `Chưa có lịch hẹn nào mới`;
                }
            }
        }
    })
}


window.addEventListener('load', async () => {
    renderNumBooking_idEmployee();
})


const div_category = document.querySelectorAll('.adm-form-item .el-form-item');
const err_div = document.querySelectorAll('.adm-form-item__error')
function errInputCategory(index, text) {
    div_category[index].classList.remove('is-success');
    div_category[index].classList.add('is-error');
    err_div[index].textContent = text;
}

function successInputCategory(index, text) {
    div_category[index].classList.add('is-success');
    div_category[index].classList.remove('is-error');
    err_div[index].textContent = text;
}

const input_from = document.querySelector('#input_from')
const inputService_book = document.querySelector('#input-service_booking');
const inputEmployee_book = document.getElementById('input-employee_booking');
const inputTime_book = document.getElementById('input-time__booking');
const dropDown_servicesEmployee = document.querySelector('#dropdown-services__employee');
const dropdownEmployee_booking = document.querySelector('#dropdown-employee__booking');
const dropdownTime_booking = document.querySelector('#dropdown-shift__booking');
const arrows_down = document.querySelectorAll('.el-select__caret');
const itemDropdown_service = document.querySelectorAll('.item-service__dropdown');
const itemDropdown_employee = document.querySelectorAll('.item-employee');
const itemDropdown_shift = document.querySelectorAll('.item-shift');
var scrollService = 440;
var scrollEmployee = 440;
var scrollTime = 325;

inputService_book.onclick = () => {
    if (dropDown_servicesEmployee.getAttribute('style') == 'min-width: 430px; transform-origin: center bottom; z-index: 2026; display: none;') {
        arrows_down[1].style.transform = 'rotate(0deg)';
        dropDown_servicesEmployee.style = `min-width: 430px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollService}px; left: 220px;display:block;`
    }
    else {
        arrows_down[1].style.transform = 'rotate(180deg)';
        dropDown_servicesEmployee.style = `min-width: 430px; transform-origin: center bottom; z-index: 2026; display: none`
    }
}

inputEmployee_book.onclick = () => {
    if (dropdownEmployee_booking.getAttribute('style') == 'min-width: 540px; transform-origin: center bottom; z-index: 2026; display: none;') {
        arrows_down[2].style.transform = 'rotate(0deg)';
        dropdownEmployee_booking.style = `min-width: 540px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollEmployee}px; right: 205px;display:block;`
    }
    else {
        arrows_down[2].style.transform = 'rotate(180deg)';
        dropdownEmployee_booking.style = `min-width: 540px; transform-origin: center bottom; z-index: 2026; display: none`
    }
}

inputTime_book.onclick = () => {
    if (dropdownTime_booking.getAttribute('style') == 'min-width: 540px; transform-origin: center bottom; z-index: 2026; display: none;') {
        arrows_down[0].style.transform = 'rotate(0deg)';
        dropdownTime_booking.style = `min-width: 540px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollTime}px; right: 205px;display:block;`
    }
    else {
        arrows_down[0].style.transform = 'rotate(180deg)';
        dropdownTime_booking.style = `min-width: 540px; transform-origin: center bottom; z-index: 2026; display: none`
    }

    if (input_from.value != "") {
        removeTimeBooked(input_from.value)
    }
}

async function removeTimeBooked(date) {
    // const { status } = await getBook_date(date);
    // if (status == 'success') {
    //     console.log(status);
    // }
}

let isOver_serive = false;
let isOver_employee = false;
let isOver_time = false

dropDown_servicesEmployee.onmouseover = function () {
    isOver_serive = true;
}

dropDown_servicesEmployee.onmouseleave = function () {
    isOver_serive = false;
}

dropdownEmployee_booking.onmouseover = function () {
    isOver_employee = true;
}

dropdownEmployee_booking.onmouseleave = function () {
    isOver_employee = false;
}

dropdownTime_booking.onmouseover = function () {
    isOver_time = true;
}

dropdownTime_booking.onmouseleave = function () {
    isOver_time = false;
}

input_from.onchange = async () => {
    inputTime_book.disabled = false;
    $('.input-time_book').removeClass('is-disabled');
    inputTime_book.value = "";
    removeAllSelectedTime();
    const { status, shift, arrIdShift } = await getShiftIsFull(input_from.value)
    if (status == 'success') {
        if (shift == 'have shift full') {
            hideTimeIsFull(arrIdShift);
        }
        else {
            showAllTime();
        }
    }
}

function removeAllSelectedTime() {
    indexPre_time = -1;
    for (var i = 0; i < itemDropdown_shift.length; i++) {
        if (itemDropdown_shift[i].classList.contains('selected')) {
            itemDropdown_shift[i].classList.remove('selected');
            break;
        }
    }
}

function showAllTime() {
    itemDropdown_shift.forEach((item, index) => {
        item.style.display = 'flex';
    })
}

function hideTimeIsFull(arrIdShift) {
    itemDropdown_shift.forEach((item, index) => {
        arrIdShift.forEach(shift => {
            if (shift == item.getAttribute('data-shift')) {
                item.style.display = 'none';
            }
        })
    })
}


inputService_book.onfocusout = () => {
    if (!isOver_serive) {
        arrows_down[1].style.transform = 'rotate(180deg)';
        dropDown_servicesEmployee.style = `min-width: 430px; transform-origin: center bottom; z-index: 2026; display: none`
    }
}

inputEmployee_book.onfocusout = () => {
    if (!isOver_employee) {
        arrows_down[2].style.transform = 'rotate(180deg)';
        dropdownEmployee_booking.style = `min-width: 540px; transform-origin: center bottom; z-index: 2026; display: none`
    }
}

inputTime_book.onfocusout = () => {
    if (!isOver_time) {
        arrows_down[0].style.transform = 'rotate(180deg)';
        dropdownTime_booking.style = `min-width: 540px; transform-origin: center bottom; z-index: 2026; display: none`
    }
}

var indexFirstChecking = -1;
var indexIsChecking = -1;
let countService = 0;

function getIndexIsChecking() {
    for (var i = 0; i < itemDropdown_service.length; i++) {
        if (itemDropdown_service[i].classList.contains('selected')) {
            indexIsChecking = i;
            break;
        }
    }
}
const tags_service = document.querySelector('.el-select__tags span');
const spans_service = document.querySelectorAll('.item-service__dropdown span');
const spans_employee = document.querySelectorAll('.item-employee span');
const spans_time = document.querySelectorAll('.item-shift span');

var countClick = 0;
function removeAllSelectedService() {
    itemDropdown_service.forEach((item, index) => {
        if (item.classList.contains('selected')) item.classList.remove('selected');
    })
}

itemDropdown_service.forEach((item, index) => {
    item.onclick = () => {
        inputService_book.value = " ";
        inputService_book.placeholder = "";
        inputService_book.focus();
        countClick++;
        if (countClick == 1) {
            indexFirstChecking = index;
        }
        if (item.classList.contains('selected')) {
            item.classList.remove('selected');
            if (indexFirstChecking == index && countClick > 1) {
                getIndexIsChecking();
                if (indexIsChecking == -1) {
                    indexIsChecking = indexFirstChecking;
                }
                indexFirstChecking = indexIsChecking;
                const tagsText = document.querySelector('.el-select__tags-text')
                tagsText.innerHTML = spans_service[indexIsChecking].textContent.trim()
            }
            countService--;
            if (countService == 1) {
                var spanCount = document.querySelectorAll('.el-tag--info');
                spanCount[1].remove();
            }
            else if (countService > 1) {
                var spanCount = document.querySelectorAll('.el-select__tags-text');
                spanCount[1].textContent = `+${countService - 1}`
            }
            else {
                tags_service.innerHTML = "";
                inputService_book.placeholder = 'Chọn Dịch Vụ';
                inputService_book.value = '';
                countClick = 0;
            }
        } else {
            countService++;
            item.classList.add('selected');
            if (countService == 2) {
                tags_service.innerHTML += `<span
                class="el-tag el-tag--info el-tag--small el-tag--light">
                <span class="el-select__tags-text">
                    +${countService - 1}
                </span>
            </span>`
            } else if (countService > 2) {
                var spanCount = document.querySelectorAll('.el-select__tags-text');
                spanCount[1].textContent = `+${countService - 1}`
            }
            else {
                tags_service.innerHTML = `
                    <span
                        class="el-tag el-tag--info el-tag--small el-tag--light">
                        <span class="el-select__tags-text">
                            ${spans_service[index].textContent.trim()}
                        </span>
                    </span>`
            }
        }
    }
})
var indexPre_employee = -1
itemDropdown_employee.forEach((item, index) => {
    item.onclick = function () {
        if (indexPre_employee != -1) {
            itemDropdown_employee[indexPre_employee].classList.remove('selected');
        }
        inputEmployee_book.value = spans_employee[index].textContent.trim();
        arrows_down[2].style.transform = 'rotate(180deg)';
        dropdownEmployee_booking.style = `min-width: 540px; transform-origin: center bottom; z-index: 2026; display: none`
        item.classList.add('selected');
        indexPre_employee = index;
    }
})

var indexPre_time = -1;

itemDropdown_shift.forEach((item, index) => {
    item.onclick = function () {
        if (indexPre_time != -1) {
            itemDropdown_shift[indexPre_time].classList.remove('selected');
        }
        inputTime_book.value = spans_time[index].textContent.trim();
        arrows_down[0].style.transform = 'rotate(180deg)';
        dropdownTime_booking.style = `min-width: 540px; transform-origin: center bottom; z-index: 2026; display: none`
        item.classList.add('selected');
        indexPre_time = index;
    }
})



async function getShiftIsFull(date) {
    return (await instance.post('booking/get-shift-full', {
        date
    })).data
}

async function getBook_date(date) {
    return (await instance.post('booking/get-book-date', {
        date
    })).data
}


async function getBook_idEmployee(idEmployee) {
    return (await instance.post('booking/employeeId', {
        idEmployee
    })).data
}

async function getInfoBooking(phone, dateBook) {
    return (await instance.post('booking/info-booking', {
        phone,
        dateBook
    })).data
}

