navheader.style.display = 'none'

var options = {
    chart: {
        type: 'line',
        height: 'auto',
        zoom: {
            enabled: false
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
        categories: ["", "", "", "", "", "", ""],
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

var chart_customer = new ApexCharts(document.querySelector("#chart_customer"), options);
var chart_revenue = new ApexCharts(document.querySelector("#chart_revenue"), options);

chart_customer.render();
chart_revenue.render();