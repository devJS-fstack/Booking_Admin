navheader.style.display = 'none'


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
    labels: ['Khách hàng mới', 'Khách hàng cũ'],
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


function nameDayOfMonth(number) {
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
    return `${date.getDate()} ${nameDayOfMonth(date.getMonth() + 1)}, ${date.getFullYear()}`
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
    first = curr.getDate() - (dayNumber) - 7;
    last = first + 6;
    firstDay = new Date(curr.setDate(first));
    lastDay = new Date(curr.setDate(last));
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
    const { status, customers, revenue } = await getCustomerCurrentWeek(firstDateString, lastDateString);
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
    }


    // month-book current
    var datecurr = new Date();
    var firstDate = new Date(datecurr.getFullYear(), datecurr.getMonth(), 1);
    var lastDate = new Date(datecurr.getFullYear(), datecurr.getMonth() + 1, 0);
    var firstDateString_book = `${firstDate.getFullYear()}-${firstDate.getMonth() + 1}-${firstDate.getDate()}`
    var lastDateString_book = `${lastDate.getFullYear()}-${lastDate.getMonth() + 1}-${lastDate.getDate()}`
    const { status_b, data, data_bill, count_bookSuccess, count_bookPending } = await getBook_Revenue(firstDate, lastDate)
    if (status_b == 'success') {
        console.log(count_bookSuccess, count_bookPending)
        $('.booking_pendding').text(count_bookPending);
        $('.booking_success').text(count_bookSuccess);
        chart_booked.updateOptions({
            series: [{
                name: '',
                data: getDaysInMonth(4, 2022, data, data_bill)
            },
            ],
        })
    }
})

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
    for (var i = first; i <= last; i++) {
        var count = 0;
        data.forEach(item => {
            var date = new Date(item.DateCreate);
            if (date.getDate() == i) count++
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

function renderData_LineRevenue(data) {
    var arr = []
    for (var i = first; i <= last; i++) {
        var sum = 0;
        data.forEach(item => {
            var date = new Date(item.DateCreate);
            if (date.getDate() == i) sum = item.sum;
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
            if (dateData.getMonth() == date.getMonth()) sum = item.sum;
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







function formatMoneyViet(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


// get API

async function getBook_Revenue(firstDate, lastDate) {
    return (await instance.post('dashboard-manager/book-revenue', {
        firstDate,
        lastDate
    })).data
}

async function getCustomerCurrentWeek(firstDate, lastDate) {
    return (await instance.post('dashboard-manager/customer-revenue-currentweek', {
        firstDate,
        lastDate
    })).data
}