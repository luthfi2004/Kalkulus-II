// Variabel global
var riilData = [];
var imaginerData = [];

function menghapusInputan() {
  location.reload();
}

function parseComplex(input) {
  const complexPart = /([+-]?\d+)\s*([+-]\s*\d*)i/g;
  const riilArr = [];
  const imaginerArr = [];
  let match;

  while ((match = complexPart.exec(input)) !== null) {
    const riilPart = parseInt(match[1].replace(/\s/g, ""), 10);
    const imaginerPart = parseInt(match[2].replace(/\s/g, ""), 10);
    riilArr.push(riilPart);
    imaginerArr.push(imaginerPart);
  }
  return { riilArr, imaginerArr };
}

function operasiInputan() {
  const input = document.getElementById("inputNumber").value.trim();
  const { riilArr, imaginerArr } = parseComplex(input);

  if (riilArr.length === 0 || imaginerArr.length === 0) {
    alert(
      "Format input tidak valid. Harap masukkan minimal 2 bilangan kompleks"
    );
    return;
  }

  let bilRiil = 0;
  let bilImaginer = 0;
  let operatorData = [];

  bilRiil = riilArr[0];
  bilImaginer = imaginerArr[0];
  riilData.push(bilRiil);
  imaginerData.push(bilImaginer);
  operatorData.push("");

  // Menggunakan regex untuk mencocokkan operator
  const operatorMatches = input.match(/[\+\-\*\/]\s*\(/g);

  for (let i = 1; i < riilArr.length; i++) {
    const currentRiil = riilArr[i];
    const currentImaginer = imaginerArr[i];
    // Mengambil operator dari hasil pencocokan regex
    const operationSymbol = operatorMatches[i - 1][0];

    if (operationSymbol === "+") {
      bilRiil += currentRiil;
      bilImaginer += currentImaginer;
    } else if (operationSymbol === "-") {
      bilRiil -= currentRiil;
      bilImaginer -= currentImaginer;
    } else if (operationSymbol === "*") {
      const tempRiil = bilRiil * currentRiil - bilImaginer * currentImaginer;
      const tempImaginer =
        bilRiil * currentImaginer + bilImaginer * currentRiil;
      bilRiil = tempRiil;
      bilImaginer = tempImaginer;
    } else if (operationSymbol === "/") {
      const denominator =
        currentRiil * currentRiil + currentImaginer * currentImaginer;
      if (denominator !== 0) {
        const tempRiil =
          (bilRiil * currentRiil + bilImaginer * currentImaginer) / denominator;
        const tempImaginer =
          (bilImaginer * currentRiil - bilRiil * currentImaginer) / denominator;
        bilRiil = tempRiil;
        bilImaginer = tempImaginer;
      } else {
        alert("Pembagian bilangan kompleks dengan nilai nol tidak bisa");
        return;
      }
    }

    riilData.push(currentRiil);
    imaginerData.push(currentImaginer);
    operatorData.push(operationSymbol);
  }

  const riilDisplay = riilData
    .map(
      (value, index) => `${index > 0 ? operatorData[index] + " " : ""}${value}`
    )
    .join(" ");
  const imaginerDisplay = imaginerData
    .map(
      (value, index) => `${index > 0 ? operatorData[index] + " " : ""}${value}`
    )
    .join(" ");

  displayhasilOperasi(input, riilDisplay, imaginerDisplay, bilRiil, bilImaginer);
  function displayhasilOperasi(input, riilDisplay, imaginerDisplay, bilRiil, bilImaginer) {
    var hasilOperasiDiv = document.getElementById("hasilOperasi");
    hasilOperasiDiv.innerHTML = `
    <h5> Penyelesaian Bilangan Kompleks: </h5>
    <p> ${input} </p>
    <p> (${riilDisplay}) (${imaginerDisplay}) </p>
    <p> ${bilRiil} ${bilImaginer >= 0 ? "+" : ""} ${bilImaginer}i </p>`;
  }

  // Plotly visualization
  const lineData = riilData.map((item, index) => ({
    x: [0, item],
    y: [0, imaginerData[index]],
    type: "scatter",
    mode: "markers + lines",
    name: "Bilangan Kompleks",
    hoverinfo: "none",
  }));

  const sumLineData = {
    x: [0, bilRiil],
    y: [0, bilImaginer],
    type: "scatter",
    mode: "markers + lines",
    name: "Bilangan Kompleks",
    hoverinfo: "none",
  };

  const dashedLinedOnXAxis = riilData.map((item, index) => ({
    x: [0, item],
    y: [imaginerData[index], imaginerData[index]],
    mode: "lines",
    line: { dash: "dash" },
  }));

  const dashedLinedOnYAxis = imaginerData.map((item, index) => ({
    x: [riilData[index], riilData[index]],
    y: [0, item],
    mode: "lines",
    line: { dash: "dash" },
  }));

  const dashedLineOnSumLineXAxis = {
    x: [0, bilRiil],
    y: [bilImaginer, bilImaginer],
    mode: "lines",
    line: { dash: "dash" },
  };

  const dashedLineOnSumLineYAxis = {
    x: [bilRiil, bilRiil],
    y: [0, bilImaginer],
    mode: "lines",
    line: { dash: "dash" },
  };

  var tampilan = {
    xaxis: {
      title: "bilangan riil",
    },
    yaxis: {
      title: "bilangan imaginer",
    },
  };
  Plotly.newPlot(
    "grafikArgand",
    [
      ...lineData,
      ...dashedLinedOnXAxis,
      ...dashedLinedOnYAxis,
      sumLineData,
      dashedLineOnSumLineXAxis,
      dashedLineOnSumLineYAxis,
    ],
    tampilan
  );
}
