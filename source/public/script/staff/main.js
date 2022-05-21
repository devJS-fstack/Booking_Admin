navheader.style.display = 'none'

var options = {
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
        enabled: false,
        followCursor: false,
    },
    series: [{
        name: 'Khách hàng',
        data: [0, 0, 1, 0, 0, 0, 0]
    }],
    xaxis: {
        show: false,
        trim: false,
        categories: ["", "", "", "", "", "", ""],
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
        name: 'Haiz',
        data: getDaysInMonth(4, 2022)
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
                <span>${data.num_books}</span>
                <span class="dashboard-appointments-stats__tooltip__top__blue">${numberWithCommas(data.y * 1000)}đ</span>
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



function getDaysInMonth(month, year, s) {
    var values = [
        5, 3, 10, 9, 29, 19, 25, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5,
        2, 3, 8, 7, 22, 16, 23, 7, 11, 5, 12, 5, 10, 4, 15, 2, 6, 2
    ];
    var values2 = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
    ];
    var i = 0
    var date = new Date(year, month, 1);
    var days = [

    ];
    while (date.getMonth() === month) {
        days.push({
            x: date.getTime(),
            y: values[i],
            num_books: values2[i],
        });
        date.setDate(date.getDate() + 1);
        i++;
    }
    return days;
}


var chart_customer = new ApexCharts(document.querySelector("#chart_customer"), options);
var chart_revenue = new ApexCharts(document.querySelector("#chart_revenue"), options);
var chart_booked = new ApexCharts(document.querySelector("#chart_book"), options_booked);
var chart_bar = new ApexCharts(document.querySelector("#chart_bar"), options_bar);
chart_customer.render();
chart_revenue.render();
chart_booked.render();
chart_bar.render();


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}