const formatTime = (int) => {
  if (int < 10) {
    let pad = '0' + int.toString()
    return pad
  }
  return int
}

export default formatTime