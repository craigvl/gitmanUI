module.exports = function (text, stop, clamp) {
  return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
}
