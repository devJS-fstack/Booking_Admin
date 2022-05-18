
navheader.style.display = 'none'

const upload_element = document.querySelector('.avatar-uploader');
const upload_input = document.querySelector('.el-upload__input');
const upload_dragger = document.querySelector('.el-upload-dragger');
const clearImg_upload = document.querySelector('.avatar-uploader__trash');

//  function log err
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
// variable to add employee
var haveImg = false;
var idstore_add = -1;
var idmanager;
var idTypeStaff = 1;
var idStore;
var isUpload = false;
//  input

const inputSurName = document.getElementById('input-surname-employee__add');
const inputNameEmployee = document.getElementById('input-name-employee__add');
const inputStore = document.querySelector('#input-store-employee__add');
const inputManager = document.querySelector('#input-manager-employee__add');
const inputCCCD = document.querySelector('#input-cccd-employee__add');
const inputEmail = document.querySelector('#input-email-employee__add');
const inputPhone = document.querySelector('#input-phone-employee__add');
const inputSex = document.querySelector('#input-sex-employee__add');
const inputService = document.querySelector('#input-service_assign__add');
const inputTypeEm = document.querySelector('#input-type-employee__add');



upload_element.onclick = (e) => {
    upload_input.click();
    upload_input.onchange = () => {
        isUpload = true;
        var upload_img = "";
        const file = upload_input.files[0];
        upload_img = URL.createObjectURL(file)
        upload_dragger.innerHTML = `
        <div class="uploaded-photo-preview">
            <img src="${upload_img}" alt="">
        </div>
        `
        successInputCategory(0, '')
        haveImg = true;
        clearImg_upload.style.display = 'block';
    }
}

clearImg_upload.onclick = () => {
    upload_dragger.innerHTML = `
    <div class="el-upload-dragger__upload">
    <div>
        <i
            class="el-icon-upload fa-solid fa-cloud-arrow-up"></i>
        <div class="el-upload__text mt-2">
            Nhấn vào để tải ảnh lên
        </div>
    </div>
</div>
        `
    clearImg_upload.style.display = 'none';
    haveImg = false;
}


// handle dropdown

const dropDown_storeEmployee = document.querySelector('#dropdown-store__employee');
const dropDown_managersEmployee = document.querySelector('#dropdown-managers__employee');
const dropDown_sexEmployee = document.querySelector('#dropdown-sex__employee');
const dropDown_servicesEmployee = document.querySelector('#dropdown-services__employee');
const dropDown_typeEmployee = document.querySelector('#dropdown-type__employee');
const arrows_down = document.querySelectorAll('.el-select__caret');
const itemDropdown_store = document.querySelectorAll('.item-store__dropdown');
const itemDropdown_managers = document.querySelectorAll('.item-managers__dropdown');
const itemDropdown_sex = document.querySelectorAll('.item-sex__dropdown');
const itemDropdown_service = document.querySelectorAll('.item-service__dropdown');
const itemDropdown_typeEm = document.querySelectorAll('.item-type-employee__dropdown');


// variable scroll 
var scrollStore = 448;
var scrollManager = 450;
var scrollSex = 560;
var scrollService = 330;
var scrollType = 560;
const modalAddEmployee = document.querySelector('#add-employee_modal')

// input click 
inputStore.onclick = () => {
    if (dropDown_storeEmployee.getAttribute('style') == 'min-width: 492.575px; transform-origin: center top; z-index: 2026; display: none;') {
        arrows_down[1].style.transform = 'rotate(0deg)';
        dropDown_storeEmployee.style = `min-width: 492.575px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollStore}px; left: 400px;display:block;`
    }
    else {
        arrows_down[1].style.transform = 'rotate(180deg)';
        dropDown_storeEmployee.style = `min-width: 492.575px; transform-origin: center top; z-index: 2026; display: none`
    }
}

inputManager.onclick = () => {
    if (dropDown_managersEmployee.getAttribute('style') == 'min-width: 450px; transform-origin: center bottom; z-index: 2026; display: none;') {
        arrows_down[2].style.transform = 'rotate(0deg)';
        dropDown_managersEmployee.style = `min-width: 450px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollManager}px; left: 883px;display:block;`
    }
    else {
        arrows_down[2].style.transform = 'rotate(180deg)';
        dropDown_managersEmployee.style = `min-width: 450px; transform-origin: center bottom; z-index: 2026; display: none`
    }
}

inputSex.onclick = () => {
    if (dropDown_sexEmployee.getAttribute('style') == 'min-width: 220px; transform-origin: center bottom; z-index: 2030; display: none;') {
        arrows_down[4].style.transform = 'rotate(0deg)';
        dropDown_sexEmployee.style = `min-width: 220px; transform-origin: center top; z-index: 2026; position: fixed; top: ${scrollSex}px; right: 200px;display:block;`
    }
    else {
        arrows_down[4].style.transform = 'rotate(180deg)';
        dropDown_sexEmployee.style = `min-width: 220px; transform-origin: center bottom; z-index: 2030; display: none`
    }
}

inputService.onclick = () => {
    if (dropDown_servicesEmployee.getAttribute('style') == 'min-width: 920px; transform-origin: center bottom; z-index: 2026; display: none;') {
        arrows_down[0].style.transform = 'rotate(0deg)';
        dropDown_servicesEmployee.style = `min-width: 920px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollService}px; right: 204px;display:block;`
    }
    else {
        arrows_down[0].style.transform = 'rotate(180deg)';
        dropDown_servicesEmployee.style = `min-width: 920px; transform-origin: center bottom; z-index: 2026; display: none`
    }
}

inputTypeEm.onclick = () => {
    if (dropDown_typeEmployee.getAttribute('style') == 'min-width: 220px; transform-origin: center bottom; z-index: 2030; display: none;') {
        arrows_down[3].style.transform = 'rotate(0deg)';
        dropDown_typeEmployee.style = `min-width: 220px; transform-origin: center top; z-index: 2026; position: fixed; top: ${scrollType}px; right: 434px;display:block;`
    }
    else {
        arrows_down[3].style.transform = 'rotate(180deg)';
        dropDown_typeEmployee.style = `min-width: 220px; transform-origin: center bottom; z-index: 2030; display: none`
    }
}

// oninput text
inputSurName.oninput = () => {
    if (inputSurName.value == '') {
        errInputCategory(1, 'Bạn vui lòng nhập họ của nhân viên')
    } else {
        successInputCategory(1, '')
    }
}

inputNameEmployee.oninput = () => {
    if (inputNameEmployee.value == '') {
        errInputCategory(2, 'Bạn vui lòng nhập tên của nhân viên')
    } else {
        successInputCategory(2, '')
    }
}

inputCCCD.oninput = () => {
    inputCCCD.value = inputCCCD.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    if (inputCCCD.value == '') {
        errInputCategory(6, 'Bạn vui lòng nhập CCCD/CMND của nhân viên')
    } else {
        successInputCategory(6, '')
    }
}

inputEmail.oninput = () => {
    if (inputEmail.value == '') {
        errInputCategory(9, 'Bạn vui lòng nhập email của nhân viên')
    } else {
        successInputCategory(9, '')
    }
}

inputPhone.oninput = () => {
    inputPhone.value = inputPhone.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    if (inputPhone.value == '') {
        errInputCategory(10, 'Bạn vui lòng nhập số điện thoại của nhân viên')
    } else {
        successInputCategory(10, '')
    }
}




// modal scroll

modalAddEmployee.onscroll = function () {
    var scrollTop = modalAddEmployee.scrollTop;
    scrollStore = 448 - scrollTop;
    scrollManager = 450 - scrollTop;
    scrollSex = 560 - scrollTop;
    scrollService = 330 - scrollTop;
    scrollType = 560 - scrollTop;
    if (dropDown_storeEmployee.style.display == 'block') {
        dropDown_storeEmployee.style = `min-width: 492.575px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollStore}px; left: 400px;display:block;`
    }
    if (dropDown_managersEmployee.style.display == 'block') {
        dropDown_managersEmployee.style = `min-width: 450px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollManager}px; left: 883px;display:block;`
    }
    if (dropDown_typeEmployee.style.display == 'block') {
        dropDown_typeEmployee.style = `min-width: 220px; transform-origin: center top; z-index: 2026; position: fixed; top: ${scrollSex}px; right: 430px;display:block;`
    }
    if (dropDown_sexEmployee.style.display == 'block') {
        dropDown_sexEmployee.style = `min-width: 220px; transform-origin: center top; z-index: 2026; position: fixed; top: ${scrollType}px; right: 200px;display:block;`
    }
    if (dropDown_servicesEmployee.style.display == 'block') {
        dropDown_servicesEmployee.style = `min-width: 920px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollService}px; right: 204px;display:block;`
    }

}


//  event onmouse

let isOver_store = false;
let isOver_manager = false;
let isOver_sex = false;
let isOver_serive = false;
let isOver_type = false;

dropDown_storeEmployee.onmouseover = function () {
    isOver_store = true;
}

dropDown_storeEmployee.onmouseleave = function () {
    isOver_store = false;
}

dropDown_managersEmployee.onmouseover = function () {
    isOver_manager = true;
}

dropDown_managersEmployee.onmouseleave = function () {
    isOver_manager = false;
}

dropDown_sexEmployee.onmouseover = function () {
    isOver_sex = true;
}

dropDown_sexEmployee.onmouseleave = function () {
    isOver_sex = false;
}

dropDown_servicesEmployee.onmouseover = function () {
    isOver_serive = true;
}

dropDown_servicesEmployee.onmouseleave = function () {
    isOver_serive = false;
}

dropDown_typeEmployee.onmouseover = function () {
    isOver_type = true;
}

dropDown_typeEmployee.onmouseleave = function () {
    isOver_type = false;
}

inputService.onfocusout = () => {
    if (!isOver_serive) {
        arrows_down[0].style.transform = 'rotate(180deg)';
        dropDown_servicesEmployee.style = `min-width: 920px; transform-origin: center bottom; z-index: 2026; display: none`
    }
}

inputStore.onfocusout = () => {
    if (!isOver_store) {
        arrows_down[1].style.transform = 'rotate(180deg)';
        dropDown_storeEmployee.style = `min-width: 492.575px; transform-origin: center top; z-index: 2026; display: none`
    }
}

inputManager.onfocusout = () => {
    if (!isOver_manager) {
        arrows_down[2].style.transform = 'rotate(180deg)';
        dropDown_managersEmployee.style = `min-width: 450px; transform-origin: center bottom; z-index: 2026; display: none`
    }
    if (noData_manager.style.display == 'flex') {
        dropDown_managersEmployee.style = `min-width: 450px; transform-origin: center bottom; z-index: 2026; display: none`
    }
}

inputTypeEm.onfocusout = () => {
    if (!isOver_type) {
        arrows_down[3].style.transform = 'rotate(180deg)';
        dropDown_typeEmployee.style = `min-width: 220px; transform-origin: center bottom; z-index: 2030; display: none`
    }
}

inputSex.onfocusout = () => {
    if (!isOver_sex) {
        arrows_down[4].style.transform = 'rotate(180deg)';
        dropDown_sexEmployee.style = `min-width: 220px; transform-origin: center bottom; z-index: 2030; display: none`
    }
}

// variable click item dropdown

var indexPreStore = -1;
var indexPreManager = -1;
var indexPreSex = -1;
var indexPreType = 0;
let countService = 0;
const spans_store = document.querySelectorAll('.item-store__dropdown span');
const spans_manager = document.querySelectorAll('.item-managers__dropdown span');
const spans_sexs = document.querySelectorAll('.item-sex__dropdown span');
const spans_typeEm = document.querySelectorAll('.item-type-employee__dropdown span');
const spans_service = document.querySelectorAll('.item-service__dropdown span');


// event click item dropdown

itemDropdown_store.forEach((item, index) => {
    item.onclick = function () {
        clearSelected_Manager();
        renderManager_Store(item.getAttribute('data-store'))
        idStore = item.getAttribute('data-store');
        inputManager.value = ""
        idmanager = 0;
        successInputCategory(4, '')
        if (indexPreStore != -1) {
            itemDropdown_store[indexPreStore].classList.remove('selected');
        }
        inputStore.value = spans_store[index].textContent.trim();
        arrows_down[1].style.transform = 'rotate(180deg)';
        dropDown_storeEmployee.style = `min-width: 492.575px; transform-origin: center top; z-index: 2026; display: none`
        item.classList.add('selected');
        indexPreStore = index;
        idstore_add = item.getAttribute('data-store');
    }
})

const noData_manager = document.querySelector('.no-data__manager');

function renderManager_Store(idStore) {
    var haveManager = false;
    itemDropdown_managers.forEach((item) => {
        if (item.getAttribute('data-store') == idStore) {
            item.style.display = 'flex';
            noData_manager.style.display = 'none';
            haveManager = true;
        }
        else {
            item.style.display = 'none';
        }
    })
    if (haveManager == false) noData_manager.style.display = 'flex';
}

function renderAllManager() {
    itemDropdown_managers.forEach((item) => {
        if (item.style.display == 'none') item.style.display = 'flex';
    })

    noData_manager.style.display = 'none';
}


itemDropdown_managers.forEach((item, index) => {
    item.onclick = function () {
        successInputCategory(5, '')
        if (indexPreManager != -1) {
            itemDropdown_managers[indexPreManager].classList.remove('selected');
        }
        inputManager.value = spans_manager[index].textContent.trim();
        arrows_down[2].style.transform = 'rotate(180deg)';
        dropDown_managersEmployee.style = `min-width: 450px; transform-origin: center bottom; z-index: 2026; display: none`
        item.classList.add('selected');
        indexPreManager = index;
        idmanager = item.getAttribute('data-manager');
    }
})

itemDropdown_typeEm.forEach((item, index) => {
    item.onclick = () => {
        arrServicesId = [];
        idTypeStaff = item.getAttribute('data-type');
        if (index > 0) {
            removeAllSelectedService();
            tags_service.innerHTML = "";
            inputService.placeholder = 'Nhân Viên Này Không Cần Chọn Dịch Vụ Cho Phép';
            inputService.value = '';
            countClick = 0;
            countService = 0;
        }
        else {
            inputService.placeholder = 'Chọn Dịch Vụ Cho Phép';
        }
        itemDropdown_typeEm[indexPreType].classList.remove('selected');
        inputTypeEm.value = spans_typeEm[index].textContent.trim();
        arrows_down[3].style.transform = 'rotate(180deg)';
        dropDown_typeEmployee.style = `min-width: 220px; transform-origin: center bottom; z-index: 2030; display: none`
        item.classList.add('selected');
        indexPreType = index;
    }
})

itemDropdown_sex.forEach((item, index) => {
    item.onclick = function () {
        successInputCategory(8, '')
        if (indexPreSex != -1) {
            itemDropdown_sex[indexPreSex].classList.remove('selected');
        }
        inputSex.value = spans_sexs[index].textContent.trim();
        arrows_down[4].style.transform = 'rotate(180deg)';
        dropDown_sexEmployee.style = `min-width: 220px; transform-origin: center bottom; z-index: 2030; display: none`
        item.classList.add('selected');
        indexPreSex = index;
    }
})

var indexFirstChecking = -1;
var indexIsChecking = -1;
function getIndexIsChecking() {
    for (var i = 0; i < itemDropdown_service.length; i++) {
        if (itemDropdown_service[i].classList.contains('selected')) {
            indexIsChecking = i;
            break;
        }
    }
}
const tags_service = document.querySelector('.el-select__tags span');
var countClick = 0;
function removeAllSelectedService() {
    itemDropdown_service.forEach((item, index) => {
        if (item.classList.contains('selected')) item.classList.remove('selected');
    })
}
itemDropdown_service.forEach((item, index) => {
    item.onclick = () => {
        arrServicesId = [];
        successInputCategory(3, '')
        if (indexPreType == 1) {
            itemDropdown_typeEm[indexPreType].classList.remove('selected');
            inputTypeEm.value = spans_typeEm[0].textContent.trim();
            itemDropdown_typeEm[0].classList.add('selected');
            indexPreType = 0;
        }
        inputService.value = " ";
        inputService.placeholder = "";
        inputService.focus();
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
                inputService.placeholder = 'Lựa Chọn Dịch Vụ Cho Phép';
                inputService.value = '';
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

// handle submit form 

const btnAddDefault = document.getElementById('btn-AddEmployee');

// variable edit employee

var idEmployee;

// ==> form add employee

const btnAddEmployee = document.getElementById('adm-btn-employee__add');
const btnAddEmployee_span = document.querySelector('#adm-btn-employee__add span');
var arrServicesId = [];
const inputArrServices = document.getElementById('arrServiceAssign');
const formEmployee = document.getElementById('addEmployeeForm');

function pushIdServiceIntoArr() {
    itemDropdown_service.forEach((item, index) => {
        if (item.classList.contains('selected')) {
            arrServicesId.push(item.getAttribute('data-service'));
        }
    })
}

btnAddDefault.addEventListener('click', (e) => {
    inputTypeEm.value = spans_typeEm[0].textContent.trim();
    arrows_down[3].style.transform = 'rotate(180deg)';
    dropDown_typeEmployee.style = `min-width: 220px; transform-origin: center bottom; z-index: 2030; display: none`
    itemDropdown_typeEm[0].classList.add('selected');
    countService = 0;
    tittleEmployee.textContent = "Tạo Nhân Viên"
    btnAddEmployee_span.textContent = "Thêm Nhân Viên";
    upload_dragger.innerHTML = `
    <div class="el-upload-dragger__upload">
    <div>
        <i
            class="el-icon-upload fa-solid fa-cloud-arrow-up"></i>
        <div class="el-upload__text mt-2">
            Nhấn vào để tải ảnh lên
        </div>
    </div>
</div>
        `
    clearImg_upload.style.display = 'none';
    haveImg = false;
    inputSurName.value = "";
    inputNameEmployee.value = "";
    inputCCCD.value = "";
    inputEmail.value = "";
    inputPhone.value = "";
    clearSelected_Store();
    clearSelected_Manager();
    removeAllSelectedService();
    tags_service.innerHTML = "";
    inputService.value = "";
    inputService.placeholder = "Chọn Dịch Vụ Cho Phép";
    countClick = 0;
    countService = 0;
    idStore = -1;
    idmanager = -1;
    idTypeStaff = 1;
})

const inputEditEm = document.querySelector('#idEmployeeEdit');

btnAddEmployee.addEventListener('click', (e) => {
    e.preventDefault();
    let flag = 0;

    // validate surname
    if (inputSurName.value == '') {
        errInputCategory(1, 'Bạn vui lòng nhập họ của nhân viên')
    } else {
        successInputCategory(1, '')
        flag = 1;
    }
    // validate name
    if (inputNameEmployee.value == '') {
        errInputCategory(2, 'Bạn vui lòng nhập tên của nhân viên')
    } else {
        successInputCategory(2, '')
        if (flag == 1) flag = 2
    }
    // validate service
    if (inputService.placeholder == "Chọn Dịch Vụ Cho Phép") {
        errInputCategory(3, 'Bạn vui lòng chọn dịch vụ cho phép của nhân viên này')
    } else {
        successInputCategory(3, '')
        if (flag == 2) flag = 3
    }
    // validate store
    if (inputStore.value == "") {
        errInputCategory(4, 'Bạn vui lòng chọn cửa hàng cho nhân viên này')
    } else {
        successInputCategory(4, '')
        if (flag == 3) flag = 4
    }
    // validate manager
    if (inputManager.value == "") {
        errInputCategory(5, 'Bạn vui lòng chọn nhân viên quản lý')
    } else {
        successInputCategory(5, '')
        if (flag == 4) flag = 5
    }
    // validate CCCD
    if (inputCCCD.value == '') {
        errInputCategory(6, 'Bạn vui lòng nhập CCCD/CMND của nhân viên')
    } else {
        if (inputCCCD.value.length == 12 || inputCCCD.value.length == 9) {
            successInputCategory(6, '')
            if (flag == 5) flag = 6
        }
        else {
            errInputCategory(6, 'Bạn vui lòng nhập đúng CCCD/CMND của nhân viên')
        }
    }
    // validate sex
    if (inputSex.value == "") {
        errInputCategory(8, 'Bạn vui lòng chọn giới tính')
    } else {
        successInputCategory(8, '')
        if (flag == 6) flag = 7
    }

    // validate email
    if (inputEmail.value == "") {
        errInputCategory(9, 'Bạn vui lòng nhập email của nhân viên này')
    } else {
        if (validateEmail(inputEmail.value)) {
            successInputCategory(9, '')
            if (flag == 7) flag = 8
        } else {
            errInputCategory(9, 'Bạn vui lòng nhập đúng email')
        }
    }
    // validate phone
    if (inputPhone.value == "") {
        errInputCategory(10, 'Bạn vui lòng nhập số điện thoại của nhân viên này')
    }
    else {
        if (validatePhone(inputPhone.value)) {
            successInputCategory(10, '')
            if (flag == 8) flag = 9
        } else {
            errInputCategory(10, 'Bạn vui lòng nhập đúng số điện thoại')
        }
    }
    // validate upload img
    if (haveImg) {
        successInputCategory(0, '')
        if (flag == 9) flag = 10
    }
    else {
        errInputCategory(0, 'Chọn ảnh đại diện')
    }
    // ==>
    if (flag == 10) {
        if (idTypeStaff == 1) {
            pushIdServiceIntoArr();
            inputArrServices.value = arrServicesId;
        }

        if ($('#adm-btn-employee__add').text().trim() == 'Lưu Thay Đổi') {
            if (isUpload)
                formEmployee.action = "employee/edit-employee-withimg";
            else {
                formEmployee.action = 'employee/edit-employee-without-img'
                formEmployee.enctype = '';
            }
        }
        inputSurName.value = inputSurName.value.trim();
        inputNameEmployee.value = inputNameEmployee.value.trim();
        inputEmail.value = inputEmail.value.trim();
        inputCCCD.value = inputCCCD.value.trim();
        inputPhone.value = inputPhone.value.trim();
        inputStore.value = idStore;
        inputManager.value = idmanager;
        inputTypeEm.value = idTypeStaff;
        console.log(formEmployee.action);
        formEmployee.submit();
    }

})

const editEmployee = document.querySelectorAll('.edit-employee');
const tittleEmployee = document.querySelector('.tittle-employee');
// handle edit employee

function resetSelected_Store(idStore) {
    inputStore.value = "";
    itemDropdown_store.forEach((item, index) => {
        if (item.getAttribute('data-store') == idStore) {
            if (!item.classList.contains('selected')) {
                item.classList.add('selected');
            }
            indexPreStore = index;
            inputStore.value = spans_store[index].textContent.trim();
            renderManager_Store(item.getAttribute('data-store'));
        }
        else {
            if (item.classList.contains('selected')) {
                item.classList.remove('selected');
            }
        }
    })
}

function clearSelected_Store() {
    inputStore.value = '';
    indexPreStore = -1;
    itemDropdown_store.forEach((item, index) => {
        if (item.classList.contains('selected')) item.classList.remove('selected');

    })
}

function resetSelected_Manager(idManager) {
    inputManager.value = "";
    itemDropdown_managers.forEach((item, index) => {
        if (item.getAttribute('data-manager') == idManager) {
            if (!item.classList.contains('selected')) {
                item.classList.add('selected');
            }
            indexPreManager = index;
            inputManager.value = spans_manager[index].textContent.trim();

        }
        else {
            if (item.classList.contains('selected')) {
                item.classList.remove('selected');
            }
        }
    })
}

function clearSelected_Manager() {
    inputManager.value = '';
    indexPreManager = -1;
    renderAllManager();
    itemDropdown_managers.forEach((item, index) => {
        if (item.classList.contains('selected')) item.classList.remove('selected');

    })
}

function resetSelected_TypeStaff(idType) {
    inputTypeEm.value = "";
    itemDropdown_typeEm.forEach((item, index) => {
        if (item.getAttribute('data-type') == idType) {
            if (!item.classList.contains('selected')) {
                item.classList.add('selected');
            }
            indexPreType = index;
            inputTypeEm.value = spans_typeEm[index].textContent.trim();
            if (index > 0) {
                inputService.placeholder = 'Nhân Viên Này Không Cần Chọn Dịch Vụ Cho Phép';
            }
        }
        else {
            if (item.classList.contains('selected')) {
                item.classList.remove('selected');
            }
        }
    })

}

function resetSelected_Sex(gender) {
    inputSex.value = "";
    itemDropdown_sex.forEach((item, index) => {
        if (item.getAttribute('data-sex') == gender) {
            if (!item.classList.contains('selected')) {
                item.classList.add('selected');
            }
            indexPreSex = index;
            inputSex.value = spans_sexs[index].textContent.trim();
        }
        else {
            if (item.classList.contains('selected')) {
                item.classList.remove('selected');
            }
        }
    })
}

function resetSelected_Service() {
    itemDropdown_service.forEach((item, index) => {
        if (item.classList.contains('selected')) {
            item.classList.remove('selected');
        }
    })
}

function isCheckService(arrService) {
    var count = 0;
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


editEmployee.forEach((item, index) => {
    item.onclick = async () => {
        $('#add-employee_modal').modal('show');
        tittleEmployee.textContent = "Chỉnh Sửa Nhân Viên";
        btnAddEmployee_span.textContent = "Lưu Thay Đổi";
        idEmployee = item.getAttribute('data-employee');
        const { status, employee } = await getInfoEmployee(idEmployee);
        const info = employee[0];
        isUpload = false;
        if (status == 'success') {
            // set variable to edit
            idStore = info.IDStore;
            idmanager = info.IDManager;
            idTypeStaff = info.TypeStaff;
            inputEditEm.value = info.IDStaff;
            // ==>
            inputSurName.value = info.SurName;
            inputNameEmployee.value = info.NameStaff;
            inputCCCD.value = info.CCCD;
            inputEmail.value = info.Email;
            inputPhone.value = info.Phone;
            upload_dragger.innerHTML = `
            <div class="uploaded-photo-preview">
                <img src="${info.PathImgStaff}" alt="">
            </div>
            `
            haveImg = true;
            clearImg_upload.style.display = 'block';
            resetSelected_Store(info.IDStore);
            resetSelected_Manager(info.IDManager);
            resetSelected_Sex(info.Gender);
            resetSelected_TypeStaff(info.TypeStaff);
            resetSelected_Service();
            const { statusS, service_employee } = await getService_Employee_id(idEmployee);
            if (statusS == 'success') {
                inputService.placeholder = '';
                inputService.value = ' ';
                isCheckService(service_employee);
            }
            else {
                removeAllSelectedService();
                tags_service.innerHTML = "";
                inputService.value = '';
                countClick = 0;
                countService = 0;
            }
        }
    }
})

//  handle delete employee 

// variable to delete employee
var idEmployee_delete;

const deleteItem_employee = document.querySelectorAll('.delete-employee');
const btnConfrimDelete = document.getElementById('btn-delete__employee');
const notiDeleteEmployee = document.querySelector('.notification-employe_delete p')


deleteItem_employee.forEach((item, index) => {
    item.onclick = async () => {
        idEmployee_delete = item.getAttribute('data-employee');
        const { status, infoBookFuture, infoBookDone } = await getInfoBookEmployee(idEmployee_delete);
        if (status == 'success') {
            var haveBook = false
            if (infoBookFuture.length > 0) {
                haveBook = true;
                notiDeleteEmployee.textContent = `Bạn có chắc chắn muốn xóa nhân viên này? Hành động này sẽ xóa đi ${infoBookFuture.length} lần đặt nhân viên này trong tương lai`;
            }
            if (infoBookDone.length > 0) {
                haveBook = true;
                notiDeleteEmployee.textContent = `Bạn có chắc chắn muốn xóa nhân viên này? Hành động này sẽ xóa đi ${infoBookDone.length} lần đã đặt nhân viên này`;
            }
            if (infoBookFuture.length > 0 && infoBookDone.length > 0) {
                haveBook = true;
                notiDeleteEmployee.textContent = `Bạn có chắc chắn muốn xóa nhân viên này? Hành động này sẽ xóa đi ${infoBookDone.length} lần đã đặt nhân viên này và ${infoBookFuture.length} lần đặt nhân viên này trong tương lai`;
            }
            if (!haveBook)
                notiDeleteEmployee.textContent = `Bạn có chắc chắn muốn xóa nhân viên này? Hành động này sẽ xóa những thông tin khác liên quan đến nhân viên này`;
        }
    }
})

// handle disable employee

const disableItem = document.querySelectorAll('.disable-employee');
const disableText = document.querySelectorAll('.text-disable');
const disableIcon = document.querySelectorAll('.icon-disable');

const statusEmployee = document.querySelectorAll('.status svg path');
const statusColor = document.querySelectorAll('.status');
const statusText = document.querySelectorAll('.status-text');
function disableItemClick(idEmployee) {
    for (var i = 0; i < statusEmployee.length; i++) {
        if (statusEmployee[i].getAttribute('data-employee') == idEmployee) {
            statusEmployee[i].setAttribute('d', 'M18 6L6 18M6 6l12 12');
            statusColor[i].classList.remove('is-green')
            statusColor[i].classList.add('is-red')
            statusText[i].textContent = 'Tạm Nghỉ'
            disableText[i].textContent = 'Hoạt động'
            disableIcon[i].classList.remove('fa-ban');
            disableIcon[i].classList.add('fa-check');
            break;
        }
    }
}

function enableItemClick(idEmployee) {
    for (var i = 0; i < statusEmployee.length; i++) {
        if (statusEmployee[i].getAttribute('data-employee') == idEmployee) {
            statusEmployee[i].setAttribute('d', 'M20 6L9 17l-5-5');
            statusColor[i].classList.add('is-green')
            statusColor[i].classList.remove('is-red')
            statusText[i].textContent = 'Hoạt Động'
            disableText[i].textContent = 'Tạm nghỉ'
            disableIcon[i].classList.add('fa-ban');
            disableIcon[i].classList.remove('fa-check');
            break;
        }
    }
}

function launch_toast(mess) {
    var x = document.getElementById("toast")
    x.className = "show";
    x.textContent = '';
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    setTimeout(function () { x.textContent = mess }, 700);
}

disableItem.forEach((item, index) => {
    item.onclick = async () => {
        let idEmployee_disable = item.getAttribute('data-employee');
        if (disableText[index].textContent.trim() == 'Tạm nghỉ') {
            const { status } = await setStatusEmployee(idEmployee_disable, 'Tạm Nghỉ')
            if (status == 'success') {
                disableItemClick(idEmployee_disable);
                launch_toast('Nhân viên này đã được tạm nghỉ');
            }
        }
        else {
            const { status } = await setStatusEmployee(idEmployee_disable, 'Hoạt Động')
            if (status == 'success') {
                enableItemClick(idEmployee_disable);
                launch_toast('Nhân viên này đã được hoạt động');
            }
        }

    }
})

function removeEmployeeDeleted(idEmployee) {
    const admEmployee_all = document.querySelectorAll('.adm-service');
    for (var i = 0; i < admEmployee_all.length; i++) {
        if (admEmployee_all[i].getAttribute('data-employee') == idEmployee) {
            admEmployee_all[i].remove();
            break;
        }
    }
}

btnConfrimDelete.onclick = async function () {
    const { status } = await deleteEmployee(idEmployee_delete);
    if (status == 'success') {
        console.log(status);
        removeEmployeeDeleted(idEmployee_delete);
        $('#alertModalDelete').modal('hide');
    }
}

function renderStatus() {
    statusText.forEach((item, index) => {
        if (item.textContent.trim() == 'Tạm Nghỉ') {
            statusEmployee[index].setAttribute('d', 'M18 6L6 18M6 6l12 12');
            statusColor[index].classList.remove('is-green')
            statusColor[index].classList.add('is-red')
            statusText[index].textContent = 'Tạm Nghỉ'
            disableText[index].textContent = 'Hoạt động'
            disableIcon[index].classList.remove('fa-ban');
            disableIcon[index].classList.add('fa-check');
        }
    })
}

// => handle regis shift 

const btnConfirmRegis = document.getElementById('adm-add-regis_shift');
const inputdateFrom = document.getElementById('input_from');
const inputdateTo = document.getElementById('input_to');
const inputStore_Regis = document.getElementById('input-store-regis-shift')

const inputEmployeRegis = document.getElementById('input-employee-regis__shift');
const dropDown_employeeService = document.querySelector('#dropdown-employee__service');
const listDropdown_employee = document.querySelectorAll('.list-employee__dropdown');

var scrollYStore_Regis = 455;
var scrollY_employee = 555;
let isOver_employee = false;
var isOver_storeRegis = false;


dropDown_employeeService.onmouseover = function () {
    isOver_employee = true;
}

dropDown_employeeService.onmouseleave = function () {
    isOver_employee = false;
}



inputEmployeRegis.onclick = () => {
    if (dropDown_employeeService.getAttribute('style') == 'min-width: 450px; transform-origin: center bottom; z-index: 2003; display: none;') {
        arrows_down[6].style.transform = 'rotate(0deg)';
        dropDown_employeeService.style = `min-width: 450px; position: fixed; top: ${scrollY_employee}px; left: 543px; transform-origin: center bottom; z-index: 2003; display:block;`
    }
    else {
        arrows_down[6].style.transform = 'rotate(180deg)';
        dropDown_employeeService.style = 'min-width: 450px; transform-origin: center bottom; z-index:2003; display: none;'
    }
}

const dropDownStore_regis = document.getElementById('dropdown-store__regis');
const itemDropdownStore_regis = document.querySelectorAll('.item-store__dropdown_regis');
const span_storeRegis = document.querySelectorAll('.item-store__dropdown_regis span')
dropDownStore_regis.onmouseover = function () {
    isOver_storeRegis = true;
}

dropDownStore_regis.onmouseleave = function () {
    isOver_storeRegis = false;
}

inputStore_Regis.onclick = () => {
    if (dropDownStore_regis.getAttribute('style') == 'min-width: 400px; transform-origin: center top; z-index: 2026; display: none;') {
        arrows_down[5].style.transform = 'rotate(0deg)';
        dropDownStore_regis.style = `min-width: 400px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollYStore_Regis}px; left: 530px;display:block;`
    }
    else {
        arrows_down[5].style.transform = 'rotate(180deg)';
        dropDownStore_regis.style = `min-width: 400px; transform-origin: center top; z-index: 2026; display: none`
    }
}

inputEmployeRegis.onfocusout = () => {
    if (!isOver_employee) {
        arrows_down[6].style.transform = 'rotate(180deg)';
        dropDown_employeeService.style = 'min-width: 450px; transform-origin: center bottom; z-index:2003; display: none;'
    }
}

inputStore_Regis.onfocusout = () => {
    if (!isOver_storeRegis) {
        arrows_down[5].style.transform = 'rotate(180deg)';
        dropDownStore_regis.style = `min-width: 400px; transform-origin: center top; z-index: 2026; display: none`
    }
}



var indexPreStore_regis = -1;
itemDropdownStore_regis.forEach((item, index) => {
    item.onclick = function () {
        idStoreRegis = item.getAttribute('data-store')
        removeAllSelectedEmployee();
        renderEmployee_Store(item.getAttribute('data-store'))
        inputEmployeRegis.value = "";
        if (indexPreStore_regis != -1) {
            itemDropdownStore_regis[indexPreStore_regis].classList.remove('selected');
        }
        inputStore_Regis.value = span_storeRegis[index].textContent.trim();
        arrows_down[5].style.transform = 'rotate(180deg)';
        dropDownStore_regis.style = `min-width: 400px; transform-origin: center top; z-index: 2026; display: none`
        item.classList.add('selected');
        indexPreStore_regis = index;
    }
})
const noData_employee = document.querySelector('.no-data__employee')
function renderEmployee_Store(idStore) {
    var haveEmployee = false;
    listDropdown_employee.forEach((item, index) => {
        if (item.getAttribute('data-store') == idStore) {
            item.style.display = 'flex';
            noData_employee.style.display = 'none';
            haveEmployee = true;
        }
        else {
            item.style.display = 'none';
        }
    })

    if (haveEmployee == false) noData_employee.style.display = 'flex';
}

const btnRegisShift = document.getElementById('btn-AddRegisShift')

btnRegisShift.onclick = (e) => {
    removeAllSelectedEmployee();
    removeAllSelectedStore();
    inputStore_Regis.value = "";
    inputdateFrom.value = "";
    inputdateTo.value = "";
}

var indexFirstChecking_e = -1;
var indexIsChecking_e = -1;
var countClick_e = 0;
var countEmployee = 0;

function getIndexIsChecking_e() {
    for (var i = 0; i < listDropdown_employee.length; i++) {
        if (listDropdown_employee[i].classList.contains('selected')) {
            indexIsChecking_e = i;
            break;
        }
    }
}


const tags_employee = document.querySelectorAll('.el-select__tags span');
const span_nameEmployee = document.querySelectorAll('.list-employee__dropdown span');
function removeAllSelectedEmployee() {
    tags_employee[1].innerHTML = '';
    inputEmployeRegis.value = "";
    countClick_e = 0;
    countEmployee = 0;
    listDropdown_employee.forEach((item, index) => {
        if (item.classList.contains('selected')) item.classList.remove('selected');
    })
}

function removeAllSelectedStore() {
    indexPreStore_regis = -1;
    itemDropdownStore_regis.forEach((item, index) => {
        if (item.classList.contains('selected')) item.classList.remove('selected');
    })
}


listDropdown_employee.forEach((item, index) => {
    item.onclick = function () {
        // arrIdStaff_service = []
        inputEmployeRegis.value = ' ';
        inputEmployeRegis.focus();
        countClick_e++;
        if (countClick_e == 1) {
            indexFirstChecking_e = index;
        }
        if (listDropdown_employee[index].classList.contains('selected')) {
            listDropdown_employee[index].classList.remove('selected');
            if (indexFirstChecking_e == index && countClick_e > 1) {
                getIndexIsChecking_e();
                if (indexIsChecking_e == -1) {
                    indexIsChecking_e = indexFirstChecking_e;
                }
                indexFirstChecking_e = indexIsChecking_e;
                const tagsText = document.querySelector('.el-select__tags-text')
                tagsText.innerHTML = span_nameEmployee[indexIsChecking_e].textContent.trim()
            }
            countEmployee--;
            if (countEmployee == 1) {
                const spanCount = document.querySelectorAll('.el-tag--info');
                spanCount[1].remove();
            }
            else if (countEmployee > 1) {
                const spanCount = document.querySelectorAll('.el-select__tags-text');
                spanCount[1].textContent = `+${countEmployee - 1}`
            }
            else {
                const spanCount = document.querySelectorAll('.el-tag--info');
                spanCount[0].remove();
                inputEmployeRegis.placeholder = 'Chọn Nhân Viên';
                inputEmployeRegis.value = '';
                countClick_e = 0;
            }
        }
        else {
            countEmployee++;
            item.classList.add('selected');
            if (countEmployee == 2) {
                tags_employee[1].innerHTML += `<span
                    class="el-tag el-tag--info el-tag--small el-tag--light">
                    <span class="el-select__tags-text">
                        +${countEmployee - 1}
                    </span>
                </span>`
            }
            else if (countEmployee > 2) {
                const spanCount = document.querySelectorAll('.el-select__tags-text');
                spanCount[1].textContent = `+${countEmployee - 1}`
            }
            else {
                tags_employee[1].innerHTML = `
                    <span
                        class="el-tag el-tag--info el-tag--small el-tag--light">
                        <span class="el-select__tags-text">
                            ${span_nameEmployee[index].textContent.trim()}
                        </span>
                    </span>`
            }
        }
        successInputCategory(13, '');
    }

})

inputdateFrom.onfocusout = () => {
    var datenow = new Date();
    var dateInputFrom = new Date(`${inputdateFrom.value}`);
    datenow.setHours(0, 0, 0, 0);
    dateInputFrom.setHours(0, 0, 0, 0);
    if (datenow.getTime() > dateInputFrom.getTime()) {
        errInputCategory(11, 'Bạn vui lòng chọn ngày lớn hơn ngày hiện tại')
    }
    else {
        successInputCategory(11, '');
    }
}

var getDaysArray = function (start, end) {
    for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
        arr.push(new Date(dt));
    }
    return arr;
};

var arrDateRegis = [];
var arrEmployeeRegis = [];
var idStoreRegis;

function pushIdEmployee() {
    arrEmployeeRegis = [];
    listDropdown_employee.forEach((item, index) => {
        if (item.classList.contains('selected')) {
            arrEmployeeRegis.push(item.getAttribute('data-employee'))
        }
    })
}




function pushDateRegisToArr(daylist) {
    arrDateRegis = [];
    for (var i = 0; i < daylist.length; i++) {
        arrDateRegis.push(`${daylist[i].getFullYear()}-${daylist[i].getMonth() + 1}-${daylist[i].getDate()}`)
    }
}




btnConfirmRegis.addEventListener('click', async (e) => {
    e.preventDefault();
    var flag = 0;
    if (inputdateFrom.value == "") {
        errInputCategory(11, 'Bạn vui lòng chọn ngày bắt đầu')
    }
    else {
        var datenow = new Date();
        var dateInputFrom = new Date(`${inputdateFrom.value}`);
        datenow.setHours(0, 0, 0, 0);
        dateInputFrom.setHours(0, 0, 0, 0);
        if (datenow.getTime() > dateInputFrom.getTime()) {
            errInputCategory(11, 'Bạn vui lòng chọn ngày lớn hơn ngày hiện tại')
        }
        else {
            flag = 1;
            successInputCategory(11, '');
        }
    }

    if (inputdateTo.value == "") {
        errInputCategory(12, 'Bạn vui lòng chọn ngày kết thúc')
    }
    else {
        if (flag == 1) flag = 2
        successInputCategory(12, '');
    }

    if (inputEmployeRegis.value == "") {
        errInputCategory(14, 'Bạn vui lòng chọn nhân viên cần đăng ký ngày làm việc')
    }
    else {
        if (flag == 2) flag = 3
        successInputCategory(14, '');
    }

    if (inputStore_Regis.value == "") {
        errInputCategory(13, 'Bạn vui lòng chọn cửa hàng cần đăng ký')
    } else {
        if (flag == 3) flag = 4
        successInputCategory(13, '');
    }

    if (flag == 4) {
        var dateInputFrom = new Date(`${inputdateFrom.value}`);
        var dateInptutTo = new Date(`${inputdateTo.value}`);
        var daylist = getDaysArray(dateInputFrom, dateInptutTo);
        daylist.map((v) => v.toISOString().slice(0, 10)).join("")
        pushDateRegisToArr(daylist);
        pushIdEmployee();
        const { status_haveEmployee } = await checkEmployeeRegis(arrDateRegis, arrEmployeeRegis);
        if (status_haveEmployee == 'have') {
            errInputCategory(14, 'Đã có nhân viên đăng ký làm việc trong thời gian này');
        } else {
            successInputCategory(14, '');
            const { status } = await regisShift(arrDateRegis, arrEmployeeRegis, idStoreRegis);
            if (status == 'success') {
                $('#add-regisShift').modal('hide');
                launch_toast('Đăng Ký Làm Việc Thành Công');
            }
        }
    }



})

window.addEventListener('load', () => {
    renderStatus();
})

async function checkEmployeeRegis(arrDate, arrEmployee) {
    return (await instance.post('employee/check-regis-shift', {
        arrDate,
        arrEmployee,
    })).data;
}

async function regisShift(arrDate, arrEmployee, idStore) {
    return (await instance.post('employee/regis-shift', {
        arrDate,
        arrEmployee,
        idStore
    })).data;
}

async function setStatusEmployee(idEmployee, status) {
    return (await instance.post('employee/set-status', {
        idEmployee,
        status
    })).data;
}

async function getInfoBookEmployee(idEmployee) {
    return (await instance.post('employee/info-book', {
        idEmployee
    })).data;
}


async function deleteEmployee(idEmployee) {
    return (await instance.post('employee/delete-employee', {
        idEmployee
    })).data;
}

async function getInfoEmployee(idEmployee) {
    return (await instance.post('employee/info-employee', {
        idEmployee
    })).data;
}

async function getService_Employee_id(idEmployee) {
    return (await instance.post('employee/service-employee-id', {
        idEmployee
    })).data;
}

