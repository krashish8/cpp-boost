/**
 * The main cipher function:
 *
 * Encipher/Decipher the text such that: A -> Z, B -> Y, ..., Z -> A.
 * Any characters other than the lowercase/uppercase english alphabets are left unchanged
 *
 * It is obvious that the same encoding algorithm can be used for decoding the text.
 *
 * @param {String} input The input plaintext or ciphertext
 * @return {String}      The corresponding ciphertext or plaintext
 */
function encodeOrDecode(input) {
  var output = "";

  // Iterate through the input
  for (var i = 0; i < input.length; i++) {
    // Get the character and corresponding ASCII character code
    var char = input.charAt(i);
    var ascii = char.charCodeAt();

    // Append to the output, depending on whether it is lowercase/uppercase
    if (char >= "a" && char <= "z") {
      output += String.fromCharCode(
        "a".charCodeAt() + ("z".charCodeAt() - ascii)
      );
    } else if (char >= "A" && char <= "Z") {
      output += String.fromCharCode(
        "A".charCodeAt() + ("Z".charCodeAt() - ascii)
      );
    } else {
      // If character is not an alphabet, then the output is unchanged
      output += char;
    }
  }
  return output;
}

const plainText = document.querySelector("#plainText");
const cipherText = document.querySelector("#cipherText");

const plainTextInfo = document.querySelector("#plainTextInfo");
const cipherTextInfo = document.querySelector("#cipherTextInfo");
const inputLabel = '<i class="fas fa-edit"></i> Input';
const outputLabel = '<i class="fas fa-angle-double-right"></i> Output';

/**
 * EVENT HANDLERS
 *
 * input: For detecting change in input
 * propertychange: For old browsers such as Internet Explorer
 */
["input", "propertychange"].forEach((event) => {
  // plainText event handler
  plainText.addEventListener(event, (e) => {
    cipherText.value = encodeOrDecode(e.target.value);
    plainTextInfo.innerHTML = inputLabel;
    cipherTextInfo.innerHTML = outputLabel;
  });
});

["input", "propertychange"].forEach((event) => {
  // cipherText event handler
  cipherText.addEventListener(event, (e) => {
    plainText.value = encodeOrDecode(e.target.value);
    cipherTextInfo.innerHTML = inputLabel;
    plainTextInfo.innerHTML = outputLabel;
  });
});
