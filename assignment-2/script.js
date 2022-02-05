import { encode, initialHexToBin, finalBinToHex } from "./des.js";

String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substring(0, index) +
    replacement +
    this.substring(index + replacement.length)
  );
};

// function to generate 5 strings with Hamming Distance 1, where str is binary
function generateStringHD1(str) {
  let diff = [0, 1, 2, 3, 4];
  let result = [];
  for (let i = 0; i < 5; i++) {
    let newStr = str;
    let index = diff[i];
    // flip the bit at index
    newStr = newStr.replaceAt(index, newStr[index] === "0" ? "1" : "0");
    result.push(newStr);
  }
  return result;
}

// function to generate 5 strings with different Hamming Distances, where str is binary
function generateStringHDDifferent(str) {
  let hd = [[0], [0, 1], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4]];
  let result = [];
  for (let i = 0; i < hd.length; i++) {
    // generate a string with hd[i] bits different from str
    let newStr = str;
    let bitsIndex = hd[i];
    for (let j = 0; j < bitsIndex.length; j++) {
      let index = bitsIndex[j];
      // flip the bit at index
      newStr = newStr.replaceAt(index, newStr[index] === "0" ? "1" : "0");
    }
    result.push(newStr);
  }
  return result;
}

// Display the values of plain text, secret key and cipher text
function displayValues(plainTexts, secretKeys, cipherTexts) {
  document.getElementById("plainTextsBody").innerHTML = plainTexts
    .map(finalBinToHex)
    .join("<br>");
  document.getElementById("secretKeysBody").innerHTML = secretKeys
    .map(finalBinToHex)
    .join("<br>");
  document.getElementById("cipherTextsBody").innerHTML = cipherTexts
    .map(finalBinToHex)
    .join("<br>");

  // set the value of cipher text of original text
  document.getElementById("cipherText").value = finalBinToHex(cipherTexts[0]);
}

// Display the intermediate values of cipher text
function displayIntermediateValues(intermediateValues) {
  // for all the 5 texts taken
  intermediateValues.forEach((values, position) => {
    document.getElementById(`intermediate${position}`).innerHTML = values
      .map(finalBinToHex)
      .join("<br>");
  });
}

// Display the hamming distance
function displayHammingDistance(hammingDistances) {
  // for all the 5 texts taken
  hammingDistances.forEach((distances, position) => {
    // skip the first one (original text) as its hamming distance is 0
    if (position != 0) {
      document.getElementById(`hd${position}`).innerHTML =
        distances.join("<br>");
    }
  });
}

// Calculate hamming distance between the intermediate values and original values
function calculateHammingDistances(intermediateValues) {
  let fullResult = [];
  // for all the 5 texts taken
  intermediateValues.forEach((values, position) => {
    let result = [];
    // for all 16 rounds
    values.forEach((value, r) => {
      let hd = 0;
      for (let i = 0; i < 64; i++) {
        // checking if the bit at i is different from the 0th text, rth round, ith bit
        if (value[i] !== intermediateValues[0][r][i]) {
          hd++;
        }
      }
      result.push(hd);
    });
    fullResult.push(result);
  });
  return fullResult;
}

function displayPlot(hammingDistances) {
  let data = [];

  for (let round = 0; round <= 16; round++) {
    let result = [];
    // Pushing the hamming distance of each text, except the original text
    for (let i = 1; i <= 5; i++) {
      result.push(hammingDistances[i][round]);
    }
    data.push({
      y: result,
      type: "box",
      name: `Round ${round}`,
    });
  }

  let layout = {
    title: "Box Plot for Hamming Distance vs Round Number",
    xaxis: {
      title: "Round Number",
    },
    yaxis: {
      title: "Hamming Distance",
    },
    height: 650,
  };

  let config = {
    responsive: true,
  };

  Plotly.newPlot("plot", data, layout, config).then((gd) => {
    // calcdata is 2d
    // with length = # of traces on graph,
    var boxCalcData = gd.calcdata;

    var connectors = [];
    for (let i = 0; i < boxCalcData.length - 1; i++) {
      var box0 = boxCalcData[i][0];
      var box1 = boxCalcData[i + 1][0];

      // join the two adjacent boxes with a line
      connectors.push({
        type: "line",
        x0: box0.x,
        x1: box1.x,
        y0: box0.med,
        y1: box1.med,
      });
    }

    // add the connectors to the graph
    Plotly.relayout(gd, "shapes", connectors);
  });
}

// hide the solution
function hideSolutionDiv() {
  document.getElementById("solutionDiv").style.display = "none";
  // Also set the value of cipher text to empty
  document.getElementById("cipherText").value = "";
}

// show the solution
function showSolutionDiv() {
  document.getElementById("solutionDiv").style.display = "block";
}

// sanitize the inputs (i.e. make the inputs of exact length 16)
function sanitizeInputs() {
  let plainTextEl = document.getElementById("plainText");
  let secretKeyEl = document.getElementById("secretKey");

  if (plainTextEl.value.length > 16) {
    plainTextEl.value = plainTextEl.value.slice(0, 16);
  } else if (plainTextEl.value.length < 16) {
    plainTextEl.value = plainTextEl.value.padEnd(16, "0");
  }

  if (secretKeyEl.value.length > 16) {
    secretKeyEl.value = secretKeyEl.value.slice(0, 16);
  } else if (secretKeyEl.value.length < 16) {
    secretKeyEl.value = secretKeyEl.value.padEnd(16, "0");
  }
}

// when submit button is clicked
document.getElementById("submit").addEventListener("click", () => {
  // make sure that the inputs are of length 16
  sanitizeInputs();

  showSolutionDiv();

  // get input values
  let plainText = document.getElementById("plainText").value;
  let secretKey = document.getElementById("secretKey").value;

  // convert plain text and secret key to binary
  plainText = initialHexToBin(plainText);
  secretKey = initialHexToBin(secretKey);

  // get the operation type from radio button
  let operation = document.querySelector(
    'input[name="operation"]:checked'
  ).value;

  // create array plainTexts and secretKeys
  let plainTexts = [plainText];
  let secretKeys = [secretKey];

  // switch-case operation
  switch (operation) {
    case "1":
      // extend plainTexts with Hamming Distance 1
      plainTexts = plainTexts.concat(generateStringHD1(plainText));
      // push secretKey to secretKeys 5 times
      secretKeys = secretKeys.concat(Array(5).fill(secretKey));
      break;
    case "2":
      // extend plainTexts with different Hamming Distances
      plainTexts = plainTexts.concat(generateStringHDDifferent(plainText));
      // push secretKey to secretKeys 5 times
      secretKeys = secretKeys.concat(Array(5).fill(secretKey));
      break;
    case "3":
      // extend secretKeys with Hamming Distance 1
      secretKeys = secretKeys.concat(generateStringHD1(secretKey));
      // push plainText to plainTexts 5 times
      plainTexts = plainTexts.concat(Array(5).fill(plainText));
      break;
    default:
      break;
  }

  // create array of cipher texts
  let encodedValues = [];
  for (let i = 0; i < 6; i++) {
    encodedValues.push(encode(plainTexts[i], secretKeys[i]));
  }

  displayValues(
    plainTexts,
    secretKeys,
    encodedValues.map((obj) => obj.cipher)
  );
  displayIntermediateValues(encodedValues.map((obj) => obj.intermediates));

  let hammingDistances = calculateHammingDistances(
    encodedValues.map((obj) => obj.intermediates)
  );

  displayHammingDistance(hammingDistances);
  displayPlot(hammingDistances);
});

// Adding event listeners, so that for any change in text, the solution is hidden
let plainTextEl = document.getElementById("plainText");
let secretKeyEl = document.getElementById("secretKey");
let operationEl = document.getElementsByName("operation");

["input", "propertychange"].forEach((event) => {
  plainTextEl.addEventListener(event, hideSolutionDiv);
  secretKeyEl.addEventListener(event, hideSolutionDiv);

  // operation event handler
  operationEl.forEach((el) => {
    el.addEventListener(event, hideSolutionDiv);
  });
});

// Add event listener to plain text and secret key to allow only hexadecimal characters upto length 16
[plainTextEl, secretKeyEl].forEach((el) =>
  el.addEventListener("keypress", (e) => {
    if (e.key.match(/[^a-fA-F0-9]/g) || el.value.length >= 16) {
      e.preventDefault();
    }
  })
);
