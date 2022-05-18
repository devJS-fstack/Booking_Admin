const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../util/sequelizedb');
require('dotenv').config();
class BookingController {
    // GET/ news
    async main(req, res, next) {
        let user = req.app.locals._user;
        let service = req.app.locals._service;
        if (req.query.step == 0) {
            let cus = await sequelize.query(`SELECT * FROM Customer WHERE PhoneCustomer = '${req.body.inputPhone}'`, {
                raw: true,
                type: QueryTypes.SELECT,
            })
            let store = await sequelize.query(`SELECT * FROM Store WHERE IDStore=${req.query.storeId}`, {
                raw: true,
                type: QueryTypes.SELECT,
            })
            var streetName;
            if (store.length == 0) {
                streetName = "Xem tất cả salon"
            } else {
                streetName = store[0].Street
            }
            //Handle service
            var lengthService;
            var nameServiceBooked = [];
            var objectService = {
                nameService: ''
            };
            var serviceBooked = [];
            var isHaveName = false;
            if (req.body.serviceIds) {
                isHaveName = true;
                service.serviceIds = req.body.serviceIds;
                lengthService = `Đã chọn ${req.body.serviceIds.length} dịch vụ`;
                for (var i = 0; i < service.serviceIds.length; i++) {
                    let ser = await sequelize.query(`SELECT * FROM Service WHERE IDService = '${service.serviceIds[i]}'`, {
                        raw: true,
                        type: QueryTypes.SELECT,
                    })
                    if (ser) serviceBooked.push(ser);
                    objectService.nameService = ser[0].NameService;
                    nameServiceBooked.push(objectService.nameService);
                }
            } else {
                isHaveName = false;
                lengthService = 'Xem tất cả dịch vụ hấp dẫn'
            }
            if (service.serviceIds.length > 0) {
                lengthService = `Đã chọn ${service.serviceIds.length} dịch vụ`;
            }

            // Handle shift
            let shift = await sequelize.query(`SELECT * FROM Shift`, {
                raw: true,
                type: QueryTypes.SELECT
            })

            var shiftParse = '';
            if (shift) {
                shiftParse = JSON.stringify(shift)
                    ;
            }



            // Handle find all booked

            // --> get next 5 date from date current
            var dateCurrent = new Date();
            var date2 = new Date(dateCurrent);
            date2.setDate(dateCurrent.getDate() + 1);
            var date3 = new Date(dateCurrent);
            date3.setDate(dateCurrent.getDate() + 2);
            var date4 = new Date(dateCurrent);
            date4.setDate(dateCurrent.getDate() + 3);
            var date5 = new Date(dateCurrent);
            date5.setDate(dateCurrent.getDate() + 4);
            var date6 = new Date(dateCurrent);
            date6.setDate(dateCurrent.getDate() + 5);



            // query all staff regis FROM 6 day,store 

            let staffsInDate1 = await sequelize.query(`SELECT * FROM Staff as s, Store as st, RegisShift as r 
           WHERE s.IDStore = st.IDStore AND s.IDStore = ${req.query.storeId}
            AND s.IDStaff = r.IDStaff
             AND r.DateRegis = '${dateCurrent.getFullYear()}-${dateCurrent.getMonth() + 1}-${dateCurrent.getDate()}'`, {
                raw: true,
                type: QueryTypes.SELECT,
            })
            let staffsInDate2 = await sequelize.query(`SELECT * FROM Staff as s, Store as st, RegisShift as r 
           WHERE s.IDStore = st.IDStore AND s.IDStore = ${req.query.storeId}
            AND s.IDStaff = r.IDStaff
             AND r.DateRegis = '${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}'`, {
                raw: true,
                type: QueryTypes.SELECT,
            })
            let staffsInDate3 = await sequelize.query(`SELECT * FROM Staff as s, Store as st, RegisShift as r 
           WHERE s.IDStore = st.IDStore AND s.IDStore = ${req.query.storeId}
            AND s.IDStaff = r.IDStaff
             AND r.DateRegis = '${date3.getFullYear()}-${date3.getMonth() + 1}-${date3.getDate()}'`, {
                raw: true,
                type: QueryTypes.SELECT,
            })

            let staffsInDate4 = await sequelize.query(`SELECT * FROM Staff as s, Store as st, RegisShift as r 
           WHERE s.IDStore = st.IDStore AND s.IDStore = ${req.query.storeId}
            AND s.IDStaff = r.IDStaff
             AND r.DateRegis = '${date4.getFullYear()}-${date4.getMonth() + 1}-${date4.getDate()}'`, {
                raw: true,
                type: QueryTypes.SELECT,
            })

            let staffsInDate5 = await sequelize.query(`SELECT * FROM Staff as s, Store as st, RegisShift as r 
           WHERE s.IDStore = st.IDStore AND s.IDStore = ${req.query.storeId}
            AND s.IDStaff = r.IDStaff
             AND r.DateRegis = '${date5.getFullYear()}-${date5.getMonth() + 1}-${date5.getDate()}'`, {
                raw: true,
                type: QueryTypes.SELECT,
            })

            let staffsInDate6 = await sequelize.query(`SELECT * FROM Staff as s, Store as st, RegisShift as r 
           WHERE s.IDStore = st.IDStore AND s.IDStore = ${req.query.storeId}
            AND s.IDStaff = r.IDStaff
             AND r.DateRegis = '${date6.getFullYear()}-${date6.getMonth() + 1}-${date6.getDate()}'`, {
                raw: true,
                type: QueryTypes.SELECT,
            })
            staffsInDate1 = JSON.stringify(staffsInDate1);
            staffsInDate2 = JSON.stringify(staffsInDate2);
            staffsInDate3 = JSON.stringify(staffsInDate3);
            staffsInDate4 = JSON.stringify(staffsInDate4);
            staffsInDate5 = JSON.stringify(staffsInDate5);
            staffsInDate6 = JSON.stringify(staffsInDate6);
            serviceBooked = JSON.stringify(serviceBooked);

            let bookedInDate1 = await sequelize.query(`SELECT * FROM Book 
            WHERE DateBook ='${dateCurrent.getFullYear()}-${dateCurrent.getMonth() + 1}-${dateCurrent.getDate()}' `, {
                raw: true,
                type: QueryTypes.SELECT
            })

            let bookedInDate2 = await sequelize.query(`SELECT * FROM Book 
            WHERE DateBook ='${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}' `, {
                raw: true,
                type: QueryTypes.SELECT
            })

            let bookedInDate3 = await sequelize.query(`SELECT * FROM Book 
            WHERE DateBook ='${date3.getFullYear()}-${date3.getMonth() + 1}-${date3.getDate()}' `, {
                raw: true,
                type: QueryTypes.SELECT
            })

            let bookedInDate4 = await sequelize.query(`SELECT * FROM Book 
            WHERE DateBook ='${date4.getFullYear()}-${date4.getMonth() + 1}-${date4.getDate()}' `, {
                raw: true,
                type: QueryTypes.SELECT
            })

            let bookedInDate5 = await sequelize.query(`SELECT * FROM Book 
            WHERE DateBook ='${date5.getFullYear()}-${date5.getMonth() + 1}-${date5.getDate()}' `, {
                raw: true,
                type: QueryTypes.SELECT
            })

            let bookedInDate6 = await sequelize.query(`SELECT * FROM Book 
            WHERE DateBook ='${date6.getFullYear()}-${date6.getMonth() + 1}-${date6.getDate()}' `, {
                raw: true,
                type: QueryTypes.SELECT
            })


            bookedInDate1 = JSON.stringify(bookedInDate1);
            bookedInDate2 = JSON.stringify(bookedInDate2);
            bookedInDate3 = JSON.stringify(bookedInDate3);
            bookedInDate4 = JSON.stringify(bookedInDate4);
            bookedInDate5 = JSON.stringify(bookedInDate5);
            bookedInDate6 = JSON.stringify(bookedInDate6);
            // Handle render
            if (cus.length > 0) {
                user.nameUser = cus[0].Name;
                res.render('booking/booking', {
                    name: user.nameUser,
                    phone: cus[0].Phone,
                    street: streetName,
                    lengthService: lengthService,
                    nameServiceBooked: nameServiceBooked,
                    isHaveName: isHaveName,
                    shiftParse: shiftParse,
                    staffsInDate1: staffsInDate1,
                    staffsInDate2: staffsInDate2,
                    staffsInDate3: staffsInDate3,
                    staffsInDate4: staffsInDate4,
                    staffsInDate5: staffsInDate5,
                    staffsInDate6: staffsInDate6,
                    bookedInDate1: bookedInDate1,
                    bookedInDate2: bookedInDate2,
                    bookedInDate3: bookedInDate3,
                    bookedInDate4: bookedInDate4,
                    bookedInDate5: bookedInDate5,
                    bookedInDate6: bookedInDate6,
                    serviceBooked: serviceBooked,
                })
            }
            else {
                res.render('booking/booking', {
                    name: user.nameUser,
                    street: streetName,
                    lengthService: lengthService,
                    nameServiceBooked: nameServiceBooked,
                    isHaveName: isHaveName,
                    shiftParse: shiftParse,
                    staffsInDate1: staffsInDate1,
                    staffsInDate2: staffsInDate2,
                    staffsInDate3: staffsInDate3,
                    staffsInDate4: staffsInDate4,
                    staffsInDate5: staffsInDate5,
                    staffsInDate6: staffsInDate6,
                    bookedInDate1: bookedInDate1,
                    bookedInDate2: bookedInDate2,
                    bookedInDate3: bookedInDate3,
                    bookedInDate4: bookedInDate4,
                    bookedInDate5: bookedInDate5,
                    bookedInDate6: bookedInDate6,
                    serviceBooked: serviceBooked,
                })
            }
        }
        else if (req.query.step == 1) {
            await sequelize.query(`SELECT * FROM Store`, {
                raw: true,
                type: QueryTypes.SELECT
            }).then((result) => {
                res.render('booking/booking-salon', {
                    store: result,
                    street: result[0].Street,
                })
            })
        }
        else if (req.query.step == 2) {
            let typeService1 = await sequelize.query(`SELECT * FROM TypeService WHERE IDTypeS=1`, {
                raw: true,
                type: QueryTypes.SELECT
            })
            let typeService2 = await sequelize.query(`SELECT * FROM TypeService WHERE IDTypeS=2`, {
                raw: true,
                type: QueryTypes.SELECT
            })
            let typeService3 = await sequelize.query(`SELECT * FROM TypeService WHERE IDTypeS=3`, {
                raw: true,
                type: QueryTypes.SELECT
            })
            let typeService4 = await sequelize.query(`SELECT * FROM TypeService WHERE IDTypeS=4`, {
                raw: true,
                type: QueryTypes.SELECT
            })
            let item1 = await sequelize.query(`SELECT * FROM Service WHERE TypeService=1`, {
                raw: true,
                type: QueryTypes.SELECT
            })
            let item2 = await sequelize.query(`SELECT * FROM Service WHERE TypeService=2`, {
                raw: true,
                type: QueryTypes.SELECT
            })
            let item3 = await sequelize.query(`SELECT * FROM Service WHERE TypeService=3`, {
                raw: true,
                type: QueryTypes.SELECT
            })
            let item4 = await sequelize.query(`SELECT * FROM Service WHERE TypeService=4`, {
                raw: true,
                type: QueryTypes.SELECT
            })

            if (typeService1 != undefined & typeService2 != undefined & typeService4 != undefined & typeService4 != undefined) {
                res.render('booking/booking-service', {
                    typeService1: typeService1,
                    typeService2: typeService2,
                    typeService3: typeService3,
                    typeService4: typeService4,
                    item1: item1,
                    item2: item2,
                    item3: item3,
                    item4: item4,
                    serviceIds: service.serviceIds,
                });
            }
        }
    }

    async successBooking(req, res, next) {
        let service = req.app.locals._service;
        req.app.locals._service.serviceIds = [];
        var servicesBooked = req.body.servicesBook;
        let checkAlreadyExist = await sequelize.query(`SELECT * FROM Book WHERE PhoneCustomer = '${req.body.phoneBook}' AND Status = N'Đã đặt lịch'`, {
            raw: true,
            type: QueryTypes.SELECT
        })
        if (checkAlreadyExist.length > 0) {
            let deleteBookItem = await sequelize.query(`DELETE BookItem WHERE DateBook='${checkAlreadyExist[0].DateBook}' AND IDShiftBook = ${checkAlreadyExist[0].IDShiftBook} AND IDStaff='${checkAlreadyExist[0].IDStaff}'`, {
                raw: true,
                type: QueryTypes.DELETE,
            })
            let deleteBook = await sequelize.query(`DELETE Book WHERE DateBook ='${checkAlreadyExist[0].DateBook}' AND IDShiftBook = ${checkAlreadyExist[0].IDShiftBook} AND IDStaff='${checkAlreadyExist[0].IDStaff}'`, {
                raw: true,
                type: QueryTypes.DELETE,
            })

            let insertBook = await sequelize.query(`
                     INSERT INTO Book
                     (
                        [IDShiftBook]
                        ,[DateBook]
                        ,[Payment]
                        ,[PhoneCustomer]
                        ,[IDStore]
                        ,[IDStaff]
                        ,[Status])
              VALUES
                     (${req.body.idShiftBook},'${req.body.dateBook}',${req.body.payment},'${req.body.phoneBook}',${req.body.storeBook},'${req.body.staffBook}',N'Đã đặt lịch')
                     `
                , {
                    raw: true,
                    type: QueryTypes.INSERT
                });
            let insertBookItem;
            for (var i = 0; i < servicesBooked.length; i++) {
                insertBookItem = await sequelize.query(`
                            INSERT INTO BookItem(DateBook,IDShiftBook,IDService,IDStaff)
                            VALUES ('${req.body.dateBook}',${req.body.idShiftBook},${servicesBooked[i]},'${req.body.staffBook}')
                            `, {
                    raw: true,
                    type: QueryTypes.INSERT,
                });
            }
            if (insertBookItem) {
                let updatePriceBookitem = await sequelize.query(`UPDATE b
                        SET b.Price = s.ListPrice
                        FROM BookItem b
                        INNER JOIN
                        Service s
                        ON b.IDService = s.IDService AND b.DateBook = '${req.body.dateBook}' AND b.IDShiftBook = ${req.body.idShiftBook}`, {
                    raw: true,
                    type: QueryTypes.UPDATE,
                })
            }



        }
        else {
            let insertBook = await sequelize.query(`
                     INSERT INTO Book
                     (
                        [IDShiftBook]
                        ,[DateBook]
                        ,[Payment]
                        ,[PhoneCustomer]
                        ,[IDStore]
                        ,[IDStaff]
                        ,[Status])
              VALUES
                     (${req.body.idShiftBook},'${req.body.dateBook}',${req.body.payment},'${req.body.phoneBook}',${req.body.storeBook},'${req.body.staffBook}',N'Đã đặt lịch')
                     `
                , {
                    raw: true,
                    type: QueryTypes.INSERT
                });
            if (insertBook) {
                let insertBookItem;
                for (var i = 0; i < servicesBooked.length; i++) {
                    insertBookItem = await sequelize.query(`
                            INSERT INTO BookItem(DateBook,IDShiftBook,IDService,IDStaff)
                            VALUES ('${req.body.dateBook}',${req.body.idShiftBook},${servicesBooked[i]},'${req.body.staffBook}')
                            `, {
                        raw: true,
                        type: QueryTypes.INSERT,
                    });
                }
                if (insertBookItem) {
                    let updatePriceBookitem = await sequelize.query(`UPDATE b
                SET b.Price = s.ListPrice
                FROM BookItem b
                INNER JOIN
                Service s
                ON b.IDService = s.IDService AND b.DateBook = '${req.body.dateBook}' AND b.IDShiftBook = ${req.body.idShiftBook}`, {
                        raw: true,
                        type: QueryTypes.UPDATE,
                    })
                }
            }
        }
        // res.json(req.body);

        function nameDayOfWeek(number) {
            switch (number) {
                case 0: return 'Chủ nhật';
                case 1: return 'Thứ hai';
                case 2: return 'Thứ ba';
                case 3: return 'Thứ tư';
                case 4: return 'Thứ năm';
                case 5: return 'Thứ sáu';
                case 6: return 'Thứ bảy ';
            }
        }
        var d = new Date(req.body.dateBook);
        var day_month;
        if (d.getMonth() + 1 < 10)
            day_month = `${d.getDate()}.0${d.getMonth() + 1}`;
        else
            day_month = `${d.getDate()}.${d.getMonth() + 1}`;


        let staffChoose = await sequelize.query(`SELECT * FROM Staff WHERE IDStaff = '${req.body.staffBook}'`, {
            raw: true,
            type: QueryTypes.SELECT,
        })
        let fullName = `${staffChoose[0].SurName} ${staffChoose[0].NameStaff}`
        let pathImgStaff = staffChoose[0].PathImgStaff;

        res.render('booking/booking-done', {
            phoneBook: req.body.phoneBook,
            streetStore: req.body.streetStore,
            timeChoose: req.body.timeChoose,
            dayOfWeek: nameDayOfWeek(d.getDay()),
            day_month: day_month,
            fullName: fullName,
            pathImgStaff: pathImgStaff,
            servicesChoose: req.body.servicesChoose,
            payment: req.body.payment,
            dateBook: req.body.dateBook,
            idShiftBook: req.body.idShiftBook,
            idStaffBook: req.body.staffBook,
        })
    }

    async cancelBooking(req, res) {

        let deteteBookItem = await sequelize.query(`DELETE BookItem WHERE DateBook='${req.query.dateBook}' AND IDShiftBook=${req.query.idShift} AND IDStaff='${req.query.staffBook}'`, {
            raw: true,
            type: QueryTypes.DELETE,
        });
        let deleteBook = await sequelize.query(`DELETE Book WHERE PhoneCustomer='${req.query.phoneBook}' AND Status=N'Đã đặt lịch'`, {
            raw: true,
            type: QueryTypes.DELETE,
        });
        res.redirect('/');
    }

    async infoBooking(req, res) {
        let infoBook = await sequelize.query(`SELECT Street,DateBook,NameStaff,SurName,HourStart,MinuteStart,NameDayOfWeek,IDShiftBook,b.IDStaff FROM DayOfWeek as d,Store as s,Book as b,Staff as st,Shift as sh,RegisShift as r
        WHERE PhoneCustomer ='${req.body.phoneCustomer}' AND b.Status=N'Đã đặt lịch' AND b.IDShiftBook = sh.IDShift AND b.IDStaff = st.IDStaff
        AND b.IDStore = s.IDStore AND d.IDDayOfWeek = r.IDDayOfWeek AND b.DateBook = r.DateRegis AND r.IDStaff = b.IDStaff`, {
            raw: true,
            type: QueryTypes.SELECT,
        })
        if (infoBook.length > 0) {
            var fullnameStaff = infoBook[0].SurName + ' ' + infoBook[0].NameStaff;
            var timebook = infoBook[0].MinuteStart == 0 ? `${infoBook[0].HourStart}h00` : `${infoBook[0].HourStart}h${infoBook[0].MinuteStart}`
            return res.status(200).json({
                status_info: 'success',
                street: infoBook[0].Street,
                dateBook: infoBook[0].DateBook,
                nameStaff: fullnameStaff,
                timeBook: timebook,
                dayofweek: infoBook[0].NameDayOfWeek,
                minuteBook: infoBook[0].MinuteStart,
                hourBook: infoBook[0].HourStart,
                idShift: infoBook[0].IDShiftBook,
                idStaff: infoBook[0].IDStaff,
            })
        }
        else {
            return res.status(200).json({
                status_info: 'not booking found'
            })
        }

    }

}

module.exports = new BookingController;