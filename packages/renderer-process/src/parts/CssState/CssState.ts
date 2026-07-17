const state = {
  styleSheets: Object.create(null),
  texts: Object.create(null),
}

export const set = (id, sheet) => {
  state.styleSheets[id] = sheet
}

export const get = (id) => {
  return state.styleSheets[id]
}

export const setText = (id, text) => {
  state.texts[id] = text
}

export const getText = (id) => {
  return state.texts[id]
}

export const remove = (id) => {
  delete state.styleSheets[id]
  delete state.texts[id]
}
