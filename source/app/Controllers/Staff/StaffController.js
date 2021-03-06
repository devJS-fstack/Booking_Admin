const { response } = require('express');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../../util/sequelizedb');
const { uploadFile } = require('../../Models/UploadModal')
const path = require('path');
const easyinvoice = require('easyinvoice');
require('dotenv').config();
const fs = require('fs');
const nodemailer = require("nodemailer");
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');

class StaffController {
    main(req, res) {
        res.render('staff/login')
    }

    pageErr(req, res) {
        res.render('staff/page404')
    }
    async login(req, res) {
        // const salt = await bcrypt.genSalt(10);
        // const hashPassword = await bcrypt.hash('SuperAdmin', salt);
        // console.log(hashPassword)
        let login = await sequelize.query(`SELECT * FROM TaiKhoan INNER JOIN Staff ON Account='${req.body.username}' AND TaiKhoan.Account = Staff.IDStaff 
        AND (IDRole = 3 OR IDRole = 4) AND TaiKhoan.Status = 'Active'`, {
            raw: true,
            type: QueryTypes.SELECT,
        })
        if (login.length > 0) {
            const result = await bcrypt.compare(req.body.password, login[0].Password);
            if (result == true) {
                const encodedToken = () => {
                    return JWT.sign({
                        accountId: login[0].Account,
                        nameEmployee: `${login[0].SurName} ${login[0].NameStaff}`,
                        pathImg: login[0].PathImgStaff,
                        idstore: login[0].IDStore,
                        role: login[0].IDRole,
                        iat: new Date().getTime(),
                        exp: new Date().setDate(new Date().getDate() + 3)
                    }, process.env.SECRET_KEY_ACCESS_TOKEN);
                }
                const token = encodedToken();
                res.status(200).json({
                    status: 'found',
                    idstore: login[0].IDStore,
                    token: token
                })
            }
            else {
                res.status(200).json({
                    status: 'not found'
                })
            }
        } else {
            res.status(200).json({
                status: 'not found'
            })
        }
    }

    async checkToken(req, res) {
        JWT.verify(req.body.accessToken, process.env.SECRET_KEY_ACCESS_TOKEN, async (err, user) => {
            if (err) {
                return res.status(200).json({
                    status: 'Does not token real',
                })
            }
            else {
                const employee = await sequelize.query(`SELECT * FROM Staff WHERE IDStaff = '${user.accountId}'`)
                return res.status(200).json({
                    status: 'success',
                    idEmployee: user.accountId,
                    idstore: user.idstore,
                    employee: employee[0][0],
                    role: user.role,
                })
            }
        })
    }

    async checkExistEmail(req, res) {
        const checkExist = await sequelize.query(`SELECT * FROM Staff WHERE Email = '${req.body.email}'`)
        if (checkExist[0].length > 0) {
            return res.status(200).json({
                status: 'exist'
            })
        } else {
            return res.status(200).json({
                status: 'not exist'
            })
        }
    }

    async checkExistEmail_edit(req, res) {
        const checkExist = await sequelize.query(`SELECT * FROM Staff WHERE Email = '${req.body.emailNew}' AND NOT Email = '${req.body.emailOld}'`)
        if (checkExist[0].length > 0) {
            return res.status(200).json({
                status: 'exist'
            })
        } else {
            return res.status(200).json({
                status: 'not exist'
            })
        }
    }

    async checkExistPhone_edit(req, res) {
        const checkExist = await sequelize.query(`SELECT * FROM Staff WHERE Phone = '${req.body.phoneNew}' AND NOT Phone = '${req.body.phoneOld}'`)
        if (checkExist[0].length > 0) {
            return res.status(200).json({
                status: 'exist'
            })
        } else {
            return res.status(200).json({
                status: 'not exist'
            })
        }
    }

    async checkExistPhone(req, res) {
        const checkExist = await sequelize.query(`SELECT * FROM Staff WHERE Phone = '${req.body.phone}'`)
        if (checkExist[0].length > 0) {
            return res.status(200).json({
                status: 'exist'
            })
        } else {
            return res.status(200).json({
                status: 'not exist'
            })
        }
    }

    async sendEmailVerify(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        let transporter = nodemailer.createTransport({
            type: 'SMTP',
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_ACCOUNT_AUTHOR,
                pass: process.env.EMAIL_PASSWORD_AUTHOR,
            },
        })
        let minutesToAdd = 30;
        let currentDate = new Date();
        let futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
        const encodedToken = () => {
            return JWT.sign({
                email: email,
                password: hashPassword,
                iat: new Date().getTime(),
                exp: futureDate.getTime(),
            }, process.env.SECRET_KEY_ACCESS_TOKEN);
        }
        const token = encodedToken();
        res.status(200).json({
            status: 'success',
        })

        let info = await transporter.sendMail({
            from: 'vantinhnguyen728@gmail.com', // sender address
            to: `${email}`, // list of receivers
            subject: "X??c th???c ?????t l???i t??i kho???n qu???n l?? TheBaberShop", // Subject line
            text: "Ch??o anh, ????y l?? m???t kh???u m???i c???a anh. Anh vui l??ng kh??ng ????? l???, d??ng t??i kho???n ?????t l???ch online s??? c?? nhi???u ??u ????i h???p d???n ", // plain text body
            html: `<p>Ch??o anh, ????y l?? link ????? x??c th???c ?????t l???i m???t kh???u cho email n??y. Anh vui l??ng kh??ng ????? l???</p>
            <h1 style="display:flex">http://localhost:3000/login/verify-email/?accessToken=${token}</h1>`,
        }).catch(err => { console.log(err) })
    }

    async verifyEmail(req, res) {

        JWT.verify(req.query.accessToken, process.env.SECRET_KEY_ACCESS_TOKEN, async (err, user) => {
            if (err) {
                res.redirect('/page-err')
            }
            else {
                const email = user.email;
                const password = user.password;
                const exp = user.exp;
                let date = new Date();
                if (date.getTime() < exp) {
                    let sql = `UPDATE TaiKhoan  SET Password = '${password}' 
                FROM TaiKhoan as t,Staff as s 
                WHERE t.Account = s.IDStaff and s.Email = '${email}'`
                    await sequelize.query(sql);
                    let user = await sequelize.query(`SELECT * FROM TaiKhoan,Staff WHERE Account = IDStaff and Email = '${email}'`)

                    const encodedToken = () => {
                        return JWT.sign({
                            accountId: user[0][0].Account,
                            nameEmployee: `${user[0][0].SurName} ${user[0][0].NameStaff}`,
                            pathImg: user[0][0].PathImgStaff,
                            idstore: user[0][0].IDStore,
                            role: user[0][0].IDRole,
                            iat: new Date().getTime(),
                            exp: new Date().setDate(new Date().getDate() + 3)
                        }, process.env.SECRET_KEY_ACCESS_TOKEN);
                    }
                    const token = encodedToken();
                    res.redirect(`/?accessToken=${token}`)
                } else {
                    res.redirect('/page-err')
                }
            }
        })


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
        let services = await sequelize.query(`Select * from Service WHERE Status = N'Ho???t ?????ng'`);
        let employee = await sequelize.query(`Select * from Staff WHERE TypeStaff = 1 AND Status = N'Ho???t ?????ng' AND IDStore = ${req.query.idStore}`);
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
        let employee_service = await sequelize.query(`select st_s.IDService,PathImgStaff,TypeService 
        from Staff_Service as st_s,Staff as s,Service as sv WHERE st_s.IDStaff = s.IDStaff
         and sv.IDService = st_s.IDService AND s.Status = N'Ho???t ?????ng' AND s.IDStore = ${req.body.idStore}`)
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
        let employee_service = await sequelize.query(`select sv.IDStaff from Staff_Service as sv,Staff as s
         where IDService = ${req.body.idService} AND s.IDStaff = sv.IDStaff AND s.IDStore = ${req.body.idStore}`)
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

    async infoCategory(req, res) {
        let info = await sequelize.query(`select * FROM TypeService WHERE IDTypeS = ${req.body.idType}`);
        return res.status(200).json({
            status: 'success',
            info: info[0][0],
        })
    }

    async createCategory(req, res) {
        let idNew = await sequelize.query(`select Max(IDTypeS) as max FROM TypeService`)
        let createCategory = await sequelize.query(`INSERT INTO TypeService(IDTypeS,NameTypeService,Description,AmountService)
        VALUES(${idNew[0][0].max + 1},N'${req.body.name}',N'${req.body.desc}',0)
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
        const getPathImg = await sequelize.query(`select PathImg FROM Service WHERE IDService = ${id} `);
        let fileImgOld = getPathImg[0][0].PathImg.split('/');
        let filePathImgOld = path.join(__dirname, `../../../public/img/${fileImgOld[4]}`);
        fs.unlink(filePathImgOld, (err) => err);
        let deleteStaff_Service = await sequelize.query(`delete Staff_Service WHERE IDService = ${id}`)
        let updateAmount = await sequelize.query(`update TypeService SET AmountService = (SELECT Count(IDService) FROM Service WHERE TypeService = IDTypeS)`)
        let deleteBookItem = await sequelize.query(`DELETE BookItem WHERE IDService = ${id}`)
        let deleteService = await sequelize.query(`delete service where IDService = ${id}`)
        let updatePaymentBook = await sequelize.query(`UPDATE Book SET Payment = (SELECT Sum(Price) FROM BookItem) WHERE StatusBook = N'???? ?????t l???ch'`)
        return res.status(200).json({
            status: 'success',
        })
    }
    async getInfoEmployee_service(req, res) {
        let info = await sequelize.query(`select SurName,NameStaff,PathImgStaff
         from Staff_Service as st_s,Staff as s,Service as sv
          WHERE st_s.IDStaff = s.IDStaff and sv.IDService = st_s.IDService 
          and st_s.IDService = ${req.body.idService} AND s.Status = N'Ho???t ?????ng'
          and s.IDStore = ${req.body.idStore} `)
        return res.status(200).json({
            status: 'success',
            info: info[0],
        })
    }

    async getInfoBook_service(req, res) {
        let infoBookFuture = await sequelize.query(`select IDService FROM BookItem as bi,Book as b WHERE IDService = ${req.body.idService} AND b.DateBook = bi.DateBook AND b.IDShiftBook = bi.IDShiftBook AND b.StatusBook = N'???? ?????t l???ch'`);
        let infoBookDone = await sequelize.query(`select IDService FROM BookItem as bi,Book as b WHERE IDService = ${req.body.idService} AND b.DateBook = bi.DateBook AND b.IDShiftBook = bi.IDShiftBook AND b.StatusBook = N'???? ho??n t???t'`);
        return res.status(200).json({
            status: 'success',
            infoBookFuture: infoBookFuture[0],
            infoBookDone: infoBookDone[0],
        })
    }

    async getInfoBook_Employee(req, res) {
        let infoBookFuture = await sequelize.query(`select IDStaff FROM Book WHERE IDStaff = '${req.body.idEmployee}' AND StatusBook = N'???? ?????t l???ch'`);
        let infoBookDone = await sequelize.query(`select IDStaff FROM Book WHERE IDStaff = '${req.body.idEmployee}' AND StatusBook = N'???? ho??n t???t'`);
        return res.status(200).json({
            status: 'success',
            infoBookFuture: infoBookFuture[0],
            infoBookDone: infoBookDone[0],
        })
    }

    async employee(req, res) {
        let employee = await sequelize.query(`select * from Staff WHERE IDStore = ${req.query.idStore}`)
        let store = await sequelize.query(`select * from Store`)
        let managers = await sequelize.query(`select * from Staff where (TypeStaff = 3 AND IDStore = ${req.query.idStore}) OR TypeStaff = 4`)
        let services = await sequelize.query(`select * from Service WHERE Status = N'Ho???t ?????ng'`)
        let typeEmployee = await sequelize.query(`select * from TypeStaff `);
        let lengthEmployee = await sequelize.query(`select Count(IDStaff) as count FROM Staff WHERE IDStore = ${req.query.idStore} AND NOT (TypeStaff = 3 OR TypeStaff = 4) `)
        let employeesIsActive = await sequelize.query(`select * from Staff WHERE Status = N'Ho???t ?????ng' AND TypeStaff = 1`)
        res.render('staff/employee', {
            employee: employee[0],
            store: store[0],
            managers: managers[0],
            services: services[0],
            typeEmployee: typeEmployee[0],
            employeesIsActive: employeesIsActive[0],
            idstore: req.query.idStore,
            lengthEmployee: lengthEmployee[0][0].count,
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
        let deleteAccount = await sequelize.query(`delete TaiKhoan WHERE Account = '${id}'`)
        let deleteBill = await sequelize.query(`delete Bill WHERE IDStaff = '${id}'`)
        let deleteBill_Salary = await sequelize.query(`delete BillSalary WHERE Staff = '${id}'`)
        return res.status(200).json({
            status: 'success',
        })
    }

    async setStatusEmployee(req, res) {
        let setStatus = await sequelize.query(`UPDATE Staff SET Status = N'${req.body.status}' 
        WHERE IDStaff = '${req.body.idEmployee}'`)
        let setStatus_account = await sequelize.query(`UPDATE TaiKhoan SET Status = '${req.body.status_account}' 
        WHERE Account = '${req.body.idEmployee}' `)
        return res.status(200).json({
            status: 'success',
        })
    }

    async setStatusCustomer(req, res) {
        let setStatus = await sequelize.query(`UPDATE TaiKhoan SET Status = N'${req.body.status}' 
        WHERE Account = '${req.body.account}'`)
    }

    async regisShift(req, res) {
        let arrDate = req.body.arrDate;
        let arrEmployee = req.body.arrEmployee;
        let sql = ``;
        let isDone = false;
        let countLoop = 0;
        arrDate.forEach((date, index) => {
            if (index == 0) {
                sql = `
        INSERT INTO[dbo].[RegisShift]
            ([DateRegis]
                , [IDStaff]
                , [IDDayOfWeek]
                , [IDStore]
                , [StatusRegis]
            )`;
            }
            countLoop++;
            arrEmployee.forEach((employee, index1) => {
                let d = new Date(`${date}`)
                if (countLoop == 1) {
                    sql += `VALUES('${date}', '${employee}', ${d.getDay()}, ${req.body.idStore},N'???? ????ng k??')`
                    countLoop = 2;
                } else {
                    sql += `, ('${date}', '${employee}', ${d.getDay()}, ${req.body.idStore},N'???? ????ng k??')`
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
        let arrDate = req.body.arrDate;
        let arrEmployee = req.body.arrEmployee;
        let sql = ``;
        let isDone = false;
        let countLoop = 0;
        arrDate.forEach((date, index) => {
            if (index == 0) {
                sql = `
        SELECT DateRegis FROM RegisShift WHERE `;
            }
            countLoop++;
            arrEmployee.forEach((employee, index1) => {
                let d = new Date(`${date} `)
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
        let employees = await sequelize.query(`SELECT * FROM Staff WHERE IDStore = ${req.query.idStore} AND Status = N'Ho???t ?????ng' AND TypeStaff = 1`);
        let bookings = await sequelize.query(`SELECT * FROM Book as b, Shift as s WHERE IDStore = ${req.query.idStore} AND b.IDShiftBook = s.IDShift`)
        let bookingJs = JSON.stringify(bookings[0]);
        let services = await sequelize.query(`SELECT * FROM Service WHERE Status = N'Ho???t ?????ng'`)
        let shift = await sequelize.query(`SELECT * FROM Shift`)
        let store = await sequelize.query(`SELECT * FROM Store WHERE IDStore = ${req.query.idStore} `)
        let storeJs = JSON.stringify(store[0])
        res.render('staff/booking', {
            employees: employees[0],
            lengthEmployee: employees[0].length,
            idstore: req.query.idStore,
            lengthBooks: bookings[0].length,
            bookingJs: bookingJs,
            services: services[0],
            shift: shift[0],
            storeJs: storeJs,
        })
    }
    async getInfoBooking(req, res) {
        const phone = req.body.phone;
        const date = req.body.dateBook;
        let booking = await sequelize.query(`
        SELECT * FROM Book as b, BookItem as bi, Staff as s, Service as sv WHERE b.DateBook = '${date}' AND b.PhoneCustomer = '${phone}' AND b.DateBook = bi.DateBook AND b.IDShiftBook = bi.IDShiftBook
        AND s.IDStaff = b.IDStaff AND sv.IDService = bi.IDService AND b.IDStaff = bi.IDStaff 
        AND b.IDShiftBook = (SELECT s.IDShift FROM Shift as s WHERE HourStart = ${req.body.hourStart} AND MinuteStart = ${req.body.minuteStart})`)
        let customer = await sequelize.query(`SELECT * FROM Customer WHERE PhoneCustomer = '${phone}'`)
        return res.status(200).json({
            status: 'success',
            booking: booking[0],
            customer: customer[0],
        })
    }

    async getBooking_idEmployee(req, res) {
        const id = req.body.idEmployee
        let bookings = await sequelize.query(`SELECT * FROM Book as b, Shift as s WHERE IDStaff = '${id}' AND b.IDShiftBook = s.IDShift AND b.StatusBook = N'???? ?????t l???ch'`)

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
        let countDateBook = await sequelize.query(`SELECT Count(DateBook) as count, IDShiftBook FROM Book  WHERE DateBook = '${req.body.date}' GROUP BY IDShiftBook`)
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
            let isDone = false;
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

    async getEmployee_Date_Time(req, res) {
        let employee = await sequelize.query(`SELECT IDStaff FROM Book WHERE DateBook = '${req.body.date}' AND IDShiftBook = ${req.body.shift} `)
        if (employee[0].length > 0) {
            return res.status(200).json({
                status: 'have employee',
                idEmployee: employee[0][0].IDStaff
            })
        }
        else {
            return res.status(200).json({
                status: 'not have employee',
                idEmployee: ''
            })
        }
    }

    async getEmployeeRegis_Date(req, res) {
        let employee = await sequelize.query(`SELECT * FROM RegisShift WHERE DateRegis = '${req.body.date}'`)
        if (employee[0].length > 0) {
            return res.status(200).json({
                status_employee: 'have employee',
                employees: employee[0]
            })
        }
        else {
            return res.status(200).json({
                status_employee: 'not have employee',
                employees: ''
            })
        }
    }

    async checkPhoneCus_book(req, res) {
        let checkPhone = await sequelize.query(`SELECT * FROM Customer WHERE PhoneCustomer = '${req.body.phone}'`);
        if (checkPhone[0].length > 0) {
            return res.status(200).json({
                status: 'found',
            })
        }
        else {
            return res.status(200).json({
                status: 'not found',
            })
        }

    }
    async addBooking(req, res) {
        const body = req.body;
        let insertBooking = await sequelize.query(`INSERT INTO[dbo].[Book]
            ([DateBook]
                , [IDShiftBook]
                , [IDStaff]
                , [PhoneCustomer]
                , [IDStore]
                , [StatusBook]) VALUES
                    ('${body.date}', ${body.shift}, '${body.staff}', '${body.phoneCus}', ${body.store}, N'???? ?????t l???ch')
        `)

        let sql = `INSERT INTO[dbo].[BookItem]
            ([DateBook]
                , [IDShiftBook]
                , [IDService]
                , [IDStaff])`;
        let arrServicesId = body.arrService;
        let isDone = false;
        arrServicesId.forEach((item, index) => {
            if (index == 0) {
                sql += `VALUES('${body.date}', ${body.shift}, ${item}, '${body.staff}')`
            }
            else {
                sql += `, ('${body.date}', ${body.shift},${item}, '${body.staff}')`
            }

            isDone = index == arrServicesId.length - 1 ? true : false;
        })
        if (isDone) {
            let insertBookItem = await sequelize.query(sql);
            let updatePriceBookitem = await sequelize.query(`UPDATE b
                        SET b.Price = s.ListPrice
                        FROM BookItem b
                        INNER JOIN
                        Service s
                        ON b.IDService = s.IDService AND b.DateBook = '${body.date}' AND b.IDShiftBook = ${body.shift} `, {
                raw: true,
                type: QueryTypes.UPDATE,
            })
            let updatePaymentBook = await sequelize.query(`UPDATE Book SET Payment = (SELECT Sum(Price) 
            FROM BookItem WHERE DateBook = '${body.date}' AND IDShiftBook = ${body.shift} AND IDStaff = '${body.staff}') WHERE DateBook = '${body.date}' AND IDShiftBook = ${body.shift} AND IDStaff = '${body.staff}'`)
            return res.status(200).json({
                status: 'success',
            })
        }
    }

    async editBooking(req, res) {
        const body = req.body
        let sql_deleteBookItem = `delete BookItem WHERE DateBook = '${body.dateOld}' AND IDShiftBook = ${body.idShiftOld} AND IDStaff = '${body.idStaffOld}' `
        let sql_updateBook = `UPDATE[dbo].[Book]
        SET[DateBook] = '${body.dateNew}'
            , [IDShiftBook] = ${body.shiftNew}
           , [IDStaff] = '${body.staffNew}'
            , [PhoneCustomer] = '${body.phoneCusNew}'
            , [IDStore] = ${body.store}
           , [StatusBook] = N'???? ?????t l???ch'
      WHERE DateBook = '${body.dateOld}' AND IDShiftBook = ${body.idShiftOld} AND IDStaff = '${body.idStaffOld}'`
        let sql = `INSERT INTO[dbo].[BookItem]
            ([DateBook]
                , [IDShiftBook]
                , [IDService]
                , [IDStaff])`;
        await sequelize.query(sql_deleteBookItem);
        await sequelize.query(sql_updateBook);
        let arrServicesId = body.arrServiceNew;
        let isDone = false;
        arrServicesId.forEach((item, index) => {
            if (index == 0) {
                sql += `VALUES('${body.dateNew}', ${body.shiftNew}, ${item}, '${body.staffNew}')`
            }
            else {
                sql += `, ('${body.dateNew}', ${body.shiftNew},${item}, '${body.staffNew}')`
            }

            isDone = index == arrServicesId.length - 1 ? true : false;
        })
        if (isDone) {
            let insertBookItem = await sequelize.query(sql);
            let updatePriceBookitem = await sequelize.query(`UPDATE b
                      SET b.Price = s.ListPrice
                      FROM BookItem b
                      INNER JOIN
                      Service s
                      ON b.IDService = s.IDService AND b.DateBook = '${body.dateNew}' AND b.IDShiftBook = ${body.shiftNew} `, {
                raw: true,
                type: QueryTypes.UPDATE,
            })
            let updatePaymentBook = await sequelize.query(`UPDATE Book SET Payment = (SELECT Sum(Price) 
          FROM BookItem WHERE DateBook = '${body.dateNew}' AND IDShiftBook = ${body.shiftNew} AND IDStaff = '${body.staffNew}') WHERE DateBook = '${body.dateNew}' AND IDShiftBook = ${body.shiftNew} AND IDStaff = '${body.staffNew}'`)
            return res.status(200).json({
                status: 'success',
            })
        }
    }

    async checkHaveBooking_Phone_Date(req, res) {
        let booking = await sequelize.query(`SELECT * FROM Book WHERE PhoneCustomer = '${req.body.phone}' AND StatusBook = N'???? ?????t l???ch'`)

        if (booking[0].length > 0) {
            return res.status(200).json({
                status: 'found',
                datebook: booking[0][0].DateBook
            })
        }
        else {
            return res.status(200).json({
                status: 'not found',
                datebook: '',
            })
        }
    }

    async cancelBooking(req, res) {
        let book = await sequelize.query(`SELECT * FROM BookItem as bi, Book as b
        WHERE bi.DateBook = b.DateBook AND bi.IDShiftBook = b.IDShiftBook AND b.IDStaff = bi.IDStaff AND b.StatusBook = N'???? ?????t l???ch' AND b.PhoneCustomer = '${req.body.phone}'
            `)
        let deleteBookItem = await sequelize.query(`DELETE BookItem WHERE DateBook = '${book[0][0].DateBook}' AND IDShiftBook = ${book[0][0].IDShiftBook} AND IDStaff = '${book[0][0].IDStaff}'`)

        let deleteBook = await sequelize.query(`DELETE Book WHERE PhoneCustomer = '${req.body.phone}' AND StatusBook = N'???? ?????t l???ch'`)

        return res.status(200).json({
            status: 'success',
        })
    }

    async createBill(req, res) {
        const body = req.body;
        let insertBill = await sequelize.query(`INSERT INTO[dbo].[Bill]
            ([IDBill]
                , [DateCreate]
                , [Status]
                , [Payment]
                , [IDStaff]
                , [PhoneCustomer]
                , [IDStore])
        VALUES('${body.idBill}', '${body.date}', N'???? thanh to??n', ${body.payment}, '${body.idStaff}', '${body.phoneCus}', ${body.idStore})`)

        let updateBook = await sequelize.query(`UPDATE Book SET StatusBook = N'???? ho??n t???t' WHERE DateBook = '${body.date}' AND IDStaff = '${body.idStaff}' AND PhoneCustomer = '${body.phoneCus}' AND StatusBook = N'???? ?????t l???ch'`)
        return res.status(200).json({
            status: 'success',
        })

    }

    // Customer 
    async mainCustomer(req, res) {
        let customers = await sequelize.query(`SELECT c.*,t.Status FROM Customer as c,TaiKhoan as t WHERE t.Account = c.PhoneCustomer`);
        let bookings = await sequelize.query(`SELECT * FROM Book WHERE IDStore = ${req.query.idStore} `);
        let lengthAll = customers[0].length;
        res.render('staff/customer', {
            customers: customers[0],
            bookings: JSON.stringify(bookings[0]),
            idstore: req.query.idStore,
            lengthAll
        })
    }

    async lastBook(req, res) {
        let customers = await sequelize.query(`SELECT * FROM Customer`);
        let arrLastBook = [];
        let isDone = false;
        customers[0].forEach(async (item, index) => {
            let maxDate = await sequelize.query(`SELECT Max(DateBook) as max, PhoneCustomer FROM Book WHERE PhoneCustomer = '${item.PhoneCustomer}'
              AND IDStore = ${req.body.idStore}   GROUP BY PhoneCustomer`)
            if (maxDate[0].length > 0) {
                arrLastBook.push(maxDate[0]);
            }
            if (index == customers[0].length - 1) {
                return res.status(200).json({
                    status: 'success',
                    arrLastBook: arrLastBook,
                })
            };
        })
    }

    async createCustomer(req, res) {
        let phone = req.body.phone;
        let email = req.body.email;
        let name = req.body.name;
        let date = new Date();
        let passwordNew = Math.floor(Math.random() * 999999) + 100000;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passwordNew.toString(), salt);
        let dateInsert = `${date.getFullYear()} -${date.getMonth() + 1} -${date.getDate()} `
        let inserAccount = await sequelize.query(`INSERT INTO TaiKhoan(Account, Password, Status, IDRole)
        VALUES('${phone}', '${hashedPassword}', 'Active', 1)`)
        let insertCustomer = await sequelize.query(`
        INSERT INTO Customer(PhoneCustomer, NameCustomer, EmailCustomer, DateCreate)
        VALUES('${phone}', N'${name}', '${email}', '${dateInsert}')
        `)

        let transporter = nodemailer.createTransport({
            type: 'SMTP',
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_ACCOUNT_AUTHOR,
                pass: process.env.EMAIL_PASSWORD_AUTHOR,
            },
        })
        res.status(200).json({
            status: 'success',
        })
        let info = await transporter.sendMail({
            from: 'vantinhnguyen728@gmail.com', // sender address
            to: `${email} `, // list of receivers
            subject: "M???t kh???u t??i kho???n TheBaberShop", // Subject line
            text: "Ch??o anh, ????y l?? m???t kh???u m???i c???a anh. Anh vui l??ng kh??ng ????? l???, d??ng t??i kho???n ?????t l???ch online s??? c?? nhi???u ??u ????i h???p d???n ", // plain text body
            html: `< p > Ch??o anh, ????y l?? m???t kh???u m???i c???a anh.Anh vui l??ng kh??ng ????? l???, d??ng t??i kho???n ?????t l???ch online s??? c?? nhi???u ??u ????i h???p d???n</p >
            <h1 style="display:flex">T??i kho???n: ${phone}</h1>
            <h1 style="display:flex">M???t kh???u: ${passwordNew}</h1>`, // html body
        }).catch(err => { console.log(err) })
        console.log("Message sent: %s", info.messageId);
    }

    async getInfoCustomer(req, res) {
        let phone = req.body.phone;
        let customer = await sequelize.query(`SELECT * FROM Customer WHERE PhoneCustomer = '${phone}'`)
        return res.status(200).json({
            status: 'success',
            customer: customer[0][0],
        })
    }

    async editCustomer(req, res) {
        let phoneOld = req.body.phoneOld;
        let phone = req.body.phone;
        let email = req.body.email;
        let name = req.body.name;
        let passwordSQL = await sequelize.query(`SELECT * FROM TaiKhoan WHERE Account = '${phoneOld}'`)
        let passwordOld = passwordSQL[0][0].Password;
        let dateCreateSQL = await sequelize.query(`SELECT * FROM Customer WHERE PhoneCustomer = '${phoneOld}'`)
        let dateCreateOld = dateCreateSQL[0][0].DateCreate;
        let sqlDeleteCus = `DELETE Customer WHERE PhoneCustomer = '${phoneOld}'`;
        let sqlDeleteAcc = `DELETE TaiKhoan WHERE Account = '${phoneOld}'`;
        let sqlInsertAcc = `INSERT INTO TaiKhoan(Account, Password, Status, IDRole)
        VALUES('${phone}', '${passwordOld}', 'Active', 1)`
        let sqlInsertCus = `INSERT INTO Customer(PhoneCustomer, NameCustomer, EmailCustomer, DateCreate)
        VALUES('${phone}', N'${name}', '${email}', '${dateCreateOld}')`
        await sequelize.query(sqlDeleteCus);
        await sequelize.query(sqlDeleteAcc);
        await sequelize.query(sqlInsertAcc);
        await sequelize.query(sqlInsertCus);
        return res.status(200).json({
            status: 'success',
        })
    }

    async deleteCustomer(req, res) {
        let phone = req.body.phone
        let sqlDeleteCus = `DELETE Customer WHERE PhoneCustomer = '${phone}'`;
        let sqlDeleteAcc = `DELETE TaiKhoan WHERE Account = '${phone}'`;
        await sequelize.query(sqlDeleteCus);
        await sequelize.query(sqlDeleteAcc);
        return res.status(200).json({
            status: 'success',
        })
    }

    async renderInfoBooked(req, res) {
        let store = req.body.idStore
        let phone = req.body.phone
        let arrBook = await sequelize.query(`select MIN(PhoneCustomer), Count(b.IDStaff) as count, b.IDStaff, s.NameStaff, s.SurName, s.PathImgStaff
        FROM Book as b, Staff as s WHERE PhoneCustomer = '${phone}' 
        AND b.IDStaff = s.IDStaff AND s.IDStore = ${store} GROUP BY b.IDStaff, s.NameStaff, s.SurName, s.PathImgStaff`)
        let arrService = await sequelize.query(`select MIN(PhoneCustomer), Count(bi.IDService) as count, NameService from Book as b, Service as s, BookItem as bi
        WHERE b.DateBook = bi.DateBook
        AND b.IDShiftBook = bi.IDShiftBook AND b.IDStaff = bi.IDStaff AND b.PhoneCustomer = '${phone}'
        AND s.IDService = bi.IDService AND b.IDStore = ${store} 
        GROUP BY bi.IDService, NameService`)
        let payment = await sequelize.query(`select SUM(Payment) as sum FROM Book WHERE PhoneCustomer = '${phone}' AND IDStore = '${store}'`)
        return res.status(200).json({
            status: 'success',
            arrBook: arrBook[0],
            arrService: arrService[0],
            payment: payment[0][0].sum,
        })
    }

    async getCustomer_Revenue_CurrentWeek(req, res) {
        let sql_customer = `select * FROM CUSTOMER WHERE DateCreate between '${req.body.firstDate}' and '${req.body.lastDate}'`
        let sql_revenue = `select Sum(Payment) as sum, DateCreate FROM Bill  WHERE DateCreate between '${req.body.firstDate}' and '${req.body.lastDate}' and IDStore = '${req.body.idStore}'GROUP BY DateCreate`
        let customers = await sequelize.query(sql_customer)
        let revenue = await sequelize.query(sql_revenue)
        let start_end = await sequelize.query(`SELECT Min(DateBook) as min, Max(DateBook) as max FROM Book`)
        return res.status(200).json({
            status: 'success',
            customers: customers[0],
            revenue: revenue[0],
            start_end: start_end[0][0],
        })
    }

    async getBook_Revenue(req, res) {
        let sql = `SELECT Count(DateBook) as count, Sum(Payment) as sum, DateBook FROM Book 
        WHERE DateBook between '${req.body.firstDate}' and '${req.body.lastDate}' and IDStore = ${req.body.idStore} GROUP BY DateBook`
        let sql_bill = `SELECT Count(DateCreate) as count, Sum(Payment) as sum, DateCreate FROM Bill
        WHERE DateCreate between '${req.body.firstDate}' and '${req.body.lastDate}' AND IDStore = ${req.body.idStore} GROUP BY DateCreate`
        let data = await sequelize.query(sql)
        let data_bill = await sequelize.query(sql_bill)
        let count_bookSuccess = await sequelize.query(` SELECT Count(DateBook) as count FROM Book
        WHERE DateBook  between '${req.body.firstDate}' and '${req.body.lastDate}' AND StatusBook = N'???? ho??n t???t' AND IDStore = ${req.body.idStore} `)
        let count_bookPending = await sequelize.query(` SELECT Count(DateBook) as count FROM Book
        WHERE DateBook  between '${req.body.firstDate}' and '${req.body.lastDate}' AND StatusBook = N'???? ?????t l???ch' AND IDStore = ${req.body.idStore} `)
        let arrCountOldCustomer = await sequelize.query(`SELECT Count(PhoneCustomer) as count, DateCreate FROM Customer GROUP BY DateCreate 
        HAVING DateCreate between Min(DateCreate) and '${req.body.dateString_oldCustomer}'`)
        let arrCountNewCustomer = await sequelize.query(`SELECT Count(PhoneCustomer) as count, DateCreate FROM Customer GROUP BY DateCreate 
        HAVING DateCreate between '${req.body.firstDate}' and '${req.body.lastDate}'`)
        return res.status(200).json({
            status_b: 'success',
            data: data[0],
            data_bill: data_bill[0],
            count_bookSuccess: count_bookSuccess[0][0].count,
            count_bookPending: count_bookPending[0][0].count,
            arrCountOldCustomer: arrCountOldCustomer[0],
            arrCountNewCustomer: arrCountNewCustomer[0]
        })
    }

    async CountCustomer(req, res) {
        let arrCountOldCustomer = await sequelize.query(`SELECT Count(PhoneCustomer) as count, DateCreate FROM Customer GROUP BY DateCreate 
        HAVING DateCreate between Min(DateCreate) and '${req.body.dateString_oldCustomer}'`)
        let arrCountNewCustomer = await sequelize.query(`SELECT Count(PhoneCustomer) as count, DateCreate FROM Customer GROUP BY DateCreate 
        HAVING DateCreate between '${req.body.firstDate}' and '${req.body.lastDate}'`)
        return res.status(200).json({
            status_c: 'success',
            arrCountOldCustomer: arrCountOldCustomer[0],
            arrCountNewCustomer: arrCountNewCustomer[0]
        })
    }

    async Pagination(req, res) {
        let bookedArr = await sequelize.query(` select Book.*, HourStart, MinuteStart, PathImgStaff from  Book, Shift, Staff 
        WHERE Book.IDStaff = Staff.IDStaff AND Book.IDShiftBook = Shift.IDShift AND Book.IDStore = ${req.body.idStore} ORDER BY(DateBook) desc`)
        let totalPage = Math.ceil(bookedArr[0].length / 10);
        let page = req.body.page_number;
        return res.status(200).json({
            status: 'success',
            bookedArr: bookedArr[0].slice(10 * (page - 1), 10 * (page)),
            totalPage,
        })
    }

    async getPerformance_Employee(req, res) {
        let sql = `SELECT TOP(3)(b.IDStaff), Count(b.IDStaff) as count, SUM(b.Payment) as sum, PathImgStaff, SurName, NameStaff
        FROM Book as b INNER JOIN Staff
        ON b.DateBook between '${req.body.firstDate}' and '${req.body.lastDate}'
         AND b.IDStore = ${req.body.idStore} AND b.IDStaff = Staff.IDStaff
        GROUP BY b.IDStaff, PathImgStaff, SurName, NameStaff
        order by Sum(b.Payment) desc`
        let sql_total = ` SELECT SUM(Payment) as sum FROM Book WHERE DateBook between '${req.body.firstDate}' and '${req.body.lastDate}' AND IDStore = ${req.body.idStore} `
        let performance_employee = await sequelize.query(sql)
        let total_payment = await sequelize.query(sql_total)
        return res.status(200).json({
            status_p: 'success',
            performance_employee: performance_employee[0],
            total_payment: total_payment[0][0].sum
        })
    }

    async getPerformance_Service(req, res) {
        let sql = `SELECT TOP(3)(bi.IDService), Count(bi.IDService) as count, SUM(bi.Price) as sum, s.PathImg, s.NameService 
        FROM BookItem as bi, Service as s, Staff as st
        WHERE bi.IDService = s.IDService AND DateBook between '${req.body.firstDate}' and '${req.body.lastDate}'
        AND bi.IDStaff = st.IDStaff AND st.IDStore = ${req.body.idStore}
        GROUP BY bi.IDService, s.PathImg, s.NameService
        order by Count(bi.IDService) desc`
        let sql_total = ` SELECT SUM(Payment) as sum FROM Book WHERE DateBook between '${req.body.firstDate}' and '${req.body.lastDate}' AND IDStore = ${req.body.idStore} `
        let performance_service = await sequelize.query(sql)
        let total_payment = await sequelize.query(sql_total)
        return res.status(200).json({
            status_s: 'success',
            performance_service: performance_service[0],
            total_payment: total_payment[0][0].sum
        })
    }

    async shift(req, res) {
        let regisShift = await sequelize.query(`select RegisShift.*, SurName, NameStaff from RegisShift, Staff WHERE RegisShift.IDStaff = Staff.IDStaff AND RegisShift.IDStore = ${req.query.idStore} `)
        let store = await sequelize.query(`SELECT * FROM Store WHERE IDStore = ${req.query.idStore} `)
        let storeJs = JSON.stringify(store[0])
        res.render('staff/shift', {
            idstore: req.query.idStore,
            regisShift: JSON.stringify(regisShift[0]),
            storeJs,
        })
    }

    async salaryEmployee(req, res) {
        const body = req.body;
        let sql_datework = `SELECT * FROM RegisShift WHERE DateRegis between '${body.dateStart}' and '${body.dateEnd}' AND IDStaff = '${body.idEmployee}'`;
        let sql_info = `SELECT SalaryOnDay, t.NameType, s.PathImgStaff, s.SurName, s.NameStaff FROM TypeStaff as t, Staff as s
		WHERE t.IDTypeStaff = s.TypeStaff and IDStaff = '${body.idEmployee}' `;
        let datework = await sequelize.query(sql_datework);
        let info = await sequelize.query(sql_info);
        let infoBill = await sequelize.query(`SELECT * FROM BillSalary WHERE MonthPay = '${body.monthPayment}' AND Staff = '${body.idEmployee}'`);
        return res.status(200).json({
            status: 'success',
            datework: datework[0],
            infoEmployee: info[0][0],
            bill: infoBill[0],
        })
    }

    async createInvoice_salary(req, res) {
        const body = req.body;
        let insert_sql = `INSERT INTO[dbo].[BillSalary]
            ([IDBill]
                , [MonthPay]
                , [Staff]
                , [Status]
                , [AmountDate]
                , [Payment])
        VALUES
            ('${body.idBill}', '${body.timePay}', '${body.idstaff}', N'???? thanh to??n', ${body.amountDay}, ${body.payment})`
        await sequelize.query(insert_sql)
        await sequelize.query(`UPDATE RegisShift SET StatusRegis = '???? thanh to??n' WHERE StatusRegis = '???? ho??n th??nh'
         AND IDStaff = '${body.idstaff}' AND DateRegis between '${req.body.firstDate}' and '${req.body.lastDate}'`)
        return res.status(200).json({
            status: 'success',
        })
    }

    async updateDoneWork(req, res) {
        await sequelize.query(`UPDATE RegisShift SET StatusRegis = N'???? ho??n th??nh' WHERE IDStaff = '${req.body.idStaff}'
        AND DateRegis = '${req.body.date}'
        `)
        return res.status(200).json({
            status: 'success',
        })
    }
}


module.exports = new StaffController;
