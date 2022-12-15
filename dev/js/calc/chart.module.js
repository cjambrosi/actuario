let _chart1 = null;
let _chart2 = null;
let _chart3 = null;

export function chartModule(vals) {
  createHistogram(vals);
  createFrequencyPolygon(vals);
  createOgiva(vals);
}

function arrayReverse(vals) {
  let result = [];
  for (let x of vals) {
    result.push(x);
  }

  return result.reverse();
}

function createHistogram(vals) {
  let container = document.getElementById("histograma").getContext("2d");

  if (_chart1 === null) {
    _chart1 = new Chart(container, {
      type: "bar",
      data: {
        labels: vals.intervals[0].map(String),
        datasets: [
          {
            data: vals.fi,
            backgroundColor: vals.fi.map(function () {
              return "#616161";
            }),
            borderWidth: 0,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                barPercentage: 1.0,
                categoryPercentage: 1.0,
              },
            },
          ],
          xAxes: [
            {
              categoryPercentage: 1,
              barPercentage: 1,
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  } else {
    _chart1.destroy();
    _chart1 = null;
    createHistogram(vals);
  }
}

function createFrequencyPolygon(vals) {
  let container = document.getElementById("poligono_frequencia");
  let xi = vals.xi[0] - vals.mediaIntervalsH;
  let arrFirstPosition = xi > 0 ? xi : 0;
  let arrLastPosition = vals.xi[vals.xi.length - 1] + vals.mediaIntervalsH;

  vals.fi.unshift(0);
  vals.xi.unshift(arrFirstPosition);
  vals.fi.push(0);
  vals.xi.push(arrLastPosition);

  if (_chart2 === null) {
    _chart2 = new Chart(container, {
      type: "line",
      data: {
        labels: vals.xi.map(String),
        datasets: [
          {
            data: vals.fi,
            borderColor: "#616161",
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  } else {
    _chart2.destroy();
    _chart2 = null;
    createFrequencyPolygon(vals);
  }
}

function createOgiva(vals) {
  let container = document.getElementById("ogiva");
  let intervalo = vals.intervals[0][0] - vals.mediaIntervalsH;
  // let arrFirstPosition = intervalo > 0 ? intervalo : 0;

  vals.fac.unshift(0);
  // vals.intervals[0].unshift(arrFirstPosition);

  if (_chart3 === null) {
    _chart3 = new Chart(container, {
      type: "line",
      data: {
        labels: vals.intervals[0].map(String),
        datasets: [
          {
            data: vals.fac,
            borderColor: "#616161",
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  } else {
    _chart3.destroy();
    _chart3 = null;
    createOgiva(vals);
  }
}
