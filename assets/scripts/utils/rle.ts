// RLE algorithm taken from anurat
// https://github.com/anurat
export function encodeRLE(text: string): string {
  return (text.match(/([A-Z a-z])\1*/g) || [])
    .map((chars) => (chars.length === 1 ? chars : chars.length + chars[0]))
    .join("");
}

export function decodeRLE(code: string): string {
  return (code.match(/(\d+| |\w)/g) || [])
    .map((token, i, groups) =>
      isNaN(parseInt(token)) ? token : groups[i + 1].repeat(Number(token) - 1)
    )
    .join("");
}
