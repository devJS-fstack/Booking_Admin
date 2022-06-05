const accessToken = `${window.localStorage.getItem('accessToken')}`;
if (accessToken != `null`) {
    (async () => {
        const ids = location.href.split('?idStore=')[1];
        const { status, idEmployee, employee, role } = await checkToken(accessToken);
        if (status == 'success') {
            if (role === 3) {
                if (employee.IDStore !== parseInt(ids)) {
                    location.href = './page-err'
                }
            }
            else if (role == 4) {
                var service_link = document.querySelector('.service-link');
                var service_span = document.querySelector('.service-span');
                service_link.classList.remove('d-none');
                service_span.classList.remove('d-none');
            }
            $('.name-manager').text(`${employee.SurName} ${employee.NameStaff}`);
            var avtManager = document.querySelector('.avt-manager');
            avtManager.style = `background-image: url(${employee.PathImgStaff});color: rgb(19, 150, 110);`
            const idStore = location.href.split('?idStore=')[1];
            var options_customer = {
                chart: {
                    type: 'line',
                    height: 'auto',
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false,
                    },
                },
                tooltip: {
                    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                        var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
                        return `<div class="dashboard-appointments-stats__tooltip">
                        <div class="dashboard-appointments-stats__tooltip__top">
                            <span>Khách hàng:</span>
                            <span class="dashboard-appointments-stats__tooltip__top__blue">${data}</span>
                        </div>
                    </div>`
                    }
                },
                series: [{
                    name: 'Khách hàng',
                    data: [0, 0, 10, 0, 12, 7, 32]
                }],
                xaxis: {
                    show: false,
                    trim: false,
                    categories: [],
                    stroke: {
                        show: false,
                    },
                },
                colors: ['#16a862', '#E91E63', '#9C27B0'],
                stroke: {
                    curve: 'smooth',
                },

                fill: {
                    type: 'gradient'
                },
                states: {
                    active: {
                        filter: {
                            type: 'none' /* none, lighten, darken */
                        }
                    }
                }

            }

            var options_revenue = {
                chart: {
                    type: 'line',
                    height: 'auto',
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false,
                    },
                },
                tooltip: {
                    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                        var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
                        var textRevenue = data == 0 ? `${formatMoneyViet(data)}đ` : `${formatMoneyViet(data)}.000đ`
                        return `<div class="dashboard-appointments-stats__tooltip">
                        <div class="dashboard-appointments-stats__tooltip__top">
                            <span>Doanh Thu:</span>
                            <span class="dashboard-appointments-stats__tooltip__top__blue">${textRevenue}</span>
                        </div>
                    </div>`
                    }
                },
                series: [{
                    name: 'Khách hàng',
                    data: [0, 0, 10, 0, 12, 7, 32]
                }],
                xaxis: {
                    show: false,
                    trim: false,
                    categories: [],
                    stroke: {
                        show: false,
                    },
                },
                colors: ['#16a862', '#E91E63', '#9C27B0'],
                stroke: {
                    curve: 'smooth',
                },

                fill: {
                    type: 'gradient'
                },
                states: {
                    active: {
                        filter: {
                            type: 'none' /* none, lighten, darken */
                        }
                    }
                }

            }

            var options_booked = {
                chart: {
                    zoom: false,
                    type: "area",
                    height: 300,
                    foreColor: "#999",
                    stacked: true,
                    dropShadow: {
                        enabled: true,
                        enabledSeries: [0],
                        top: -2,
                        left: 2,
                        blur: 5,
                        opacity: 0.06
                    },
                    toolbar: {
                        show: false,
                    },
                },
                colors: ['#075eee'],
                stroke: {
                    curve: "smooth",
                    width: 3
                },
                dataLabels: {
                    enabled: false,
                },
                series: [{
                    name: '',
                    data: []
                },
                ],
                xaxis: {
                    type: "datetime",
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                yaxis: {
                    show: false,
                    labels: {
                        offsetX: 14,
                        offsetY: -5,
                    },
                    tooltip: {
                        enabled: true
                    }
                },
                grid: {
                    show: false,
                },
                tooltip: {
                    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                        var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

                        return `<div class="dashboard-appointments-stats__tooltip">
                        <div class="dashboard-appointments-stats__tooltip__top">
                            <span>${data.y}</span>
                            <span class="dashboard-appointments-stats__tooltip__top__blue">${formatMoneyViet(data.payment_book * 1000)}đ</span>
                        </div>
                        <div class="dashboard-appointments-stats__tooltip__bottom">${formatDateViet(data.x)}</div>
                    </div>`
                    }
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left'
                },
                fill: {
                    type: "gradient",
                    fillOpacity: 0.7
                }
            }

            var options_bar = {
                series: [44, 22],
                chart: {
                    width: 120,
                    height: 120,
                    type: 'donut',
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: false,
                },
                labels: ['Khách hàng cũ', 'Khách hàng mới'],
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            }


            function nameVietOfMonth(number) {
                switch (number) {
                    case 1: return 'Tháng 1';
                    case 2: return 'Tháng 2';
                    case 3: return 'Tháng 3';
                    case 4: return 'Tháng 4';
                    case 5: return 'Tháng 5';
                    case 6: return 'Tháng 6';
                    case 7: return 'Tháng 7';
                    case 8: return 'Tháng 8';
                    case 9: return 'Tháng 9';
                    case 10: return 'Tháng 10';
                    case 11: return 'Tháng 11';
                    case 12: return 'Tháng 12';
                }
            }


            function formatDateViet(date) {
                var date = new Date(date);
                return `${date.getDate()} ${nameVietOfMonth(date.getMonth() + 1)}, ${date.getFullYear()}`
            }






            var chart_customer = new ApexCharts(document.querySelector("#chart_customer"), options_customer);
            var chart_revenue = new ApexCharts(document.querySelector("#chart_revenue"), options_revenue);
            var chart_booked = new ApexCharts(document.querySelector("#chart_book"), options_booked);
            var chart_bar = new ApexCharts(document.querySelector("#chart_bar"), options_bar);
            chart_customer.render();
            chart_revenue.render();
            chart_booked.render();
            chart_bar.render();


            var firstDay;
            var lastDay;
            var first;
            var last;
            var firstMonth;
            var lastMonth;
            var sumRevenue = 0;
            var indexTimePre_booked;
            // current week
            function currentWeek() {
                var curr = new Date();
                var dayNumber;
                if (curr.getDay() == 0) {
                    dayNumber = 6
                }
                else {
                    dayNumber = curr.getDay() - 1;
                }
                first = curr.getDate() - (dayNumber);
                last = first + 6;
                firstDay = new Date(curr.setDate(first));
                lastDay = new Date(curr.setDate(last));
                if (firstDay.getDate() > lastDay.getDate()) {
                    lastDay.setMonth(lastDay.getMonth() + 1)
                }
            }
            // last week
            function lastweek() {
                var curr = new Date();
                var dayNumber;
                if (curr.getDay() == 0) {
                    dayNumber = 6
                }
                else {
                    dayNumber = curr.getDay() - 1;
                }
                first = curr.getDate() - dayNumber - 7;
                last = first + 6;
                if (last < 0) last += 1
                firstDay = new Date(curr.setDate(first));
                lastDay = new Date(curr.setDate(last));
                if (firstDay.getMonth() != lastDay.getMonth()) {
                    lastDay.setMonth(lastDay.getMonth() + 1)
                }
            }

            // current month
            function currentMonth() {
                var currDate = new Date();
                firstDay = new Date(currDate.getFullYear(), currDate.getMonth(), 1);
                lastDay = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0);
                first = firstDay.getDate();
                last = lastDay.getDate();
            }

            // last three month
            function threeMonth() {
                var curr = new Date();
                firstDay = new Date(curr.getFullYear(), curr.getMonth(), 1);
                lastDay = new Date(curr.getFullYear(), curr.getMonth(), 1);
                firstDay.setMonth(firstDay.getMonth() - 3);
                lastDay.setMonth(lastDay.getMonth() - 1);
                lastDay = new Date(lastDay.getFullYear(), lastDay.getMonth() + 1, 0)
                firstMonth = firstDay.getMonth();
                lastMonth = lastDay.getMonth();
            }

            function sixMonth() {
                var curr = new Date();
                firstDay = new Date(curr.getFullYear(), curr.getMonth(), 1);
                lastDay = new Date(curr.getFullYear(), curr.getMonth(), 1);
                firstDay.setMonth(firstDay.getMonth() - 6);
                lastDay.setMonth(lastDay.getMonth() - 1);
                lastDay = new Date(lastDay.getFullYear(), lastDay.getMonth() + 1, 0)
                firstMonth = firstDay.getMonth();
                lastMonth = lastDay.getMonth();
            }

            window.addEventListener('load', async () => {
                currentWeek();
                var firstDateString = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1}-${firstDay.getDate()}`
                var lastDateString = `${lastDay.getFullYear()}-${lastDay.getMonth() + 1}-${lastDay.getDate()}`
                const { status, customers, revenue, start_end } = await getCustomerCurrentWeek(firstDateString, lastDateString);
                if (status == 'success') {
                    chart_customer.updateOptions({
                        series: [{
                            name: 'Khách hàng',
                            data: renderData_LineCustomer(customers),
                        }],
                        xaxis: {
                            show: false,
                            trim: false,
                            categories: createArray(7),
                            stroke: {
                                show: false,
                            },
                        },
                    })

                    chart_revenue.updateOptions({
                        series: [{
                            name: 'Doanh Thu',
                            data: renderData_LineRevenue(revenue),
                        }],
                        xaxis: {
                            show: false,
                            trim: false,
                            categories: createArray(7),
                            stroke: {
                                show: false,
                            },
                        },
                    })

                    $('.customer_num').text(`${customers.length}`)
                    var textRevenue = sumRevenue == 0 ? `${formatMoneyViet(sumRevenue)}đ` : `${formatMoneyViet(sumRevenue)}.000đ`
                    $('.sum_revenue').text(textRevenue);
                    renderTimeBooked(start_end);
                    var datecurr = new Date();
                    var firstDate = new Date(datecurr.getFullYear(), datecurr.getMonth(), 1);
                    var lastDate = new Date(datecurr.getFullYear(), datecurr.getMonth() + 1, 0);
                    var dateOldCustomer = new Date(datecurr.getFullYear(), datecurr.getMonth(), 0);
                    var firstDateString_book = `${firstDate.getFullYear()}-${firstDate.getMonth() + 1}-${firstDate.getDate()}`
                    var lastDateString_book = `${lastDate.getFullYear()}-${lastDate.getMonth() + 1}-${lastDate.getDate()}`
                    var dateString_oldCustomer = `${dateOldCustomer.getFullYear()}-${dateOldCustomer.getMonth() + 1}-${dateOldCustomer.getDate()}`
                    const { status_b, data, data_bill, count_bookSuccess, count_bookPending, arrCountOldCustomer, arrCountNewCustomer }
                        = await getBook_Revenue(firstDateString_book, lastDateString_book, dateString_oldCustomer)
                    if (checkBooked(`${datecurr.getMonth() + 1}/${datecurr.getFullYear()}`)) {
                        $('.span-btn-time__booked').text(`${datecurr.getMonth() + 1}/${datecurr.getFullYear()}`)
                        if (status_b == 'success') {
                            $('.booking_pendding').text(count_bookPending);
                            $('.booking_success').text(count_bookSuccess);
                            chart_booked.updateOptions({
                                series: [{
                                    name: '',
                                    data: getDaysInMonth(datecurr.getMonth(), datecurr.getFullYear(), data, data_bill)
                                },
                                ],
                            })
                            var sum_cus = sumCustomer(arrCountOldCustomer) + sumCustomer(arrCountNewCustomer);
                            var percentOld = ((sumCustomer(arrCountOldCustomer) * 100) / sum_cus)
                            var percentNew = ((sumCustomer(arrCountNewCustomer) * 100) / sum_cus)
                            $('.old-customer').text(sumCustomer(arrCountOldCustomer))
                            $('.new-customer').text(sumCustomer(arrCountNewCustomer))
                            $('.percent-old-customer').text(`${financial(percentOld)}%`)
                            $('.percent-new-customer').text(`${financial(percentNew)}%`)
                            chart_bar.updateOptions({
                                series: [sumCustomer(arrCountOldCustomer), sumCustomer(arrCountNewCustomer)],
                            })
                        }
                        var itemTime_booked = document.querySelectorAll('.item_time_booked');
                        clickTimeBooked(itemTime_booked)
                    } else {
                        $('.span-btn-time__booked').text(`${datecurr.getMonth() + 1}/${datecurr.getFullYear()}`)
                        var cur_end = new Date();
                        var old_start = new Date(start_end.max);
                        old_start.setMonth(old_start.getMonth());
                        cur_end.setDate(1);
                        old_start.setDate(1);
                        var html = ``;
                        while (cur_end > old_start) {
                            html += `<li data-month = ${cur_end.getMonth() + 1} data-year =${cur_end.getFullYear()} 
                            style="padding-left:20px ;"
                            class="el-select-dropdown__item adm-select-option item_time_booked">
                            <span>${(cur_end.getMonth() + 1)}/${cur_end.getFullYear()}</span>
                        </li>`
                            cur_end.setMonth(cur_end.getMonth() - 1);
                        }
                        $('.dropdown__listTimeBooked').prepend(html)
                        checkBooked(`${(datecurr.getMonth() + 1)}/${datecurr.getFullYear()}`)
                        var itemTime_booked = document.querySelectorAll('.item_time_booked');
                        clickTimeBooked(itemTime_booked)
                        $('.booking_pendding').text(0);
                        $('.booking_success').text(0);
                        chart_booked.updateOptions({
                            series: [{
                                name: '',
                                data: getDaysInMonth(datecurr.getMonth(), datecurr.getFullYear(), [], [])
                            },
                            ],
                        })

                        const { status_c, arrCountOldCustomer, arrCountNewCustomer } = await getCountCustomer(firstDateString_book, lastDateString_book, dateString_oldCustomer);
                        if (status_c == 'success') {
                            var sum_cus = sumCustomer(arrCountOldCustomer) + sumCustomer(arrCountNewCustomer);
                            var percentOld = ((sumCustomer(arrCountOldCustomer) * 100) / sum_cus)
                            var percentNew = ((sumCustomer(arrCountNewCustomer) * 100) / sum_cus)
                            $('.old-customer').text(sumCustomer(arrCountOldCustomer))
                            $('.new-customer').text(sumCustomer(arrCountNewCustomer))
                            $('.percent-old-customer').text(`${financial(percentOld)}%`)
                            $('.percent-new-customer').text(`${financial(percentNew)}%`)
                            chart_bar.updateOptions({
                                series: [sumCustomer(arrCountOldCustomer), sumCustomer(arrCountNewCustomer)],
                            })
                        }

                    }
                }

                // render history booked
                renderHistoryBook(1, 0);

                // render performance employee
                const { status_p, performance_employee, total_payment } = await getPerformance_Employee(firstDateString, lastDateString)
                if (status_p == 'success') {
                    renderPerformance_Employee(performance_employee, total_payment);
                }
            })

            const performance = document.querySelector('.performance')

            function renderPerformance_Employee(arr, total_payment) {
                // console.log(arr);
                var html = ``;
                arr.forEach((item, index) => {
                    var percent = (item.sum * 100) / total_payment;
                    html += ` <div class="dashboard-employee-performance-card dashboard-performance-stats__card">
                    <div class="dashboard-employee-performance-card__header">
                        <div style="background-image: url(${item.PathImgStaff});color: rgb(19, 150, 110);"
                            class="adm-avatar size-32 mr-3 ml-0">
                        </div>
                        ${item.SurName} ${item.NameStaff}
                    </div>
                    <div class="dashboard-employee-performance-card__content">
                        <div class="dashboard-employee-performance-card__content__item">
                            Cuộc Hẹn
                            <div class="dashboard-employee-performance-card__content__item__value">
                                ${item.count}
                            </div>
                        </div>
                        <div class="dashboard-employee-performance-card__content__item">
                            Doanh Thu
                            <div class="dashboard-employee-performance-card__content__item__value">
                               ${formatMoneyViet(item.sum)}.000đ
                            </div>
                        </div>
                    </div>
                    <div class="dashboard-employee-performance-card__chart">
                        <div style="width:${financial_2(percent)}%"></div>
                    </div>
                    <div class="dashboard-employee-performance-card__occupancy-percentage">
                        <div
                            class="dashboard-employee-performance-card__occupancy-percentage__title">
                            Tỉ lệ doanh thu</div>
                        <div
                            class="dashboard-employee-performance-card__occupancy-percentage__value">
                            ${financial_2(percent)}%</div>
                    </div>
                </div>`
                })

                performance.innerHTML = html
            }

            function renderPerformance_Service(arr, total_payment) {
                var html = ``;
                arr.forEach((item, index) => {
                    var percent = (item.sum * 100) / total_payment;
                    html += ` <div class="dashboard-employee-performance-card dashboard-performance-stats__card">
                    <div class="dashboard-employee-performance-card__header">
                        <div style="background-image: url(${item.PathImg});color: rgb(19, 150, 110);"
                            class="adm-avatar size-32 mr-3 ml-0">
                        </div>
                        ${item.NameService}
                    </div>
                    <div class="dashboard-employee-performance-card__content">
                        <div class="dashboard-employee-performance-card__content__item">
                            Cuộc Hẹn
                            <div class="dashboard-employee-performance-card__content__item__value">
                                ${item.count}
                            </div>
                        </div>
                        <div class="dashboard-employee-performance-card__content__item">
                            Doanh Thu
                            <div class="dashboard-employee-performance-card__content__item__value">
                               ${formatMoneyViet(item.sum)}.000đ
                            </div>
                        </div>
                    </div>
                    <div class="dashboard-employee-performance-card__chart">
                        <div style="width:${financial_2(percent)}%"></div>
                    </div>
                    <div class="dashboard-employee-performance-card__occupancy-percentage">
                        <div
                            class="dashboard-employee-performance-card__occupancy-percentage__title">
                            Tỉ lệ doanh thu</div>
                        <div
                            class="dashboard-employee-performance-card__occupancy-percentage__value">
                            ${financial_2(percent)}%</div>
                    </div>
                </div>`
                })

                performance.innerHTML = html
            }

            const dashboard_itemPerform = document.querySelectorAll('.dashboard-performance-stats__menu__item')
            var indexPreItemPer = 0;
            var countDash = 0
            currentWeek();
            dashboard_itemPerform.forEach((item, index) => {

                item.onclick = async () => {
                    var firstDateString = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1}-${firstDay.getDate()}`
                    var lastDateString = `${lastDay.getFullYear()}-${lastDay.getMonth() + 1}-${lastDay.getDate()}`
                    if (indexPreItemPer != index) {
                        dashboard_itemPerform[indexPreItemPer].classList.remove('is-active');
                        dashboard_itemPerform[indexPreItemPer].style = 'border-bottom-color: transparent;';
                        item.classList.add('is-active');
                        item.style = '';
                        indexPreItemPer = index;
                        if (index == 0) {
                            const { status_p, performance_employee, total_payment } = await getPerformance_Employee(firstDateString, lastDateString)
                            if (status_p == 'success') {
                                renderPerformance_Employee(performance_employee, total_payment);
                            }
                        }
                        else {
                            if (countDash == 0) {
                                currentWeek();
                                firstDateString = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1}-${firstDay.getDate()}`
                                var lastDateString = `${lastDay.getFullYear()}-${lastDay.getMonth() + 1}-${lastDay.getDate()}`
                                countDash = 1;
                            }
                            const { status_s, performance_service, total_payment } = await getPerformance_Service(firstDateString, lastDateString)
                            if (status_s == 'success') {
                                renderPerformance_Service(performance_service, total_payment);
                            }
                        }
                    }

                }
            })

            const itemTimePerformance = document.querySelectorAll('.item-time__performance');
            const spans_timePerformance = document.querySelectorAll('.item-time__performance span')
            itemTimePerformance[0].classList.add('selected')
            var indexPre_timePer = 0;
            itemTimePerformance.forEach((item, index) => {
                item.onclick = async () => {
                    $('.text-time-performance').text(spans_timePerformance[index].textContent.trim())
                    if (indexPre_timePer != index) {
                        item.classList.add('selected')
                        itemTimePerformance[indexPre_timePer].classList.remove('selected')
                        indexPre_timePer = index;
                    }
                    switch (index) {
                        case 0:
                            currentWeek();
                            var firstDateString = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1}-${firstDay.getDate()}`
                            var lastDateString = `${lastDay.getFullYear()}-${lastDay.getMonth() + 1}-${lastDay.getDate()}`
                            if (indexPreItemPer == 0) {
                                const { status_p, performance_employee, total_payment } = await getPerformance_Employee(firstDateString, lastDateString)
                                if (status_p == 'success') {
                                    renderPerformance_Employee(performance_employee, total_payment);
                                }
                            } else {
                                const { status_s, performance_service, total_payment } = await getPerformance_Service(firstDateString, lastDateString)
                                if (status_s == 'success') {
                                    renderPerformance_Service(performance_service, total_payment);
                                }
                            }
                            break;
                        case 1:
                            lastweek();
                            var firstDateString = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1}-${firstDay.getDate()}`
                            var lastDateString = `${lastDay.getFullYear()}-${lastDay.getMonth() + 1}-${lastDay.getDate()}`
                            if (indexPreItemPer == 0) {
                                const { status_p, performance_employee, total_payment } = await getPerformance_Employee(firstDateString, lastDateString)
                                if (status_p == 'success') {
                                    renderPerformance_Employee(performance_employee, total_payment);
                                }
                            } else {
                                const { status_s, performance_service, total_payment } = await getPerformance_Service(firstDateString, lastDateString)
                                if (status_s == 'success') {
                                    renderPerformance_Service(performance_service, total_payment);
                                }
                            }
                            break;
                        case 2:
                            currentMonth();
                            var firstDateString = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1}-${firstDay.getDate()}`
                            var lastDateString = `${lastDay.getFullYear()}-${lastDay.getMonth() + 1}-${lastDay.getDate()}`
                            if (indexPreItemPer == 0) {
                                const { status_p, performance_employee, total_payment } = await getPerformance_Employee(firstDateString, lastDateString)
                                if (status_p == 'success') {
                                    renderPerformance_Employee(performance_employee, total_payment);
                                }
                            } else {
                                const { status_s, performance_service, total_payment } = await getPerformance_Service(firstDateString, lastDateString)
                                if (status_s == 'success') {
                                    renderPerformance_Service(performance_service, total_payment);
                                }
                            }
                            break;
                        case 3:
                            threeMonth();
                            var firstDateString = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1}-${firstDay.getDate()}`
                            var lastDateString = `${lastDay.getFullYear()}-${lastDay.getMonth() + 1}-${lastDay.getDate()}`
                            if (indexPreItemPer == 0) {
                                const { status_p, performance_employee, total_payment } = await getPerformance_Employee(firstDateString, lastDateString)
                                if (status_p == 'success') {
                                    renderPerformance_Employee(performance_employee, total_payment);
                                }
                            } else {
                                const { status_s, performance_service, total_payment } = await getPerformance_Service(firstDateString, lastDateString)
                                if (status_s == 'success') {
                                    renderPerformance_Service(performance_service, total_payment);
                                }
                            }
                            break;
                        case 4:
                            sixMonth();
                            console.log(indexPreItemPer)
                            var firstDateString = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1}-${firstDay.getDate()}`
                            var lastDateString = `${lastDay.getFullYear()}-${lastDay.getMonth() + 1}-${lastDay.getDate()}`
                            if (indexPreItemPer == 0) {
                                const { status_p, performance_employee, total_payment } = await getPerformance_Employee(firstDateString, lastDateString)
                                if (status_p == 'success') {
                                    renderPerformance_Employee(performance_employee, total_payment);
                                }
                            } else {
                                const { status_s, performance_service, total_payment } = await getPerformance_Service(firstDateString, lastDateString)
                                if (status_s == 'success') {
                                    renderPerformance_Service(performance_service, total_payment);
                                }
                            }
                            break;
                    }
                }
            })


            function financial(x) {
                return Number.parseFloat(x).toFixed(1);
            }

            function financial_2(x) {
                return Number.parseFloat(x).toFixed(2);
            }

            function sumCustomer(arr) {
                var sum = 0;
                arr.forEach(item => {
                    sum += item.count
                })
                return sum;
            }

            function clickTimeBooked(list) {
                var spans_timeBooked = document.querySelectorAll('.item_time_booked span');
                list.forEach((item, index) => {
                    item.onclick = async () => {
                        list[indexTimePre_booked].classList.remove('selected')
                        item.classList.add('selected');
                        indexTimePre_booked = index;
                        $('.span-btn-time__booked').text(`${spans_timeBooked[index].textContent.trim()}`)
                        var firstDate = new Date(parseInt(item.getAttribute('data-year')), parseInt(item.getAttribute('data-month')) - 1, 1);
                        var lastDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + 1, 0);
                        var dateOldCustomer = new Date(firstDate.getFullYear(), firstDate.getMonth(), 0);
                        var firstDateString_book = `${firstDate.getFullYear()}-${firstDate.getMonth() + 1}-${firstDate.getDate()}`
                        var lastDateString_book = `${lastDate.getFullYear()}-${lastDate.getMonth() + 1}-${lastDate.getDate()}`
                        var dateString_oldCustomer = `${dateOldCustomer.getFullYear()}-${dateOldCustomer.getMonth() + 1}-${dateOldCustomer.getDate()}`
                        const { status_b, data, data_bill, count_bookSuccess, count_bookPending, arrCountOldCustomer, arrCountNewCustomer } = await getBook_Revenue(firstDateString_book, lastDateString_book, dateString_oldCustomer)
                        $('.span-btn-time__booked').text(`${firstDate.getMonth() + 1}/${firstDate.getFullYear()}`)
                        if (status_b == 'success') {
                            $('.booking_pendding').text(count_bookPending);
                            $('.booking_success').text(count_bookSuccess);
                            chart_booked.updateOptions({
                                series: [{
                                    name: '',
                                    data: getDaysInMonth(firstDate.getMonth(), firstDate.getFullYear(), data, data_bill)
                                },
                                ],
                            })

                            var sum_cus = sumCustomer(arrCountOldCustomer) + sumCustomer(arrCountNewCustomer);
                            var percentOld = ((sumCustomer(arrCountOldCustomer) * 100) / sum_cus)
                            var percentNew = ((sumCustomer(arrCountNewCustomer) * 100) / sum_cus)
                            $('.old-customer').text(sumCustomer(arrCountOldCustomer))
                            $('.new-customer').text(sumCustomer(arrCountNewCustomer))
                            $('.percent-old-customer').text(`${financial(percentOld)}%`)
                            $('.percent-new-customer').text(`${financial(percentNew)}%`)
                            chart_bar.updateOptions({
                                series: [sumCustomer(arrCountOldCustomer), sumCustomer(arrCountNewCustomer)],
                            })
                        }
                    }
                })
            }

            async function renderChart_customer_currentWeek(choose) {
                var firstDateString = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1}-${firstDay.getDate()}`
                var lastDateString = `${lastDay.getFullYear()}-${lastDay.getMonth() + 1}-${lastDay.getDate()}`
                const { status, customers, revenue } = await getCustomerCurrentWeek(firstDateString, lastDateString);
                if (status == 'success') {
                    if (choose == 0) {
                        chart_customer.updateOptions({
                            series: [{
                                name: 'Khách hàng',
                                data: renderData_LineCustomer(customers),
                            }],
                            xaxis: {
                                show: false,
                                trim: false,
                                categories: createArray(7),
                                stroke: {
                                    show: false,
                                },
                            },
                        })
                        $('.customer_num').text(`${customers.length}`);
                    }
                    else {
                        chart_revenue.updateOptions({
                            series: [{
                                name: 'Doanh Thu',
                                data: renderData_LineRevenue(revenue),
                            }],
                            xaxis: {
                                show: false,
                                trim: false,
                                categories: createArray(7),
                                stroke: {
                                    show: false,
                                },
                            },
                        })
                        var textRevenue = sumRevenue == 0 ? `${formatMoneyViet(sumRevenue)}đ` : `${formatMoneyViet(sumRevenue)}.000đ`
                        $('.sum_revenue').text(textRevenue);
                    }
                }
            }


            async function renderChart_customer_lastweek(choose) {
                var firstDateString = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1}-${firstDay.getDate()}`
                var lastDateString = `${lastDay.getFullYear()}-${lastDay.getMonth() + 1}-${lastDay.getDate()}`
                const { status, customers, revenue } = await getCustomerCurrentWeek(firstDateString, lastDateString);
                if (status == 'success') {
                    if (choose == 0) {
                        chart_customer.updateOptions({
                            series: [{
                                name: 'Khách hàng',
                                data: renderData_LineCustomer(customers),
                            }],
                            xaxis: {
                                show: false,
                                trim: false,
                                categories: createArray(7),
                                stroke: {
                                    show: false,
                                },
                            },
                        })
                        $('.customer_num').text(`${customers.length}`)
                    } else {

                        chart_revenue.updateOptions({
                            series: [{
                                name: 'Doanh Thu',
                                data: renderData_LineRevenue(revenue),
                            }],
                            xaxis: {
                                show: false,
                                trim: false,
                                categories: createArray(7),
                                stroke: {
                                    show: false,
                                },
                            },
                        })
                        var textRevenue = sumRevenue == 0 ? `${formatMoneyViet(sumRevenue)}đ` : `${formatMoneyViet(sumRevenue)}.000đ`
                        $('.sum_revenue').text(textRevenue);
                    }
                }
            }

            async function renderChart_customer_currentMonth(choose) {
                var firstDateString = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1}-${firstDay.getDate()}`
                var lastDateString = `${lastDay.getFullYear()}-${lastDay.getMonth() + 1}-${lastDay.getDate()}`
                const { status, customers, revenue } = await getCustomerCurrentWeek(firstDateString, lastDateString);
                if (status == 'success') {
                    if (choose == 0) {
                        chart_customer.updateOptions({
                            series: [{
                                name: 'Khách hàng',
                                data: renderData_LineCustomer(customers),
                            }],
                            xaxis: {
                                show: false,
                                trim: false,
                                categories: createArray(last),
                                stroke: {
                                    show: false,
                                },
                            },
                        })
                        $('.customer_num').text(`${customers.length}`);
                    } else {
                        chart_revenue.updateOptions({
                            series: [{
                                name: 'Doanh Thu',
                                data: renderData_LineRevenue(revenue),
                            }],
                            xaxis: {
                                show: false,
                                trim: false,
                                categories: createArray(last),
                                stroke: {
                                    show: false,
                                },
                            },
                        })
                        var textRevenue = sumRevenue == 0 ? `${formatMoneyViet(sumRevenue)}đ` : `${formatMoneyViet(sumRevenue)}.000đ`
                        $('.sum_revenue').text(textRevenue);
                    }
                }
            }

            async function renderChart_customer_lastThreeMonth(choose) {
                var firstDateString = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1}-${firstDay.getDate()}`
                var lastDateString = `${lastDay.getFullYear()}-${lastDay.getMonth() + 1}-${lastDay.getDate()}`
                const { status, customers, revenue } = await getCustomerCurrentWeek(firstDateString, lastDateString);
                if (status == 'success') {
                    if (choose == 0) {
                        chart_customer.updateOptions({
                            series: [{
                                name: 'Khách hàng',
                                data: renderData_LineCustomer_Month(customers),
                            }],
                            xaxis: {
                                show: false,
                                trim: false,
                                categories: createArray(3),
                                stroke: {
                                    show: false,
                                },
                            },
                        })
                        $('.customer_num').text(`${customers.length}`);
                    } else {
                        chart_revenue.updateOptions({
                            series: [{
                                name: 'Doanh Thu',
                                data: renderData_LineRevenue_Month(revenue),
                            }],
                            xaxis: {
                                show: false,
                                trim: false,
                                categories: createArray(3),
                                stroke: {
                                    show: false,
                                },
                            },
                        })
                        var textRevenue = sumRevenue == 0 ? `${formatMoneyViet(sumRevenue)}đ` : `${formatMoneyViet(sumRevenue)}.000đ`
                        $('.sum_revenue').text(textRevenue);
                    }
                }
            }

            async function renderChart_customer_sixThreeMonth(choose) {
                var firstDateString = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1}-${firstDay.getDate()}`
                var lastDateString = `${lastDay.getFullYear()}-${lastDay.getMonth() + 1}-${lastDay.getDate()}`
                const { status, customers, revenue } = await getCustomerCurrentWeek(firstDateString, lastDateString);
                if (status == 'success') {
                    if (choose == 0) {
                        chart_customer.updateOptions({
                            series: [{
                                name: 'Khách hàng',
                                data: renderData_LineCustomer_Month(customers),
                            }],
                            xaxis: {
                                show: false,
                                trim: false,
                                categories: createArray(6),
                                stroke: {
                                    show: false,
                                },
                            },
                        })
                        $('.customer_num').text(`${customers.length}`);
                    }
                    else {
                        chart_revenue.updateOptions({
                            series: [{
                                name: 'Doanh Thu',
                                data: renderData_LineRevenue_Month(revenue),
                            }],
                            xaxis: {
                                show: false,
                                trim: false,
                                categories: createArray(6),
                                stroke: {
                                    show: false,
                                },
                            },
                        })
                        var textRevenue = sumRevenue == 0 ? `${formatMoneyViet(sumRevenue)}đ` : `${formatMoneyViet(sumRevenue)}.000đ`
                        $('.sum_revenue').text(textRevenue);
                    }
                }
            }

            const dropDown_TimeBooked = document.querySelector('.dropdown__listTimeBooked')
            const item_time_customer = document.querySelectorAll('.item_customer-chart_time');
            const item_time_revenue = document.querySelectorAll('.item_revenue-chart_time')
            const spans_time_customer = document.querySelectorAll('.item_customer-chart_time span');
            const spans_time_revenue = document.querySelectorAll('.item_revenue-chart_time span');
            var indexPreTime_customer = 0;

            item_time_customer.forEach((item, index) => {
                item.onclick = async () => {
                    item_time_customer[indexPreTime_customer].classList.remove('selected')
                    item.classList.add('selected')
                    indexPreTime_customer = index;
                    switch (index) {
                        case 0:
                            currentWeek();
                            $('.customer-time_text').text(`${spans_time_customer[index].textContent.trim()}`)
                            await renderChart_customer_currentWeek(0);
                            break;
                        case 1:
                            lastweek();
                            $('.customer-time_text').text(`${spans_time_customer[index].textContent.trim()}`)
                            await renderChart_customer_lastweek(0);
                            break;
                        case 2:
                            currentMonth();
                            $('.customer-time_text').text(`${spans_time_customer[index].textContent.trim()}`)
                            await renderChart_customer_currentMonth(0);
                            break;
                        case 3:
                            threeMonth();
                            $('.customer-time_text').text(`${spans_time_customer[index].textContent.trim()}`)
                            await renderChart_customer_lastThreeMonth(0);
                            break;
                        case 4:
                            sixMonth();
                            $('.customer-time_text').text(`${spans_time_customer[index].textContent.trim()}`)
                            await renderChart_customer_sixThreeMonth(0);
                            break;
                    }
                }
            })

            var indexPreTime_revenue = 0;

            item_time_revenue.forEach((item, index) => {
                item.onclick = async () => {
                    item_time_revenue[indexPreTime_revenue].classList.remove('selected')
                    item.classList.add('selected')
                    indexPreTime_revenue = index;
                    switch (index) {
                        case 0:
                            currentWeek();
                            sumRevenue = 0;
                            $('.revenue-time_text').text(`${spans_time_revenue[index].textContent.trim()}`)
                            await renderChart_customer_currentWeek(1);
                            break;
                        case 1:
                            lastweek();
                            sumRevenue = 0;
                            $('.revenue-time_text').text(`${spans_time_revenue[index].textContent.trim()}`)
                            await renderChart_customer_lastweek(1);
                            break;
                        case 2:
                            currentMonth();
                            sumRevenue = 0;
                            $('.revenue-time_text').text(`${spans_time_revenue[index].textContent.trim()}`)
                            await renderChart_customer_currentMonth(1);
                            break;
                        case 3:
                            threeMonth();
                            sumRevenue = 0;
                            $('.revenue-time_text').text(`${spans_time_revenue[index].textContent.trim()}`)
                            await renderChart_customer_lastThreeMonth(1);
                            break;
                        case 4:
                            sixMonth();
                            sumRevenue = 0;
                            $('.revenue-time_text').text(`${spans_time_revenue[index].textContent.trim()}`)
                            await renderChart_customer_sixThreeMonth(1);
                            break;
                    }
                }
            })

            function renderData_LineCustomer(data) {
                var arr = []
                for (var i = firstDay; i <= lastDay; i.setDate(i.getDate() + 1)) {
                    var count = 0;
                    data.forEach(item => {
                        var date = new Date(item.DateCreate);
                        if (date.getDate() == i.getDate()) count++
                    })
                    arr.push(count);
                }
                return arr;
            }

            function getDaysInMonth(month, year, data, data_bill) {
                var i = 0
                var date = new Date(year, month, 1);
                var days = [
                ];
                while (date.getMonth() === month) {
                    var haveData = false;
                    data.forEach(item => {
                        var haveRevenue = false;
                        var dateData = new Date(item.DateBook);
                        if (date.getDate() == dateData.getDate()) {
                            data_bill.forEach(bill => {
                                var dateData_bill = new Date(bill.DateCreate);
                                if (dateData_bill.getDate() == dateData.getDate()) {
                                    days.push({
                                        x: date.getTime(),
                                        y: item.count,
                                        payment_book: bill.sum,
                                    });
                                    haveRevenue = true;
                                }
                            })
                            if (!haveRevenue) {
                                days.push({
                                    x: date.getTime(),
                                    y: item.count,
                                    payment_book: 0,
                                });
                            }
                            haveData = true;
                        }

                    })
                    if (!haveData) {
                        days.push({
                            x: date.getTime(),
                            y: 0,
                            payment_book: 0,
                        });
                    }
                    date.setDate(date.getDate() + 1);
                    i++;
                }
                return days;
            }

            function renderData_LineCustomer_Month(data) {
                var arr = [];
                var date = firstDay;

                while (date.getMonth() != lastMonth + 1) {
                    var count = 0;
                    data.forEach(item => {
                        var dateData = new Date(item.DateCreate);
                        if (dateData.getMonth() == date.getMonth()) count++;
                    })
                    date.setMonth(date.getMonth() + 1)
                    arr.push(count);
                }
                return arr;
            }
            var countRenderReve = 0;
            function renderData_LineRevenue(data) {
                var arr = []
                if (countRenderReve == 0) {
                    currentWeek();
                    countRenderReve = 1;
                }
                for (var i = firstDay; i <= lastDay; i.setDate(i.getDate() + 1)) {
                    var sum = 0;
                    data.forEach(item => {
                        var date = new Date(item.DateCreate);
                        if (date.getDate() == i.getDate()) sum = item.sum;
                    })
                    arr.push(sum);
                    sumRevenue += sum;
                }
                return arr;
            }

            function renderData_LineRevenue_Month(data) {
                var arr = [];
                var date = firstDay;
                while (date.getMonth() != lastMonth + 1) {
                    var sum = 0;
                    data.forEach(item => {
                        var dateData = new Date(item.DateCreate);
                        if (dateData.getMonth() == date.getMonth()) sum += item.sum;
                    })
                    date.setMonth(date.getMonth() + 1)
                    arr.push(sum);
                    sumRevenue += sum;
                }
                return arr;
            }

            function createArray(length) {
                var arr = []
                for (var i = 0; i < length; i++) {
                    arr.push('');
                }
                return arr;
            }



            function renderTimeBooked(start_end) {
                var start = start_end.min;
                var end = start_end.max;
                var dateStart = new Date(start);
                var dateEnd = new Date(end);
                dateStart.setDate(1);
                dateEnd.setDate(1);
                var html = ``;
                while (dateEnd >= dateStart) {
                    html += `<li style="padding-left:20px;" data-month = ${dateEnd.getMonth() + 1} 
                    data-year =${dateEnd.getFullYear()} 
                    class="el-select-dropdown__item adm-select-option item_time_booked">
                    <span>${(dateEnd.getMonth() + 1)}/${dateEnd.getFullYear()}</span>
                </li>`
                    dateEnd.setMonth(dateEnd.getMonth() - 1);
                }
                dropDown_TimeBooked.innerHTML = html
            }

            function checkBooked(check) {
                var item_TimeBooked = document.querySelectorAll('.item_time_booked');
                const spans_timeBooked = document.querySelectorAll('.item_time_booked span');
                var haveTime = false;
                item_TimeBooked.forEach((item, index) => {
                    if (spans_timeBooked[index].textContent.trim() == check) {
                        item.classList.add('selected');
                        indexTimePre_booked = index;
                        haveTime = true
                    }
                })
                return haveTime;
            }


            function formatMoneyViet(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }

            const elPager = document.querySelector('.el-pager')
            const btnPre = document.querySelector('.btn-prev')
            const btnNext = document.querySelector('.btn-next')
            var itemNumber;

            function dateFormat(date) {
                var date = new Date(date);
                var nameMonth = nameVietOfMonth(date.getMonth() + 1)
                var day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
                return `${day} ${nameMonth}, ${date.getFullYear()}`
            }

            function timeFormat(hour, minute) {
                var hour = hour > 9 ? hour : `0${hour}`;
                var minute = minute > 9 ? minute : `0${minute}`;
                return `${hour}:${minute}`
            }

            function renderPager(totalPage) {
                var html = ``;
                var indexDots;
                var haveDots = false;
                for (var i = 1; i <= totalPage; i++) {
                    if (i == 1) {
                        html += `<li class="number active" data-page = ${i}>
                    ${i}</li>`
                    } else if (i < 4) {
                        html += `<li class="number" data-page = ${i}>
                        ${i}</li>`
                    }
                    else if (i == 4) {
                        html += `<li class="number" data-page = ${i}>...</li>`
                    }
                    else if (i == totalPage) html += `<li class="number" data-page = ${i}> ${i}</li>`
                }
                elPager.innerHTML = html;
                itemNumber = document.querySelectorAll('.number');
            }

            var indexPrePage = 0;

            var pageCurrent = 1;
            var totalPage_var;

            function clickPageNumber(numberItem) {
                numberItem.forEach((item, index) => {
                    item.onclick = async () => {
                        if (!item.classList.contains('active')) {
                            if (await renderHistoryBook(item.getAttribute('data-page'), 1) == 'success') {
                                pageCurrent = item.getAttribute('data-page')
                                numberItem[indexPrePage].classList.remove('active');
                                item.classList.add('active');
                                indexPrePage = index;
                            }
                            if (pageCurrent == totalPage_var) {
                                btnNext.disabled = true;
                            }
                            else {
                                btnNext.disabled = false;
                            }

                            if (pageCurrent == 1) {
                                btnPre.disabled = true;
                            } else {
                                btnPre.disabled = false;
                            }
                        }
                    }
                })
            }

            btnNext.onclick = async () => {
                itemNumber = document.querySelectorAll('.number');
                if (pageCurrent == totalPage_var) {

                }
                else {
                    pageCurrent++;
                    renderHistoryBook(pageCurrent, 1)
                    itemNumber[indexPrePage].classList.remove('active');
                    itemNumber[pageCurrent - 1].classList.add('active');
                    indexPrePage = pageCurrent - 1;
                    if (pageCurrent == totalPage_var) {
                        btnNext.disabled = true;
                    }

                    if (pageCurrent == 1) {
                        btnPre.disabled = true;
                    } else {
                        btnPre.disabled = false;
                    }
                }
            }

            btnPre.disabled = true;



            btnPre.onclick = async () => {
                itemNumber = document.querySelectorAll('.number');
                if (pageCurrent == 1) {

                }
                else {
                    pageCurrent--;
                    renderHistoryBook(pageCurrent, 1)
                    itemNumber[indexPrePage].classList.remove('active');
                    itemNumber[pageCurrent - 1].classList.add('active');
                    indexPrePage = pageCurrent - 1;
                    if (pageCurrent == 1) {
                        btnPre.disabled = true;
                    }

                    if (pageCurrent == totalPage_var) {
                        btnNext.disabled = true;
                    }
                    else {
                        btnNext.disabled = false;
                    }

                }
            }

            const listHistoryBooked = document.querySelector('.list-history__booked')

            async function renderHistoryBook(page, choose) {
                const { status, bookedArr, totalPage } = await paginationApi(page);
                if (status == 'success') {
                    var html = ``;
                    totalPage_var = totalPage
                    if (totalPage_var == 0) {
                        $('.pagination-text').text(`Trang ${0} trên ${totalPage}`)
                        btnNext.disabled = true;
                        listHistoryBooked.style.width = '709px';
                    } else {
                        $('.pagination-text').text(`Trang ${page} trên ${totalPage}`)
                        if (choose == 0) {
                            renderPager(totalPage);
                            clickPageNumber(itemNumber);
                        }
                        bookedArr.forEach((item, index) => {
                            html += `<div class="adm-appointments-last-booked">
                            <div class="adm-appointments-last-booked__row loaded">
                                <div class="el-row is-align-middle el-row--flex"
                                    style="margin-left: -8px; margin-right: -8px;">
                                    <div class="adm-appointments-last-booked__time el-col el-col-5">
                                        <div class="el-row is-align-middle el-row--flex">
                                            <span>${dateFormat(item.DateBook)} ${timeFormat(item.HourStart, item.MinuteStart)}</span>
                                        </div>
                                    </div>
                                    <div class="el-col el-col-7"
                                        style="padding-left: 8px; padding-right: 8px;">
                                        <div class="el-row is-align-middle el-row--flex">
                                            <span>${item.PhoneCustomer}</span>
                                        </div>
                                    </div>
                                    <div class="el-col el-col-5"
                                        style="padding-left: 8px; padding-right: 8px;">
                                        <p class="flex-center">
                                            <span class="overflow-ellipsis semi-bold">${item.StatusBook}</span>
                                        </p>
                                    </div>
                                    <div class="el-col el-col-7"
                                        style="padding-left: 8px; padding-right: 8px;">
                                        <p class="flex-center">
                                            <span class="overflow-ellipsis semi-bold">${formatMoneyViet(item.Payment)}.000đ</span>
                                        </p>
                                    </div>
                                    <div class="el-col el-col-2"
                                        style="padding-left: 8px; padding-right: 8px;">
                                        <div class="el-row el-row--flex">
                                            <div class="el-tooltip">
                                                <div
                                                    class="el-row is-justify-center is-align-middle el-row--flex">
                                                    <div style="background-image: url(${item.PathImgStaff});color: rgb(19, 150, 110);"
                                                        class="adm-avatar size-32 mt-0 ml-0">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                
                        </div>`
                        })

                        listHistoryBooked.innerHTML = html
                    }

                    return `success`
                }

            }

            // handle account

            const infoBtn = document.querySelector('.info-manager');
            const upload_element = document.querySelector('.avatar-uploader');
            const upload_input = document.querySelector('.el-upload__input');
            const upload_dragger = document.querySelector('.el-upload-dragger');
            const clearImg_upload = document.querySelector('.avatar-uploader__trash');
            var haveImg = false;
            var isUpload = false;

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
                    haveImg = true;
                    clearImg_upload.style.display = 'block';
                    successInputCategory(0, '');
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

            infoBtn.addEventListener('click', async () => {
                $('#info-manager__modal').modal('show');
                const { status, employee } = await getInfoEmployee(idEmployee);
                if (status === 'success') {
                    const info = employee[0];
                    $('#input-surname-employee').val(info.SurName)
                    $('#input-name-employee').val(info.NameStaff)
                    $('#input-cccd-employee').val(info.CCCD)
                    $('#input-email-employee').val(info.Email)
                    $('#input-phone-employee').val(info.Phone)
                    upload_dragger.innerHTML = `
            <div class="uploaded-photo-preview">
                <img src="${info.PathImgStaff}" alt="">
            </div>
            `
                    haveImg = true;
                    clearImg_upload.style.display = 'block';
                    isUpload = false;
                }
            })


            const btnSaveEdit = document.querySelector('#adm-btn-employee');
            const inputSurName = document.getElementById('input-surname-employee');
            const inputNameEmployee = document.getElementById('input-name-employee');
            const inputCCCD = document.querySelector('#input-cccd-employee');
            const inputEmail = document.querySelector('#input-email-employee');
            const inputPhone = document.querySelector('#input-phone-employee');

            inputSurName.oninput = () => {
                if (inputSurName.value == "") {
                    errInputCategory(1, 'Bạn vui lòng nhập họ')
                }
                else {
                    successInputCategory(1, '')
                }
            }
            inputNameEmployee.oninput = () => {
                if (inputNameEmployee.value == "") {
                    errInputCategory(2, 'Bạn vui lòng nhập tên')
                }
                else {
                    successInputCategory(2, "")
                }
            }
            inputCCCD.oninput = () => {
                if (inputCCCD.value == "") {
                    errInputCategory(3, 'Bạn vui lòng nhập CCCD/CMND')
                }
                else {
                    successInputCategory(3, '')
                }
            }
            inputEmail.oninput = () => {
                if (inputEmail.value == "") {
                    errInputCategory(4, 'Bạn vui lòng nhập Email')
                }
                else {
                    successInputCategory(4, '')
                }
            }
            inputPhone.oninput = () => {
                if (inputPhone.value == "") {
                    errInputCategory(5, 'Bạn vui lòng nhập số điện thoại')
                }
                else {
                    successInputCategory(5, '')
                }
            }


            const formEditManager = document.getElementById('editManagerForm')
            const inputManager = document.querySelector('[name=idManager]')

            btnSaveEdit.addEventListener('click', async (e) => {
                e.preventDefault();
                var flag = 0;

                if (inputSurName.value == '') {
                    errInputCategory(1, 'Bạn vui lòng nhập họ')
                } else {
                    successInputCategory(1, '')
                    flag = 1;
                }

                if (inputNameEmployee.value == '') {
                    errInputCategory(2, 'Bạn vui lòng nhập tên')
                } else {
                    successInputCategory(2, '')
                    if (flag == 1) flag = 2
                }

                if (inputCCCD.value == '') {
                    errInputCategory(3, 'Bạn vui lòng nhập CCCD/CMND')
                } else {
                    if (inputCCCD.value.length == 12 || inputCCCD.value.length == 9) {
                        successInputCategory(3, '')
                        if (flag == 2) flag = 3
                    }
                    else {
                        errInputCategory(3, 'Bạn vui lòng nhập đúng định dạng CCCD/CMND')
                    }
                }

                if (inputEmail.value == "") {
                    errInputCategory(4, 'Bạn vui lòng nhập email')
                } else {
                    if (validateEmail(inputEmail.value)) {
                        successInputCategory(4, '')
                        if (flag == 3) flag = 4
                    } else {
                        errInputCategory(4, 'Bạn vui lòng nhập đúng định dạng email')
                    }
                }

                if (inputPhone.value == "") {
                    errInputCategory(5, 'Bạn vui lòng nhập số điện thoại của nhân viên này')
                }
                else {
                    if (validatePhone(inputPhone.value)) {
                        successInputCategory(5, '')
                        if (flag == 4) flag = 5
                    } else {
                        errInputCategory(5, 'Bạn vui lòng nhập đúng số điện thoại')
                    }
                }

                if (haveImg) {
                    successInputCategory(0, '')
                    if (flag == 5) flag = 6
                }
                else {
                    errInputCategory(0, 'Chọn ảnh đại diện')
                }

                if (flag == 6) {
                    if (isUpload) {
                        inputManager.value = idEmployee;
                        formEditManager.submit();
                    }
                    else {
                        inputSurName
                        inputNameEmployee
                        inputCCCD
                        inputEmail
                        inputPhone
                        const { status } = await editManager_withoutImg(idEmployee,
                            inputSurName.value.trim(),
                            inputNameEmployee.value.trim(),
                            inputPhone.value.trim(),
                            inputEmail.value.trim(),
                            inputCCCD.value.trim(),
                        )
                        if (status === 'success') {
                            $('#info-manager__modal').modal('hide');
                            $('.name-manager').text(`${inputSurName.value.trim()} ${inputNameEmployee.value.trim()}`)
                            launch_toast('Cập nhật thông tin thành công');
                            window.localStorage.setItem('name-manager', `${inputSurName.value.trim()} ${inputNameEmployee.value.trim()}`)
                        }
                    }
                }

            })

            function launch_toast(mess) {
                var x = document.getElementById("toast")
                x.className = "show";
                x.textContent = '';
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
                setTimeout(function () { x.textContent = mess }, 700);
            }


            // const btnChangePass = document.querySelector('.')

            const logOutBtn = document.querySelector('.log-out__manager')

            logOutBtn.onclick = () => {
                window.localStorage.clear();
                window.location = '/'
            }

            // get API

            async function editManager_withoutImg(idManager, surname, name_employee, phone, email, cccd) {
                return (await instance.post('employee/edit-manager-without-img', {
                    idManager,
                    surname,
                    name_employee,
                    phone,
                    email,
                    cccd,
                })).data;
            }
            async function getInfoEmployee(idEmployee) {
                return (await instance.post('employee/info-employee', {
                    idEmployee
                })).data;
            }

            async function getPerformance_Service(firstDate, lastDate) {
                return (await instance.post('dashboard-manager/perfomance-service', {
                    firstDate,
                    lastDate,
                    idStore,
                })).data
            }

            async function getPerformance_Employee(firstDate, lastDate) {
                return (await instance.post('dashboard-manager/perfomance-employee', {
                    firstDate,
                    lastDate,
                    idStore,
                })).data
            }

            async function paginationApi(page_number) {
                return (await instance.post('dashboard-manager/pagination', {
                    page_number,
                    idStore,
                })).data
            }

            async function getCountCustomer(firstDate, lastDate, dateString_oldCustomer) {
                return (await instance.post('dashboard-manager/count-customer', {
                    dateString_oldCustomer,
                    firstDate,
                    lastDate,
                    idStore,
                })).data
            }

            async function getBook_Revenue(firstDate, lastDate, dateString_oldCustomer) {
                return (await instance.post('dashboard-manager/book-revenue', {
                    dateString_oldCustomer,
                    firstDate,
                    lastDate,
                    idStore,
                })).data
            }

            async function getCustomerCurrentWeek(firstDate, lastDate) {
                return (await instance.post('dashboard-manager/customer-revenue-currentweek', {
                    firstDate,
                    lastDate,
                    idStore,
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

