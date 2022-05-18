const { response } = require('express');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../../util/sequelizedb');
const { uploadFile } = require('../../Models/UploadModal')
const path = require('path');
require('dotenv').config();
const fs = require('fs');

class StaffController {
    main(req, res) {
        res.render('staff/login')
    }
    async login(req, res) {
        let login = await sequelize.query(`SELECT * FROM TaiKhoan WHERE Account='${req.body.username}' and Password='${req.body.password}' AND IDRole = 3`, {
            raw: true,
            type: QueryTypes.SELECT,
        })
        let idstore = await sequelize.query(`SELECT IDStore FROM Staff WHERE IDStaff = '${req.body.username}'`)
        if (login.length > 0) {
            res.status(200).json({
                status: 'found',
                idstore: idstore[0][0].IDStore,
            })
        }
        else {
            res.status(200).json({
                status: 'not found'
            })
        }
    }

    dashboard(req, res) {
        res.render('staff/main', {
            idstore: req.query.idStore
        })
    }
    async service(req, res) {
        let updateAmount = await sequelize.query(`update TypeService SET AmountService = (SELECT Count(IDService) FROM Service WHERE TypeService = IDTypeS)`)
        let categories = await sequelize.query(`Select  * from TypeService`);
        let allService = await sequelize.query(`Select sum(AmountService) as Sum from TypeService`);
        let services = await sequelize.query(`Select * from Service WHERE Status = N'Hoạt Động'`);
        let employee = await sequelize.query(`Select * from Staff WHERE TypeStaff = 1 AND Status = N'Hoạt Động'`);
        res.render('staff/service', {
            categories: categories[0],
            lengthCategory: categories[0].length,
            allService: allService[0][0].Sum,
            services: services[0],
            employee: employee[0],
            idstore: req.query.idStore,
        })
    }

    async employService(req, res) {
        let employee_service = await sequelize.query(`select st_s.IDService,PathImgStaff,TypeService from Staff_Service as st_s,Staff as s,Service as sv WHERE st_s.IDStaff = s.IDStaff and sv.IDService = st_s.IDService AND s.Status = N'Hoạt Động'`)
        if (employee_service[0].length > 0) {
            return res.status(200).json({
                status: 'success',
                employee_service: employee_service[0]
            })
        }
        else {
            return res.status(200).json({
                status: 'failed'
            })
        }
    }

    async employService_id(req, res) {
        let employee_service = await sequelize.query(`select IDStaff from Staff_Service where IDService = ${req.body.idService}`)
        if (employee_service[0].length > 0) {
            return res.status(200).json({
                statusE: 'success',
                employee_service: employee_service[0]
            })
        }
        else {
            return res.status(200).json({
                statusE: 'failed'
            })
        }
    }

    async serviceEmployee_id(req, res) {
        let service_employee = await sequelize.query(`select IDService from Staff_Service where IDStaff = '${req.body.idEmployee}'`)
        if (service_employee[0].length > 0) {
            return res.status(200).json({
                statusS: 'success',
                service_employee: service_employee[0]
            })
        } else {
            return res.status(200).json({
                statusS: 'failed',
            })
        }
    }

    async createCategory(req, res) {
        let createCategory = await sequelize.query(`INSERT INTO TypeService(IDTypeS,NameTypeService,Description,AmountService)
        VALUES(${req.body.id},N'${req.body.name}',N'${req.body.desc}',0)
        `, {
            raw: true,
            type: QueryTypes.INSERT
        })
        if (createCategory.length > 0) {
            return res.status(200).json({
                status: 'success',
            })
        }
        else {
            return res.status(200).json({
                status: 'failed',
            })
        }
    }

    async deleteCategory(req, res) {

        let updateType = await sequelize.query(`UPDATE Service SET TypeService = 1 WHERE TypeService = ${req.body.id}`)
        let updateAmount = await sequelize.query(`update TypeService SET AmountService = (SELECT Count(IDService) FROM Service WHERE TypeService = IDTypeS)`)
        let deleteCategory = await sequelize.query(`delete TypeService where IDTypeS = ${req.body.id}`)
        if (deleteCategory.length > 0) {
            return res.status(200).json({
                status: 'success',
            })
        }
        else {
            return res.status(200).json({
                status: 'failed',
            })
        }
    }

    async editCategory(req, res) {
        let editCategory = await sequelize.query(`UPDATE TypeService SET NameTypeService = N'${req.body.name}' , Description = N'${req.body.description}' WHERE IDTypeS = ${req.body.id}`)
        return res.status(200).json({
            status: 'success',
        })
    }

    async infoService(req, res) {
        let infoService = await sequelize.query(`select * from Service where IDService = ${req.body.idService}`)
        return res.status(200).json({
            status: 'success',
            infoService: infoService[0],
        })
    }

    async deleteService(req, res) {
        const id = req.body.idService;
        let getPathImg = await sequelize.query(`select PathImg FROM Service WHERE IDService = ${id} `);
        let fileImgOld = getPathImg[0][0].PathImg.split('/');
        let filePathImgOld = path.join(__dirname, `../../../public/img/${fileImgOld[4]}`);
        fs.unlink(filePathImgOld, (err) => err);
        let deleteStaff_Service = await sequelize.query(`delete Staff_Service WHERE IDService = ${id}`)
        let updateAmount = await sequelize.query(`update TypeService SET AmountService = (SELECT Count(IDService) FROM Service WHERE TypeService = IDTypeS)`)
        let deleteBookItem = await sequelize.query(`DELETE BookItem WHERE IDService = ${id}`)
        let deleteService = await sequelize.query(`delete service where IDService = ${id}`)
        let updatePaymentBook = await sequelize.query(`UPDATE Book SET Payment = (SELECT Sum(Price) FROM BookItem) WHERE StatusBook = N'Đã đặt lịch'`)
        return res.status(200).json({
            status: 'success',
        })
    }
    async getInfoEmployee_service(req, res) {
        let info = await sequelize.query(`select SurName,NameStaff,PathImgStaff from Staff_Service as st_s,Staff as s,Service as sv WHERE st_s.IDStaff = s.IDStaff and sv.IDService = st_s.IDService and st_s.IDService = ${req.body.idService} AND s.Status = N'Hoạt Động' `)
        return res.status(200).json({
            status: 'success',
            info: info[0],
        })
    }

    async getInfoBook_service(req, res) {
        let infoBookFuture = await sequelize.query(`select IDService FROM BookItem as bi,Book as b WHERE IDService = ${req.body.idService} AND b.DateBook = bi.DateBook AND b.IDShiftBook = bi.IDShiftBook AND b.StatusBook = N'Đã đặt lịch'`);
        let infoBookDone = await sequelize.query(`select IDService FROM BookItem as bi,Book as b WHERE IDService = ${req.body.idService} AND b.DateBook = bi.DateBook AND b.IDShiftBook = bi.IDShiftBook AND b.Status = N'Đã thanh toán'`);
        return res.status(200).json({
            status: 'success',
            infoBookFuture: infoBookFuture[0],
            infoBookDone: infoBookDone[0],
        })
    }

    async getInfoBook_Employee(req, res) {
        let infoBookFuture = await sequelize.query(`select IDStaff FROM Book WHERE IDStaff = '${req.body.idEmployee}' AND StatusBook = N'Đã đặt lịch'`);
        let infoBookDone = await sequelize.query(`select IDStaff FROM Book WHERE IDStaff = '${req.body.idEmployee}' AND Status = N'Đã thanh toán'`);
        return res.status(200).json({
            status: 'success',
            infoBookFuture: infoBookFuture[0],
            infoBookDone: infoBookDone[0],
        })
    }

    async employee(req, res) {
        let employee = await sequelize.query(`select * from Staff WHERE IDStore = ${req.query.idStore}`)
        let store = await sequelize.query(`select * from Store`)
        let managers = await sequelize.query(`select * from Staff where IDManager = IDStaff`)
        let services = await sequelize.query(`select * from Service WHERE Status = N'Hoạt Động'`)
        let typeEmployee = await sequelize.query(`select * from TypeStaff`);
        var lengthEmployee = employee[0].length;
        let employeesIsActive = await sequelize.query(`select * from Staff WHERE Status = N'Hoạt Động' AND TypeStaff = 1`)
        res.render('staff/employee', {
            employee: employee[0],
            lengthEmployee,
            store: store[0],
            managers: managers[0],
            services: services[0],
            typeEmployee: typeEmployee[0],
            employeesIsActive: employeesIsActive[0],
            idstore: req.query.idStore,
        });
    }

    async getInfoEmployee(req, res) {
        let employee = await sequelize.query(`select * from Staff WHERE IDStaff = '${req.body.idEmployee}'`)
        return res.status(200).json({
            status: 'success',
            employee: employee[0],
        })
    }


    async deleteEmployee(req, res) {
        const id = req.body.idEmployee;
        let getPathImg = await sequelize.query(`select PathImgStaff FROM Staff WHERE IDStaff = '${id}' `);
        let fileImgOld = getPathImg[0][0].PathImgStaff.split('/');
        let filePathImgOld = path.join(__dirname, `../../../public/img/${fileImgOld[4]}`);
        fs.unlink(filePathImgOld, (err) => err);
        let deleteStaff_Service = await sequelize.query(`delete Staff_Service WHERE IDStaff = '${id}'`)
        let deleteBookItem = await sequelize.query(`delete BookItem WHERE IDStaff = '${id}'`)
        let deleteBook = await sequelize.query(`delete Book WHERE IDStaff = '${id}'`)
        let deleteRegis = await sequelize.query(`delete RegisShift WHERE IDStaff = '${id}'`)
        let deleteEmployee = await sequelize.query(`delete Staff WHERE IDStaff = '${id}'`)
        return res.status(200).json({
            status: 'success',
        })
    }

    async setStatusEmployee(req, res) {
        let setStatus = await sequelize.query(`UPDATE Staff SET Status = N'${req.body.status}' WHERE IDStaff = '${req.body.idEmployee}'`)
        return res.status(200).json({
            status: 'success',
        })
    }

    async regisShift(req, res) {
        var arrDate = req.body.arrDate;
        var arrEmployee = req.body.arrEmployee;
        var sql = ``;
        var isDone = false;
        var countLoop = 0;
        arrDate.forEach((date, index) => {
            if (index == 0) {
                sql = `
        INSERT INTO [dbo].[RegisShift]
                   ([DateRegis]
                   ,[IDStaff]
                   ,[IDDayOfWeek]
                   ,[IDStore]
                   )`;
            }
            countLoop++;
            arrEmployee.forEach((employee, index1) => {
                var d = new Date(`${date}`)
                if (countLoop == 1) {
                    sql += `VALUES ('${date}','${employee}',${d.getDay()},${req.body.idStore})`
                    countLoop = 2;
                } else {
                    sql += `,('${date}','${employee}',${d.getDay()},${req.body.idStore})`
                }
            })

            if (index == arrDate.length - 1) {
                isDone = true;
            }
        })

        if (isDone) {
            await sequelize.query(`${sql}`);
            // console.log(sql)
        }


        return res.status(200).json({
            status: 'success',
        })
    }

    async checkEmployeeRegis(req, res) {
        var arrDate = req.body.arrDate;
        var arrEmployee = req.body.arrEmployee;
        var sql = ``;
        var isDone = false;
        var countLoop = 0;
        arrDate.forEach((date, index) => {
            if (index == 0) {
                sql = `
        SELECT DateRegis FROM RegisShift WHERE `;
            }
            countLoop++;
            arrEmployee.forEach((employee, index1) => {
                var d = new Date(`${date}`)
                if (countLoop == 1) {
                    sql += `IDStaff = '${employee}' AND DateRegis = '${date}'`
                    countLoop = 2;
                } else {
                    sql += `OR IDStaff = '${employee}' AND DateRegis = '${date}'`
                }
            })

            if (index == arrDate.length - 1) {
                isDone = true;
            }
        })

        if (isDone) {
            let checkEmployeeRegis = await sequelize.query(sql);
            if (checkEmployeeRegis[0].length > 0) {
                return res.status(200).json({
                    status_haveEmployee: 'have',
                })
            }
            else {
                return res.status(200).json({
                    status_haveEmployee: 'not-have',
                })
            }

        }




    }
    async mainBooking(req, res) {
        let employees = await sequelize.query(`SELECT * FROM Staff WHERE IDStore = ${req.query.idStore} AND Status = N'Hoạt Động' AND TypeStaff = 1`);
        let bookings = await sequelize.query(`SELECT * FROM Book as b, Shift as s WHERE IDStore =  ${req.query.idStore} AND StatusBook = N'Đã đặt lịch' AND b.IDShiftBook = s.IDShift`)
        let bookingJs = JSON.stringify(bookings[0]);
        let services = await sequelize.query(`SELECT * FROM Service WHERE Status = N'Hoạt Động'`)
        let shift = await sequelize.query(`SELECT * FROM Shift`)
        res.render('staff/booking', {
            employees: employees[0],
            lengthEmployee: employees[0].length,
            idstore: req.query.idStore,
            lengthBooks: bookings[0].length,
            bookingJs: bookingJs,
            services: services[0],
            shift: shift[0],
        })
    }
    async getInfoBooking(req, res) {
        const phone = req.body.phone;
        const date = req.body.dateBook;
        let booking = await sequelize.query(`
        SELECT * FROM Book as b,BookItem as bi,Staff as s,Service as sv WHERE b.DateBook = '${date}' AND b.PhoneCustomer = '${phone}' AND b.DateBook = bi.DateBook AND b.IDShiftBook = bi.IDShiftBook
        AND s.IDStaff = b.IDStaff AND sv.IDService = bi.IDService`)
        let customer = await sequelize.query(`SELECT * FROM Customer WHERE PhoneCustomer = '${phone}'`)
        return res.status(200).json({
            status: 'success',
            booking: booking[0],
            customer: customer[0],
        })
    }

    async getBooking_idEmployee(req, res) {
        const id = req.body.idEmployee
        let bookings = await sequelize.query(`SELECT * FROM Book as b ,Shift as s WHERE IDStaff = '${id}' AND b.IDShiftBook = s.IDShift`)

        return res.status(200).json({
            status: 'success',
            bookings: bookings[0],
            lengthBook: bookings[0].length,
        })
    }
    async getBooking_Date(req, res) {
        let date = req.body.date;

        return res.status(200).json({
            status: 'success',
        })
    }

    async getShiftIsFull(req, res) {
        let countDateRegis = await sequelize.query(`SELECT Count(DateRegis) as count FROM RegisShift WHERE DateRegis = '${req.body.date}'`);
        let countDateBook = await sequelize.query(`SELECT Count(DateBook) as count,IDShiftBook FROM Book  WHERE DateBook = '${req.body.date}' GROUP BY IDShiftBook`)
        let count1 = countDateRegis[0][0].count;
        let countArr = countDateBook[0];
        let arrIdShift = [];
        if (countArr.length == 0) {
            return res.status(200).json({
                status: 'success',
                shift: 'not have shift full',
                arrIdShift,
            })
        }
        else {
            var isDone = false;
            countArr.forEach((item, index) => {
                if (item.count == count1) {
                    arrIdShift.push(item.IDShiftBook)
                }
                if (index == countArr.length - 1) {
                    isDone = true;
                }
            })
            if (isDone) {
                if (arrIdShift.length == 0) {
                    return res.status(200).json({
                        status: 'success',
                        shift: 'not have shift full',
                        arrIdShift,
                    })
                } else {
                    return res.status(200).json({
                        status: 'success',
                        shift: 'have shift full',
                        arrIdShift,
                    })
                }
            }
        }
    }
}


module.exports = new StaffController;