function Courses() {
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const values = () => {
    if (!CourseData) return new Array(12).fill(0);

    const monthValues = new Array(12).fill(0);

    CourseData.forEach((item) => {
      const monthIndex = item.month - 1;
      monthValues[monthIndex] = item.courseCount + monthValues[monthIndex];
    });

    return monthValues;
  };

  var ctx = document.getElementById("myAreaChart");
  var myLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Courses Created",
          lineTension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "rgba(78, 115, 223, 1)",
          pointRadius: 3,
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "rgba(78, 115, 223, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: values(),
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: { left: 10, right: 25, top: 25, bottom: 0 },
      },
      scales: {
        xAxes: [
          {
            gridLines: { display: false, drawBorder: false },
            ticks: { maxTicksLimit: 7 },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function (value) {
                return value; // just show numbers, remove $
              },
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2],
            },
          },
        ],
      },
      legend: { display: false },
    },
  });
}

function Orders() {
  function getWeekSatToSunLabels() {
    const labels = [];
    const today = new Date();
    const day = today.getDay();
    const diff = day === 6 ? 0 : day + 1;

    const saturday = new Date(today);
    saturday.setDate(today.getDate() - diff);

    const options = { weekday: "short" };

    for (let i = 0; i < 7; i++) {
      const d = new Date(saturday);
      d.setDate(saturday.getDate() + i);
      labels.push(d.toLocaleDateString("en-US", options));
    }

    return labels;
  }

  const values = () => {
    if (!orderData) return new Array(7).fill(0);

    const weekValue = new Array(7).fill(0);

    orderData.forEach((item) => {
      const monthIndex = item.dayOfWeek - 1;
      weekValue[monthIndex] = item.orderCount + weekValue[monthIndex];
    });

    return weekValue;
  };

  var ctx = document.getElementById("myAreaChartTwo");
  var myLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: getWeekSatToSunLabels(),
      datasets: [
        {
          label: "Courses Created",
          lineTension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "rgba(78, 115, 223, 1)",
          pointRadius: 3,
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "rgba(78, 115, 223, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: values(),
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: { left: 10, right: 25, top: 25, bottom: 0 },
      },
      scales: {
        xAxes: [
          {
            gridLines: { display: false, drawBorder: false },
            ticks: { maxTicksLimit: 7 },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function (value) {
                return value; // just show numbers, remove $
              },
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2],
            },
          },
        ],
      },
      legend: { display: false },
    },
  });
}

Courses();
Orders();
