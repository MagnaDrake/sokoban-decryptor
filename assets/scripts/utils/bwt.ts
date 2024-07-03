const eof = "z";

function encodeCompFunc(x, y) {
  //@ts-ignore
  return (x[1] > y[1]) - (x[1] < y[1]);
}

function decodeCompFunc(x, y) {
  //@ts-ignore
  return (x > y) - (x < y);
}

function getSuffixArray(input_text, len_text) {
  let suff = [];
  for (let i = 0; i < len_text; i++) {
    suff.push([i, input_text.slice(i)]);
  }
  suff.sort(encodeCompFunc);
  let suffix_arr = suff.map((item) => item[0]);
  return suffix_arr;
}

function findLast(input_text, suffix_arr, n) {
  let bwt_arr = "";
  for (let i = 0; i < n; i++) {
    let j = suffix_arr[i] - 1;
    if (j < 0) {
      j = j + n;
    }
    bwt_arr += input_text[j];
  }
  return bwt_arr;
}

export function encodeBWT(input) {
  const append = input.concat(eof);
  const suf = getSuffixArray(append, append.length);
  return findLast(append, suf, append.length);
}

export function decodeBWT(input) {
  const bwtChars = input.split("");
  const col = Array(input.length).fill("");

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      let string = col[j];
      string = bwtChars[j].concat(string);
      col[j] = string;
    }
    col.sort(decodeCompFunc);
  }

  let decode;
  for (let i = 0; i < col.length; i++) {
    if (col[i].charAt(col[i].length - 1) === eof) {
      decode = col[i].slice(0, -1);
    }
  }

  return decode;
}
