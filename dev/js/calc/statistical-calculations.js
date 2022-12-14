import { sprintf } from 'sprintf-js';
import { chartModule } from './chart.module';

/** Entrada dos Dados **/
let valores = document.getElementById('textCalc');
let btnCalc = document.getElementById('btnCalc');
let btnReset = document.getElementById('resetActuario');
let graphVals = {
  intervals: [],
  fi: [],
  xi: [],
  fac: [],
  mediaIntervalsH: 0
}

btnReset.addEventListener('click', cleanApp);

btnCalc.addEventListener('click', () => {
  let exprRegular = /([A-Za-z_])/;

  if (exprRegular.test(valores.value)) {
    M.toast({ html: 'Somente números e espaços!' });
    return;
  }

  if (valores.value.length <= 0) {
    M.toast({ html: 'Insira um valor válido!' });
    return;
  }

  let inputVals = valores.value.trim().split(/\s+/).map(Number);
  let sortedVals = inputVals.slice(0).sort((a, b) => {
    return parseInt(a || 0, 10) - parseInt(b || 0, 10);
  });

  frequencyModule(inputVals);
  chartModule(graphVals);
  infoModule(sortedVals);
  showContents(true);

  graphVals = {
    intervals: [],
    fi: [],
    xi: [],
    fac: [],
    mediaIntervalsH: 0
  }
});

/** Gera a Tabela **/
function frequencyModule(vals) {
  let totalSum = vals.reduce((a, b) => { return a + b });
  let intervals = calcIntervals(vals);
  let acumulatedFrequency = 0;
  let arrIntervals = [];

  let tableInfo = intervals.map((interval) => {
    let min = interval.min, max = interval.max;
    arrIntervals.push(min);
    arrIntervals.push(max);
    return {
      interval: sprintf('%03d ├─ %03d', min, max),
      midPoint: (min + max) / 2,
      frequency: vals.map((n) => {
        return (n < max && n >= min) ? 1 : 0;
      }).reduce((a, b) => {
        return a + b;
      })
    };
  });

  graphVals.intervals.push(filterAndSort(arrIntervals));

  let totalFrequency = tableInfo.map((num) => {
    return num.frequency;
  }).reduce((a, b) => { return a + b; });

  tableInfo.map((e) => {
    let frequencyPercent = Math.min(e.frequency * 100 / totalFrequency, 100.0);
    acumulatedFrequency += e.frequency;
    let acumulatedFrequencyPercent = Math.min(acumulatedFrequency * 100 / totalFrequency, 100);

    return $.extend(e, {
      frequencyPercent: frequencyPercent,
      acumulatedFrequency: acumulatedFrequency,
      acumulatedFrequencyPercent: acumulatedFrequencyPercent
    });
  });

  let tableHTML = [];

  for (let tableRow of tableInfo) {
    graphVals.fi.push(tableRow.frequency);
    graphVals.xi.push(tableRow.midPoint);
    graphVals.fac.push(tableRow.acumulatedFrequency);

    tableHTML.push(sprintf(`
    <tr>
      <td>%3s</td>
      <td>%3d</td>
      <td>%3s</td>
      <td>%d</td>
      <td>%.2f</td>
      <td>%.2f</td>
    </tr>
    `, tableRow.interval,
      tableRow.frequency,
      tableRow.midPoint,
      tableRow.acumulatedFrequency,
      tableRow.frequencyPercent,
      tableRow.acumulatedFrequencyPercent
    ));
  }

  tableHTML.push(sprintf(`
    <tr>
      <td><b>Total</b> %d</td>
      <td>%d</td>
      <td>-</td>
      <td>-</td>
      <td>%.2f</td>
      <td>-</td>
    </tr>
  `, totalSum, totalFrequency, 100.0));

  document.getElementById('frequencyTableBody').innerHTML = tableHTML.join("\n");
}

function calcIntervals(vals) {
  let intervals = vals.slice(0).sort((a, b) => {
    return parseInt(a || 0, 10) - parseInt(b || 0, 10);
  });
  let maxNum = intervals[intervals.length - 1];
  let minNum = intervals[0];
  let groupCount = Math.round(1 + 3.22 * Math.log10(intervals.length));
  let groupLength = (maxNum - minNum) / groupCount;
  groupLength = parseInt(groupLength) + 1;
  graphVals.mediaIntervalsH = groupLength;
  let result = [], n = minNum;

  for (let i = 0; i < groupCount; i++) {
    result[i] = { min: Math.round(n), max: Math.round(Math.min(n + groupLength)) }
    n += groupLength;
  }

  return result;
}

function filterAndSort(arr) {
  arr = arr.filter((elem, index, self) => {
    return index == self.indexOf(elem);
  });

  return arr.sort((a, b) => { return a - b; });
}

/** Cálculos Estatísticos **/
function infoModule(vals) {
  let media = calculaMediaAritmetica(vals);
  let desvios = calculaDesvios(vals, media);
  vals = vals || [];

  document
    .getElementById('conjunto')
    .innerHTML = sprintf(` %s `, vals.join(', '));

  document
    .getElementById('media_aritmetica')
    .innerHTML = media;

  document
    .getElementById('media_geometrica')
    .innerHTML = calculaMediaGeometrica(vals);

  document
    .getElementById('mediana')
    .innerHTML = calculaMediana(vals);

  document
    .getElementById('moda')
    .innerHTML = calculaModa(vals);

  document
    .getElementById('desvio_populacional')
    .innerHTML = sprintf("%.2f", desvios.populacional);

  document
    .getElementById('variancia_populacional')
    .innerHTML = calculaVariaciaPopulacional(desvios.populacional);

  document
    .getElementById('desvio_amostral')
    .innerHTML = sprintf("%.2f", desvios.amostral);

  document
    .getElementById('variancia_amostral')
    .innerHTML = calculaVariaciaAmostral(desvios.amostral);

  document
    .getElementById('coeficiente_variacao_amostral')
    .innerHTML = calculaCoeficienteVariacaoAmostral(desvios.amostral, media)

  document
    .getElementById('coeficiente_variacao_populacional')
    .innerHTML = calculaCoeficienteVariacaoPopulacional(desvios.populacional, media);
}

function calculaDesvios(vals, media) {
  let cals = vals.map(num => Math.abs(num - media) ** 2.0).reduce((a, b) => a + b);

  return { populacional: (cals / vals.length) ** 0.5, amostral: (cals / (vals.length - 1)) ** 0.5 }
}

function calculaVariaciaAmostral(desvio) {
  return sprintf(`%.2f`, Math.pow(desvio, 2));
}

function calculaVariaciaPopulacional(desvio) {
  return sprintf(`%.2f`, Math.pow(desvio, 2));
}

function calculaCoeficienteVariacaoAmostral(desvio, media) {
  return sprintf(`%.2f`, desvio / media * 100.0);
}

function calculaCoeficienteVariacaoPopulacional(desvio, media) {
  return sprintf(`%.2f`, desvio / media * 100.0);
}

function calculaMediaAritmetica(vals) {
  return sprintf(`%.2f`, vals.reduce((a, b) => { return a + b; }) / vals.length);
}

function calculaMediaGeometrica(vals) {
  let value = vals.reduce((a, b) => {
    return a * b;
  });

  return sprintf(`%.2f`, Math.pow(value, 1 / vals.length));
}

function calculaMediana(vals) {
  let mid = (Math.floor(vals.length / 2) + vals.length % 2) - 1;

  if (vals.length % 2 == 0) {
    return sprintf(`%.2f`, (vals[mid] + vals[mid + 1]) / 2);
  } else {
    return vals[mid];
  }
}

function calculaModa(vals) {
  let min = Math.min.apply(null, vals);
  let max = Math.max.apply(null, vals);
  let counted = [];
  let answer = [], maxModa = -1;

  for (var i = min; i <= max; i++) {
    counted[i] = { val: i, count: 0 };
  }

  for (let num of vals) {
    counted[num].count++;
  }

  let sortedCount = counted.sort((a, b) => {
    return a.count - b.count;
  }).reverse().filter((a) => {
    return a.hasOwnProperty('val');
  });

  if (sortedCount.length > 1) {
    for (let num of sortedCount) {
      if (num.count > 1 && num.count >= maxModa) {
        answer.push(num.val);
        maxModa = num.count;
      }
    }
  }

  return answer.length > 0 ? answer.join(', ') : 'Amodal';
}

function showContents(visible) {
  const $sections = $('.-sectionhidden');

  if (visible) {
    $sections.addClass('-hiddentovisible');
    setTimeout(() => {
      $sections.addClass('-visible');
    }, 150);
  } else {
    $sections.removeClass('-visible');
    setTimeout(() => {
      $sections.removeClass('-hiddentovisible');
    }, 150);
  }
}

function cleanApp() {
  const textCalc = $('#textCalc');
  textCalc.val('');
  textCalc.siblings().removeClass('active');

  showContents(false);

  graphVals = {
    intervals: [],
    fi: [],
    xi: [],
    fac: [],
    mediaIntervalsH: 0
  }

  M.toast({ html: 'Actuarĭu reiniciado!' });
}
