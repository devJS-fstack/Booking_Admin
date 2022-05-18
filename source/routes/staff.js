const express = require('express');
const router = express.Router();
const StaffController = require('../app/Controllers/Staff/StaffController')
const { uploadFile, getUrlPublic } = require('../app/Models/UploadModal')
const { sequelize } = require('../util/sequelizedb');
const fs = require('fs');


const multer = require('multer')
const path = require('path');

let fileName = "";
let mineType = ""
var name = "";
var filepath = "";
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './source/public/img')
    },
    filename: (req, file, callback) => {
        // console.log(file)
        filepath = Date.now() + path.extname(file.originalname);
        var fileName = filepath.split('.')
        name = fileName[0]
        mineType = fileName[1];
        callback(null, filepath)
    }
})
const upload = multer({ storage: storage })

router.post('/service/add-service', upload.single('file'), async (req, res) => {
    var filepathNew = path.join(__dirname, `../public/img/${filepath}`);
    var services = await sequelize.query(`select * from Service`);
    var idLast = services[0][services[0].length - 1].IDService;
    var idNew = idLast + 1;
    uploadFile(filepathNew, mineType, name);
    const body = req.body;
    var price = body.price_service.split('$')[1];
    var arrEmployee = body.arrEmployee.split(',');
    let addService = await sequelize.query(`INSERT INTO [dbo].[Service]
        ([IDService]
        ,[NameService]
        ,[Description]
        ,[PathImg]
        ,[TypeService]
        ,[ListPrice]
        ,[Status])
    VALUES
        (${idNew},
        N'${body.name_service}',
        N'${body.description_service}',
        'http://localhost:3000/img/${filepath}',
        ${body.category_name},
        ${price},N'Hoạt Động'
            )`)
    var sql = '';
    var isDone = false;
    arrEmployee.forEach((employee, index) => {
        if (index == 0) {
            sql = `INSERT INTO Staff_Service (IDStaff,IDService) VALUES('${employee}',${idNew})`
        }
        else {
            sql += `,('${employee}',${idNew})`
        }
        if (index == arrEmployee.length - 1) {
            isDone = true;
        }
    })

    if (isDone) {
        let createStaff_Service = await sequelize.query(sql);
        let updateAmount = await sequelize.query(`update TypeService SET AmountService = (SELECT Count(IDService) FROM Service WHERE TypeService = IDTypeS)`)
    }
    res.redirect('back');
})
router.post('/service/edit-service-without-img', async (req, res) => {
    const body = req.body;
    var price = body.price_service.split('$')[1];
    var arrEmployee = body.arrEmployee.split(',');
    let editService = await sequelize.query(`UPDATE [dbo].[Service]
        SET 
           [NameService] = N'${body.name_service}'
           ,[Description] = N'${body.description_service}'
           ,[TypeService] = ${body.category_name}
           ,[ListPrice] = ${price}
      WHERE IDService = ${body.idServiceNew}`)
    var sql = '';
    var isDone = false;
    let deleteStaffService_old = await sequelize.query(` delete Staff_Service WHERE IDService = ${body.idServiceNew} `)
    arrEmployee.forEach((employee, index) => {
        if (index == 0) {
            sql = `INSERT INTO Staff_Service (IDStaff,IDService) VALUES('${employee}',${body.idServiceNew})`
        }
        else {
            sql += `,('${employee}',${body.idServiceNew})`
        }
        if (index == arrEmployee.length - 1) {
            isDone = true;
        }
    })

    if (isDone) {
        let createStaff_Service = await sequelize.query(sql);
        let updateAmount = await sequelize.query(`update TypeService SET AmountService = (SELECT Count(IDService) FROM Service WHERE TypeService = IDTypeS)`)
    }
    res.redirect('back');
})
router.post('/service/edit-service', upload.single('file'), async (req, res) => {
    var filepathNew = path.join(__dirname, `../public/img/${filepath}`)
    uploadFile(filepathNew, mineType, name);
    const body = req.body;
    let getPathImg = await sequelize.query(`select PathImg FROM Service WHERE IDService = ${body.idServiceNew} `);
    let fileImgOld = getPathImg[0][0].PathImg.split('/');
    let filePathImgOld = path.join(__dirname, `../public/img/${fileImgOld[4]}`);
    fs.unlink(filePathImgOld, (err) => err);
    var price = body.price_service.split('$')[1];
    var arrEmployee = body.arrEmployee.split(',');
    let editService = await sequelize.query(`UPDATE [dbo].[Service]
    SET 
       [NameService] = N'${body.name_service}'
       ,[Description] = N'${body.description_service}'
       ,[PathImg] = 'http://localhost:3000/img/${filepath}'
       ,[TypeService] = ${body.category_name}
       ,[ListPrice] = ${price}
  WHERE IDService = ${body.idServiceNew}`)
    var sql = '';
    var isDone = false;
    let deleteStaffService_old = await sequelize.query(` delete Staff_Service WHERE IDService = ${body.idServiceNew} `)
    arrEmployee.forEach((employee, index) => {
        if (index == 0) {
            sql = `INSERT INTO Staff_Service (IDStaff,IDService) VALUES('${employee}',${body.idServiceNew})`
        }
        else {
            sql += `,('${employee}',${body.idServiceNew})`
        }
        if (index == arrEmployee.length - 1) {
            isDone = true;
        }
    })

    if (isDone) {
        let updateAmount = await sequelize.query(`update TypeService SET AmountService = (SELECT Count(IDService) FROM Service WHERE TypeService = IDTypeS)`)
        let createStaff_Service = await sequelize.query(sql);
    }
    res.redirect('back');
})
router.post('/employee/add-employee', upload.single('file'), async (req, res) => {
    const body = req.body;
    var filepathNew = path.join(__dirname, `../public/img/${filepath}`)
    let getIdStaffNew = await sequelize.query(`select IDNewStaff from IDNewStaff `);
    let idStaffNew = getIdStaffNew[0][0].IDNewStaff;
    var isDone = false;
    let insertStaff = await sequelize.query(`INSERT INTO Staff
    ([IDStaff]
    ,[SurName]
    ,[NameStaff]
    ,[Gender]
    ,[Phone]
    ,[Email]
    ,[CCCD]
    ,[IDStore]
    ,[Status]
    ,[PathImgStaff]
    ,[IDManager]
    ,[TypeStaff])
    VALUES (
        '${idStaffNew}',
        N'${body.surname}',
        N'${body.name_employee}',
        N'${body.sex}',
        '${body.phone}',
        '${body.email}',
        '${body.cccd}',
        ${body.store_id},
        N'Hoạt Động',
        'http://localhost:3000/img/${filepath}',
        '${body.manager_name}',
        ${body.type_staff}
    )
    `)
    if (req.body.arrServices.length > 0 && insertStaff.length > 0) {
        let idNew = idStaffNew.split('NV');
        let deleteLastStaff = await sequelize.query(`DELETE IDNewStaff`)
        let updateIdStaffNew = await sequelize.query(`INSERT INTO IDNewStaff(IDLastStaff,IDNewStaff) VALUES('${idStaffNew}','NV${parseInt(idNew[1]) + 1}')`)
        var arrIdServices = body.arrServices.split(',');
        var sql = ''
        arrIdServices.forEach((item, index) => {
            if (index == 0) {
                sql = `INSERT INTO Staff_Service (IDStaff,IDService) VALUES('${idStaffNew}',${item})`
            }
            else {
                sql += `,('${idStaffNew}',${item})`
            }
            if (index == arrIdServices.length - 1) isDone = true;
        })
        if (isDone) await sequelize.query(`${sql}`)
    }

    res.redirect('back');
})
router.post('/employee/edit-employee-without-img', async (req, res) => {
    const body = req.body

    let updateStaff = await sequelize.query(`
    UPDATE [dbo].[Staff]
   SET 
    [SurName] =  N'${body.surname}'
    ,[NameStaff] =N'${body.name_employee}'
    ,[Gender] =  N'${body.sex}'
    ,[Phone] = '${body.phone}'
    ,[Email] = '${body.email}'
    ,[CCCD] = '${body.cccd}'
    ,[IDStore] =  ${body.store_id}
    ,[IDManager] = '${body.manager_name}'
    ,[TypeStaff] = ${body.type_staff}
 WHERE IDStaff = '${body.idStaff}'
    `)
    var isDone = false;
    let deleteStaffService_old = await sequelize.query(` delete Staff_Service WHERE IDStaff = '${body.idStaff}'`)
    if (req.body.arrServices.length > 0 && updateStaff.length > 0) {
        var arrIdServices = body.arrServices.split(',');
        var sql = ''
        arrIdServices.forEach((item, index) => {
            if (index == 0) {
                sql = `INSERT INTO Staff_Service (IDStaff,IDService) VALUES('${body.idStaff}',${item})`
            }
            else {
                sql += `,('${body.idStaff}',${item})`
            }
            if (index == arrIdServices.length - 1) isDone = true;
        })
        if (isDone) await sequelize.query(`${sql}`)
    }
    res.redirect('back');
})
router.post('/employee/edit-employee-withimg', upload.single('file'), async (req, res) => {
    const body = req.body
    var filepathNew = path.join(__dirname, `../public/img/${filepath}`)
    let getPathImg = await sequelize.query(`select PathImgStaff FROM Staff WHERE IDStaff = '${body.idStaff}' `);
    let fileImgOld;
    if (getPathImg[0].length > 0) {
        fileImgOld = getPathImg[0][0].PathImgStaff.split('/');
    }
    let filePathImgOld = path.join(__dirname, `../public/img/${fileImgOld[4]}`);
    fs.unlink(filePathImgOld, (err) => err);
    let updateStaff = await sequelize.query(`
        UPDATE [dbo].[Staff]
       SET 
        [SurName] =  N'${body.surname}'
        ,[NameStaff] =N'${body.name_employee}'
        ,[Gender] =  N'${body.sex}'
        ,[Phone] = '${body.phone}'
        ,[Email] = '${body.email}'
        ,[CCCD] = '${body.cccd}'
        ,[IDStore] =  ${body.store_id}
        ,[IDManager] = '${body.manager_name}'
        ,[TypeStaff] = ${body.type_staff}
        ,[PathImgStaff] = 'http://localhost:3000/img/${filepath}'
     WHERE IDStaff = '${body.idStaff}'
        `)
    var isDone = false;
    let deleteStaffService_old = await sequelize.query(` delete Staff_Service WHERE IDStaff = '${body.idStaff}'`)
    if (req.body.arrServices.length > 0 && updateStaff.length > 0) {
        var arrIdServices = body.arrServices.split(',');
        var sql = ''
        arrIdServices.forEach((item, index) => {
            if (index == 0) {
                sql = `INSERT INTO Staff_Service (IDStaff,IDService) VALUES('${body.idStaff}',${item})`
            }
            else {
                sql += `,('${body.idStaff}',${item})`
            }
            if (index == arrIdServices.length - 1) isDone = true;
        })
        if (isDone) await sequelize.query(`${sql}`)
    }
    res.redirect('back');
})
// booking

router.post('/booking/employeeId', StaffController.getBooking_idEmployee)
router.post('/booking/info-booking', StaffController.getInfoBooking);
router.post('/booking/get-book-date', StaffController.getBooking_Date);
router.post('/booking/get-shift-full', StaffController.getShiftIsFull);
router.post('/booking/get-employee-datetime', StaffController.getEmployee_Date_Time);
router.post('/booking/get-employee-regis-date', StaffController.getEmployeeRegis_Date);
router.post('/booking/check-phone-customer', StaffController.checkPhoneCus_book)
router.post('/booking/add-booking', StaffController.addBooking)
router.post('/booking/getbooking-date-phone', StaffController.checkHaveBooking_Phone_Date);
router.post('/booking/cancel-booking', StaffController.cancelBooking);
router.post('/booking/create-bill', StaffController.createBill)
router.get('/booking', StaffController.mainBooking);


// employee
router.post('/employee/regis-shift', StaffController.regisShift);
router.post('/employee/check-regis-shift', StaffController.checkEmployeeRegis);
router.post('/employee/delete-employee', StaffController.deleteEmployee);
router.post('/employee/info-employee', StaffController.getInfoEmployee);
router.post('/employee/service-employee-id', StaffController.serviceEmployee_id)
router.post('/employee/set-status', StaffController.setStatusEmployee)
router.post('/employee/info-book', StaffController.getInfoBook_Employee)
router.get('/employee', StaffController.employee)
// service
router.post('/service/info-book', StaffController.getInfoBook_service)
router.post('/service/info-employee', StaffController.getInfoEmployee_service);
router.post('/service/delete-service', StaffController.deleteService);
router.post('/service/info-service', StaffController.infoService);
router.post('/service/edit-category', StaffController.editCategory)
router.post('/service/delete-category', StaffController.deleteCategory)
router.post('/service/create-category', StaffController.createCategory)
router.post('/service/employee-service', StaffController.employService)
router.post('/service/employee-service-id', StaffController.employService_id)
router.get('/service', StaffController.service)
// dashboard
router.get('/dashboard-manager', StaffController.dashboard)
// login
router.post('/login', StaffController.login);
router.get('/', StaffController.main);

module.exports = router;