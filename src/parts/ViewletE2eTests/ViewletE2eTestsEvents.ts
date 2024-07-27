export const handleClickAt = (event) => {
  const { clientX, clientY } = event
  return ['handleClickAt', clientX, clientY]
}

export const handleLoad = (event) => {
  return ['handleLoad']
}

export const returnValue = true
