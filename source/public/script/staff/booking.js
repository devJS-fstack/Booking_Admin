const accessToken = `${window.localStorage.getItem('accessToken')}`;
if (accessToken != `null`) {
    (async () => {
        const { status, employee, role } = await checkToken(accessToken);
        if (status == 'success') {
            const idStore = location.href.split('?idStore=')[1];
            if (role === 3) {
                if (employee.IDStore !== parseInt(idStore)) {
                    location.href = './page-err'
                }
            }
            else if (role == 4) {
                var service_link = document.querySelector('.service-link');
                var service_span = document.querySelector('.service-span');
                service_link.classList.remove('d-none');
                service_span.classList.remove('d-none');
            }
            const sidebar = document.querySelector('.sidebar');
            $('.sidebar__header__actions__close').click(function () {
                sidebar.classList.remove('active');
                $('.sidebar-overlay').remove();
            })

            var idEvent;

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
            var phoneCancelBook;
            var phoneExportBill;
            var nameStaff_work = "";
            var arrProducts = []
            var idStaff_bill;
            var payment_bill;
            var date_bill;
            const action_booking = document.querySelector('.action-booking');

            // edit booking
            const editBooking = document.querySelector('.edit-booking');
            const editIcon = document.querySelector('.edit-icon');
            var dateBook_val;
            var shift_val;
            var arrService_val;
            var idStaff_val;
            var phone_val;


            var calendarEl = document.getElementById('calendar');
            var calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                events: [],
                eventClick: async (info) => {
                    idEvent = info.event._def.defId;
                    let date = info.event.start;
                    let hourStart = date.getHours();
                    let minuteStart = date.getMinutes();
                    let dateBook = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                    const { status, booking, customer } = await getInfoBooking(info.event.title, dateBook, hourStart, minuteStart);
                    // render
                    if (status == 'success') {
                        phoneCancelBook = info.event.title;
                        phoneExportBill = info.event.title;
                        statusBook_info.textContent = `${booking[0].StatusBook}`
                        var day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
                        var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
                        var hour = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
                        var minute = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
                        dateBook_info.textContent = `${day}-${month}-${date.getFullYear()}`
                        timeBook_info.textContent = `${hour}:${minute}`
                        nameEmployee_info.textContent = `${booking[0].SurName} ${booking[0].NameStaff}`;
                        nameStaff_work = `${booking[0].SurName} ${booking[0].NameStaff}`
                        idStaff_bill = booking[0].IDStaff
                        avatar_info.style.backgroundImage = `url('${booking[0].PathImgStaff}')`;
                        if (customer.length > 0) {
                            nameCustomer_info.textContent = `${customer[0].NameCustomer}`;
                            emailCustomer_info.textContent = `${customer[0].EmailCustomer}`;
                            phoneCustomer_info.textContent = `${customer[0].PhoneCustomer}`;
                        }
                        else {
                            nameCustomer_info.textContent = ``;
                            emailCustomer_info.textContent = ``;
                            phoneCustomer_info.textContent = `${info.event.title}`;
                        }
                        html = ``;
                        arrProducts = [];
                        arrProducts = booking;
                        booking.forEach((item, index) => {
                            html += `<div class="adm-appointment-info-section-service">
                <span>${item.NameService}</span>
                <span>${item.ListPrice}.000??</span>
            </div>`
                        })
                        serviceBook_info.innerHTML = html;
                        payment_bill = booking[0].Payment;
                        date_bill = booking[0].DateBook;
                        paymentBook_info.textContent = `${formatPayment(booking[0].Payment)}.000??`;
                        sidebar.classList.add('active');
                        $('<div class="sidebar-overlay"></div>').insertAfter('.sidebar')
                        $('.sidebar-overlay').click(function () {
                            sidebar.classList.remove('active');
                            $('.sidebar-overlay').remove();
                        })

                        if (booking[0].StatusBook == '???? ?????t l???ch') {
                            action_booking.style.display = 'flex';
                            editIcon.style.display = 'block';
                            // {insert value to edit} 
                            dateBook_val = booking[0].DateBook
                            shift_val = booking[0].IDShiftBook
                            arrService_val = arrProducts;
                            idStaff_val = booking[0].IDStaff
                            phone_val = booking[0].PhoneCustomer
                        } else {
                            action_booking.style.display = 'none';
                            editIcon.style.display = 'none';
                        }

                    }
                },
            });



            function formatPayment(payment) {
                var paymentString = payment.toString().split('');
                var result = '';
                var countStr = 0;
                paymentString.forEach((item, index) => {
                    if (paymentString.length == 4) {
                        if (index == 1) {
                            result += `.${item}`
                        }
                        else {
                            result += item;
                        }
                    }
                    else {
                        result += item;
                    }

                })
                return result;

            }


            calendar.render();
            bookings.forEach(obj => {
                var hour = obj.HourStart > 9 ? obj.HourStart : `0${obj.HourStart}`;
                var minute = obj.MinuteStart > 9 ? obj.MinuteStart : `0${obj.MinuteStart}`;
                addEvent({
                    title: obj.PhoneCustomer,
                    start: `${obj.DateBook}T${hour}:${minute}:00`,
                })
            })


            function addEvent(data) {
                calendar.addEvent(data);
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
                        var arrEvent = calendar.getEvents();
                        arrEvent.forEach(item => item.remove())
                        bookings.forEach(obj => {
                            var hour = obj.HourStart > 9 ? obj.HourStart : `0${obj.HourStart}`;
                            var minute = obj.MinuteStart > 9 ? obj.MinuteStart : `0${obj.MinuteStart}`;
                            addEvent({
                                title: obj.PhoneCustomer,
                                start: `${obj.DateBook}T${hour}:${minute}:00`
                            })
                        })
                    } else {
                        var idEmployee = item.getAttribute('data-employee');

                        //  handle render booking
                        const { status, bookings } = await getBook_idEmployee(idEmployee)
                        if (status == 'success') {
                            var arrEvent = calendar.getEvents();
                            arrEvent.forEach(item => item.remove())
                            bookings.forEach(obj => {
                                var hour = obj.HourStart > 9 ? obj.HourStart : `0${obj.HourStart}`;
                                var minute = obj.MinuteStart > 9 ? obj.MinuteStart : `0${obj.MinuteStart}`;
                                addEvent({
                                    title: obj.PhoneCustomer,
                                    start: `${obj.DateBook}T${hour}:${minute}:00`,
                                })
                            })

                        }
                    }

                }
            })
            const numServiceText = document.querySelectorAll('.num-bookings')
            const numAllBooking = document.querySelectorAll('.num_all-booking');
            async function renderNumBooking_idEmployee() {
                var lengthAll = 0;
                var isDone = false;
                itemEmployee.forEach(async (item, index) => {
                    var idEmployee = item.getAttribute('data-employee');
                    const { status, bookings, lengthBook } = await getBook_idEmployee(idEmployee)
                    if (index > 0) {
                        if (status == 'success') {
                            if (lengthBook > 0) {
                                lengthAll += lengthBook;
                                numServiceText[index - 1].textContent = `C?? ${lengthBook} l???ch h???n m???i`;
                            } else {
                                numServiceText[index - 1].textContent = `Ch??a c?? l???ch h???n n??o m???i`;
                            }
                        }
                    }
                    if (lengthAll > 0) {
                        numAllBooking[0].textContent = `${parseInt(lengthAll)} l???ch h???n m???i`
                    } else {
                        numAllBooking[0].textContent = `Ch??a c?? l???ch h???n n??o m???i`
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
            }

            const modalAddBooking = document.getElementById('add-booking')

            modalAddBooking.addEventListener('scroll', () => {
                var scrollTop = modalAddBooking.scrollTop;
                scrollService = 440 - scrollTop;
                scrollEmployee = 440 - scrollTop;
                scrollTime = 325 - scrollTop;
                if (dropDown_servicesEmployee.style.display == "block") {
                    dropDown_servicesEmployee.style = `min-width: 430px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollService}px; left: 220px;display:block;`
                }
                if (dropdownTime_booking.style.display == "block") {
                    dropdownTime_booking.style = `min-width: 540px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollTime}px; right: 205px;display:block;`
                }
                if (dropdownEmployee_booking.style.display == "block") {
                    dropdownEmployee_booking.style = `min-width: 540px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollEmployee}px; right: 205px;display:block;`
                }
            })



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

            var noData_employee = document.querySelector('.no-data__employee');
            var isHaveEmployee = false;
            var arrIndexEmployee = [];
            input_from.onchange = async () => {
                inputTime_book.disabled = false;
                $('.input-time_book').removeClass('is-disabled');
                inputTime_book.value = "";
                if (input_from.value == "") {
                    $('.input-time_book').addClass('is-disabled');
                    inputTime_book.value = "";
                    inputTime_book.disabled = true;
                } else {
                    successInputCategory(0, "");
                }
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

                const { status_employee, employees } = await getEmPloyeeRegisShift_Date(input_from.value);
                if (status_employee == 'have employee') {
                    arrIndexEmployee = [];
                    removeAllSelectedEmployee();
                    hideAllEmployee();
                    renderEmployee_DateRegis(employees);
                    noData_employee.style.display = 'none';
                    isHaveEmployee = true;
                    inputEmployee_book.value = "";
                }
                else {
                    removeAllSelectedEmployee();
                    hideAllEmployee();
                    noData_employee.style.display = 'flex';
                    isHaveEmployee = false;
                    inputEmployee_book.value = "";
                }
            }



            function renderEmployee_DateRegis(arrEmployee) {
                itemDropdown_employee.forEach((item, index) => {
                    arrEmployee.forEach((item1, index1) => {
                        if (item.getAttribute('data-employee') == item1.IDStaff) {
                            item.style.display = 'flex'
                            arrIndexEmployee.push(index);
                        }
                    })
                })

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

            function removeAllSelectedEmployee(idEmployee) {
                indexPre_employee = -1;
                for (var i = 0; i < itemDropdown_employee.length; i++) {
                    if (itemDropdown_employee[i].classList.contains('selected')) {
                        itemDropdown_employee[i].classList.remove('selected');
                        break;
                    }
                }
            }

            function renderEmployee_ArrIndex(arrIndex) {
                itemDropdown_employee.forEach((item, index) => {
                    arrIndex.forEach(item1 => {
                        if (item1 == index) {
                            item.style.display = 'flex';
                        }
                    })
                })
            }

            const inputPhoneCus_book = document.querySelector('#input_phone_cus');

            inputPhoneCus_book.oninput = async () => {
                inputPhoneCus_book.value = inputPhoneCus_book.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                if (inputPhoneCus_book.value.length == 10) {
                    const { status, datebook } = await getBooking_Phone_Date(input_from.value, inputPhoneCus_book.value)
                    if (status == 'found') {
                        var date = new Date(`${datebook}`)
                        var day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
                        var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
                        var dateFormat = `${day}-${month}-${date.getFullYear()}`
                        errInputCategory(4, `S??? ??i???n tho???i n??y ???? ???????c ?????t l???ch m???i v??o ${dateFormat}. Vui l??ng h???y l???ch ho???c ho??n th??nh tr?????c khi ????ng k?? l???ch m???i!`)
                    }
                    else {
                        successInputCategory(4, "")
                    }
                } else {
                    successInputCategory(4, "")
                }
            }



            function hideAllEmployee() {
                itemDropdown_employee.forEach(item => {
                    item.style.display = 'none';
                })
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
                if (noData_employee.style.display == 'flex') {
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
                    arrService = [];
                    inputService_book.value = " ";
                    inputService_book.placeholder = "";
                    inputService_book.focus();
                    countClick++;
                    successInputCategory(2, "")
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
                            inputService_book.placeholder = 'Ch???n D???ch V???';
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
            var arrService = [];
            function pushIdServiceToArr() {
                itemDropdown_service.forEach((item, index) => {
                    if (item.classList.contains('selected')) arrService.push(item.getAttribute('data-service'))
                })
            }
            var indexPre_employee = -1
            itemDropdown_employee.forEach((item, index) => {
                item.onclick = function () {
                    idStaff = item.getAttribute('data-employee')
                    successInputCategory(3, "")
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
            var idShift;
            itemDropdown_shift.forEach((item, index) => {
                item.onclick = async () => {
                    idShift = item.getAttribute('data-shift')
                    successInputCategory(1, "")
                    if (isHaveEmployee) {
                        const { status, idEmployee } = await getEmployee_Date_Time(input_from.value, item.getAttribute('data-shift'));
                        if (status == 'have employee') {
                            inputEmployee_book.value = "";
                            removeAllSelectedEmployee(idEmployee);
                            renderEmployee_Shift(idEmployee)
                        } else {
                            // renderAllEmployee();
                            // removeAllSelectedEmployee();
                            hideAllEmployee();
                            renderEmployee_ArrIndex(arrIndexEmployee)
                        }
                    }
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

            const add_booking = document.getElementById('add_booking');
            const confirm_booking = document.getElementById('adm-btn-booking__add');


            add_booking.addEventListener('click', () => {
                arrService = [];
                input_from.value = "";
                $('.title-booking').text('Th??m L???ch H???n');
                $('.span-btn__booking').text('Th??m L???ch H???n');
                $('.input-time_book').addClass('is-disabled');
                inputTime_book.value = "";
                inputTime_book.disabled = true;
                removeAllSelectedTime();
                inputEmployee_book.value = "";
                removeAllSelectedEmployee();
                removeAllSelectedService();
                tags_service.innerHTML = "";
                inputService_book.value = "";
                inputService_book.placeholder = "Ch???n D???ch V???";
                countClick = 0;
                countService = 0;
                inputPhoneCus_book.value = "";
                successInputCategory(0, "")
                successInputCategory(1, "")
                successInputCategory(2, "")
                successInputCategory(3, "")
                successInputCategory(4, "")
            })

            function renderTimeBooked(idShift) {
                for (var i = 0; i < itemDropdown_shift.length; i++) {
                    if (itemDropdown_shift[i].getAttribute('data-shift') == idShift) {
                        itemDropdown_shift[i].classList.add('selected');
                        indexPre_time = i;
                        inputTime_book.value = spans_time[i].textContent.trim();
                        break;
                    }
                }
            }

            function renderStaffBooked(idStaff) {
                for (var i = 0; i < itemDropdown_employee.length; i++) {
                    if (itemDropdown_employee[i].getAttribute('data-employee') == idStaff) {
                        itemDropdown_employee[i].classList.add('selected');
                        indexPre_employee = i;
                        inputEmployee_book.value = spans_employee[i].textContent.trim();
                        break;
                    }
                }
            }

            async function renderEmployeeRegisShift(date) {
                const { status_employee, employees } = await getEmPloyeeRegisShift_Date(date);
                if (status_employee == 'have employee') {
                    arrIndexEmployee = [];
                    removeAllSelectedEmployee();
                    hideAllEmployee();
                    renderEmployee_DateRegis(employees);
                    noData_employee.style.display = 'none';
                    isHaveEmployee = true;
                    inputEmployee_book.value = "";
                }
                else {
                    removeAllSelectedEmployee();
                    hideAllEmployee();
                    noData_employee.style.display = 'flex';
                    isHaveEmployee = false;
                    inputEmployee_book.value = "";
                }
            }

            function renderServiceBooked(arrService) {
                var count = 0;
                inputService_book.value = " ";
                countService = 0;
                itemDropdown_service.forEach((item, index) => {
                    arrService.forEach((service, indexS) => {
                        if (service.IDService == item.getAttribute('data-service')) {
                            item.classList.add('selected');
                            count++;
                            countService++;
                            if (count == 1) {
                                tags_service.innerHTML = `
                        <span
                            class="el-tag el-tag--info el-tag--small el-tag--light">
                            <span class="el-select__tags-text">
                                ${spans_service[index].textContent.trim()}
                            </span>
                        </span>
                        `
                            }
                        }
                    })
                })
                if (count > 1) {
                    tags_service.innerHTML += `<span
                            class="el-tag el-tag--info el-tag--small el-tag--light">
                            <span class="el-select__tags-text">
                                +${count - 1}
                            </span>
                        </span>`
                }
                getIndexIsChecking();
                indexFirstChecking = indexIsChecking;
                indexIsChecking = -1;
                countClick = 2;
            }


            editBooking.onclick = async () => {
                add_booking.click()
                $('.title-booking').text('Ch???nh S???a L???ch H???n');
                $('.span-btn__booking').text('L??u Thay ?????i');
                input_from.value = dateBook_val;
                $('.input-time_book').removeClass('is-disabled');
                inputTime_book.disabled = false;
                renderTimeBooked(shift_val);
                await renderEmployeeRegisShift(dateBook_val)
                renderStaffBooked(idStaff_val);
                inputPhoneCus_book.value = phone_val;
                renderServiceBooked(arrService_val)
                idShift = shift_val;
                idStaff = idStaff_val;
            }

            var idStaff = 0;
            function launch_toast(mess) {
                var x = document.getElementById("toast")
                x.className = "show";
                x.textContent = '';
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
                setTimeout(function () { x.textContent = mess }, 700);
            }

            confirm_booking.addEventListener('click', async () => {
                var flag = 0;
                if (input_from.value == "") {
                    errInputCategory(0, "B???n vui l??ng ch???n ng??y ?????t l???ch")
                } else {
                    var datenow = new Date();
                    var dateInputFrom = new Date(`${input_from.value}`);
                    datenow.setHours(0, 0, 0, 0);
                    dateInputFrom.setHours(0, 0, 0, 0);
                    if (datenow.getTime() > dateInputFrom.getTime()) {
                        errInputCategory(0, 'B???n vui l??ng ch???n ????ng ng??y')
                    }
                    else {
                        successInputCategory(0, "");
                        if (flag == 0) flag = 1;
                    }
                }

                if (inputTime_book.value == "") {
                    errInputCategory(1, "B???n vui l??ng ch???n th???i gian ?????t l???ch")
                } else {
                    successInputCategory(1, "");
                    if (flag == 1) flag = 2;
                }

                if (inputService_book.value == "") {
                    errInputCategory(2, "B???n vui l??ng ch???n d???ch v???")
                }
                else {
                    successInputCategory(2, "");
                    if (flag == 2) flag = 3;
                }

                if (inputEmployee_book.value == "") {
                    errInputCategory(3, "B???n vui l??ng ch???n nh??n vi??n th???c hi???n")
                }
                else {
                    successInputCategory(3, "");
                    if (flag == 3) flag = 4;
                }

                if (inputPhoneCus_book.value == "") {
                    errInputCategory(4, "B???n vui l??ng nh???p s??? ??i???n tho???i kh??ch h??ng")
                }
                else {
                    if (!validatePhone(inputPhoneCus_book.value))
                        errInputCategory(4, "B???n vui l??ng nh???p ????ng s??? ??i???n thoai c???a kh??ch h??ng")
                    else {
                        if (inputPhoneCus_book.value != phone_val) {
                            const { status } = await getBooking_Phone_Date(input_from.value, inputPhoneCus_book.value)
                            if (status == 'found') {
                                errInputCategory(4, "S??? ??i???n tho???i n??y ???? ???????c ?????t l???ch v??o ng??y n??y. Vui l??ng h???y l???ch ho???c ho??n th??nh tr?????c khi ????ng k?? l???ch m???i!")
                            } else {
                                successInputCategory(4, "");
                                if (flag == 4) flag = 5;
                            }
                        }
                        else {
                            successInputCategory(4, "");
                            if (flag == 4) flag = 5;
                        }
                    }
                }





                //  ==>
                if (flag == 5) {
                    if ($('.span-btn__booking').text() == 'L??u Thay ?????i') {
                        var arrEvent = calendar.getEvents();
                        arrEvent.forEach(item => {
                            if (item._def.defId == idEvent) {
                                item.remove();
                                renderNumBooking_idEmployee();
                            }
                        })
                        pushIdServiceToArr();
                        const { status } = await editBooking_func(dateBook_val, shift_val, phone_val, idStaff_val,
                            input_from.value, idShift, arrService, inputPhoneCus_book.value, idStaff, idStore);
                        if (status == 'success') {
                            renderNumBooking_idEmployee();
                            var time = inputTime_book.value.split('h');
                            var hour = time[0];
                            var minute = time[1];
                            addEvent({
                                title: inputPhoneCus_book.value,
                                start: `${input_from.value}T${hour}:${minute}:00`
                            })
                            sidebar.classList.remove('active');
                            $('.sidebar-overlay').remove();
                            $('#add-booking').modal('hide');
                            launch_toast("Ch???nh s???a th??nh c??ng");
                        }
                    }
                    else {
                        pushIdServiceToArr();
                        const { status } = await addBooking(input_from.value, idShift, arrService, inputPhoneCus_book.value, idStaff, idStore);
                        if (status == 'success') {
                            renderNumBooking_idEmployee();
                            var time = inputTime_book.value.split('h');
                            var hour = time[0];
                            var minute = time[1];
                            addEvent({
                                title: inputPhoneCus_book.value,
                                start: `${input_from.value}T${hour}:${minute}:00`
                            })
                            //var lengthAll = numAllBooking[0].textContent.trim().split(' ')[0];
                            // numAllBooking[0].textContent = `${parseInt(lengthAll) + 1} l???ch h???n m???i`
                            launch_toast("?????t l???ch th??nh c??ng")
                            $('#add-booking').modal('hide');
                        }
                    }
                }

            })

            const cancelBooking = document.querySelector('#cancel-booking');
            const btnConfirmCancel = document.querySelector('#btn-confirm-cancel__booking');

            btnConfirmCancel.addEventListener('click', async () => {
                const { status } = await cancelBooking_Phone(phoneCancelBook);
                if (status == 'success') {
                    sidebar.classList.remove('active');
                    $('.sidebar-overlay').remove();
                    $('#alertModalDelete').modal('hide');
                    launch_toast("H???y l???ch h???n th??nh c??ng");
                    var arrEvent = calendar.getEvents();
                    arrEvent.forEach(item => {
                        if (item._def.defId == idEvent) {
                            item.remove();
                            renderNumBooking_idEmployee();
                        }
                    })
                }
            })


            function renderEmployee_Shift(employee) {
                itemDropdown_employee.forEach((item, index) => {
                    if (item.getAttribute('data-employee') == employee) {
                        item.style.display = 'none';
                    }
                })
            }

            function renderAllEmployee() {
                noData_employee.style.display = 'none';
                itemDropdown_employee.forEach((item, index) => {
                    item.style.display = 'flex';
                })
            }

            const btnExport_invoice = document.getElementById('adm-export-invoice');

            btnExport_invoice.addEventListener('click', async () => {
                var idBill = Date.now();
                const { status } = await createInvoice(idBill, idStaff_bill, payment_bill, phoneExportBill, date_bill);
                if (status == 'success') {
                    exportInvoice(idBill, arrProducts.map(obj => {
                        return {
                            "quantity": 1,
                            "description": `${obj.NameService}`,
                            "tax-rate": 0,
                            "price": `${obj.ListPrice}`
                        }
                    }), phoneExportBill);
                    launch_toast("??ang xu???t h??a ????n...");
                    sidebar.classList.remove('active');
                    $('.sidebar-overlay').remove();
                    renderNumBooking_idEmployee();
                }
            })

            function exportInvoice(idbill, product, phone) {
                var date = new Date();
                var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
                var day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
                var data = {
                    "images": {
                        "logo": "",
                    },
                    "sender": {
                        "company": `The BaberShop`,
                        "address": `${store[0].Street}`,
                        "zip": `${store[0].Phone}`,
                        "city": `${store[0].City}`,
                    },
                    // Your recipient
                    "client": {
                        "company": "Nh??n vi??n",
                        "address": `${nameStaff_work}`,
                        "zip": "Kh??ch h??ng",
                        "city": `${phone}`,
                    },
                    "information": {
                        // Invoice number
                        "number": `${idbill}`,
                        // Invoice data
                        "date": `${day}-${month}-${date.getFullYear()}`,
                        "due-date": `${day}-${month}-${date.getFullYear()}`
                    },
                    // The products you would like to see on your invoice
                    // Total values are being calculated automatically
                    "products": product,
                    "settings": {
                        "currency": "VND", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
                        "locale": "vi-VN", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')
                        "tax-notation": "", // Defaults to 'vat'
                        // "margin-top": 25, // Defaults to '25'
                        // "margin-right": 25, // Defaults to '25'
                        // "margin-left": 25, // Defaults to '25'
                        // "margin-bottom": 25, // Defaults to '25'
                        // "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
                        // "height": "1000px", // allowed units: mm, cm, in, px
                        // "width": "500px", // allowed units: mm, cm, in, px
                        // "orientation": "landscape", // portrait or landscape, defaults to portrait
                    },
                    "translate": {
                        "invoice": "H??A ????N",  // Default to 'INVOICE'
                        "number": "M?? h??a ????n", // Defaults to 'Number'
                        "date": "Ng??y", // Default to 'Date'
                        "due-date": "?????n ng??y",
                        "subtotal": "T???ng ti???n", // Defaults to 'Subtotal'
                        "products": "D???ch v???",
                        "D???ch v???": "Producten", // Defaults to 'Products'
                        "quantity": "S??? l?????ng", // Default to 'Quantity'
                        "price": "????n gi??", // Defaults to 'Price'
                        "product-total": "Th??nh ti???n", // Defaults to 'Total'
                        "total": "T???ng ti???n" // Defaults to 'Total'
                    },
                }
                easyinvoice.createInvoice(data, function (result) {
                    easyinvoice.download(`${idbill}.pdf`, result.pdf);
                });
            }

            // CALL API

            async function createInvoice(idBill, idStaff, payment, phoneCus, date) {
                return (await instance.post('booking/create-bill', {
                    idBill,
                    idStaff,
                    payment,
                    phoneCus,
                    date,
                    idStore,
                })).data
            }

            async function cancelBooking_Phone(phone) {
                return (await instance.post('booking/cancel-booking', {
                    phone
                })).data
            }

            async function getBooking_Phone_Date(date, phone) {
                return (await instance.post('booking/getbooking-date-phone', {
                    date,
                    phone
                })).data
            }

            async function editBooking_func(dateOld, idShiftOld, phoneCusOld, idStaffOld, dateNew, shiftNew, arrServiceNew, phoneCusNew, staffNew, store) {
                return (await instance.post('booking/edit-booking', {
                    dateOld,
                    idShiftOld,
                    phoneCusOld,
                    idStaffOld,
                    dateNew,
                    shiftNew,
                    arrServiceNew,
                    phoneCusNew,
                    staffNew,
                    store,
                })).data
            }

            async function addBooking(date, shift, arrService, phoneCus, staff, store) {
                return (await instance.post('booking/add-booking', {
                    date,
                    shift,
                    arrService,
                    phoneCus,
                    staff,
                    store,
                })).data
            }

            async function checkPhoneCustomer(phone) {
                return (await instance.post('booking/check-phone-customer', {
                    phone
                })).data
            }

            async function getEmPloyeeRegisShift_Date(date) {
                return (await instance.post('booking/get-employee-regis-date', {
                    date
                })).data
            }

            async function getEmployee_Date_Time(date, shift) {
                return (await instance.post('booking/get-employee-datetime', {
                    date,
                    shift
                })).data
            }

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

            async function getInfoBooking(phone, dateBook, hourStart, minuteStart) {
                return (await instance.post('booking/info-booking', {
                    phone,
                    dateBook,
                    hourStart,
                    minuteStart,
                })).data
            }
        }
        const logoutBtn = document.querySelector('#log-out')
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            window.localStorage.clear();
            window.location = '/'
        }
    })();
} else {
    window.location = '/page-err'
}