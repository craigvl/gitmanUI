Array.prototype.unique = function (keyExtractor) {
  return this.reduce((a, c) => a.map(x => keyExtractor ? keyExtractor(x) : x).indexOf(keyExtractor ? keyExtractor(c) : c) >= 0 ? a : [...a, c], [])
}
Array.prototype.searchBy = function (fields, value) {
  return !value ? this : this.filter(_ => fields.reduce((a, c) => a || (_[c] && _[c].toLowerCase().match(value.toLowerCase())), false))
}

export const pipe = (...functions) => args => functions.reduce((arg, fn) => fn(arg), args)
