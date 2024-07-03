const eof = "~";

function encode_cmp_func(x, y) {
  //@ts-ignore
  return (x[1] > y[1]) - (x[1] < y[1]);
}

function decode_cmp_func(x, y) {
  //@ts-ignore
  //console.log(x,y)
  return (x > y) - (x < y);
}

//Takes text to be transformed and its length as arguments
//and returns the corresponding suffix array

function compute_suffix_array(input_text, len_text) {
  let suff = [];
  for (let i = 0; i < len_text; i++) {
    suff.push([i, input_text.slice(i)]);
  }
  suff.sort(encode_cmp_func);
  let suffix_arr = suff.map((item) => item[0]);
  return suffix_arr;
}
// Takes suffix array and its size as arguments
// and returns the Burrows-Wheeler Transform of given text
function find_last_char(input_text, suffix_arr, n) {
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
// Driver program to test functions above

/*
function inverseBWT (string s)
    create empty table
    repeat length(s) times
        // first insert creates first column
        insert s as a column of table before first column of the table
        sort rows of the table alphabetically
    return (row that ends with the 'EOF' character)
*/
export function encodeBWT(input) {
  const append = input.concat(eof);
  const suf = compute_suffix_array(append, append.length);
  return find_last_char(append, suf, append.length);
}

export function decodeBWT(input) {
  const bwtChars = input.split("");
  console.log(bwtChars);
  const col = Array(input.length).fill("");

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      let string = col[j];
      string = bwtChars[j].concat(string);
      console.log(string);
      col[j] = string;
    }
    col.sort(decode_cmp_func);
  }

  let decode;
  for (let i = 0; i < col.length; i++) {
    if (col[i].charAt(col[i].length - 1) === "~") console.log(col[i]);
    decode = col[i];
  }

  return decode.slice(0, -1);
}
