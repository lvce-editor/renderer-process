import * as Assert from '../Assert/Assert.ts'
import * as IsEmptyString from '../IsEmptyString/IsEmptyString.ts'
import { VError } from '../VError/VError.ts'
import * as Vlq from '../Vlq/Vlq.ts'

const applyChunk = (state, chunk) => {
  const decodedChunk = Vlq.decode(chunk)
  state.currentColumn += decodedChunk[0]
  state.originalSourceFileIndex += decodedChunk[1]
  state.originalLine += decodedChunk[2]
  state.originalColumn += decodedChunk[3]
}

const findMappingInLine = (lineMapping, column, state) => {
  let index = -1
  state.currentColumn = 0
  while (true) {
    const newIndex = lineMapping.indexOf(',', index + 1)
    if (newIndex === -1) {
      throw new Error('no mapping found')
    }
    const chunk = lineMapping.slice(index + 1, newIndex)
    applyChunk(state, chunk)
    index = newIndex
    if (state.currentColumn >= column) {
      return {
        originalColumn: state.originalColumn,
        originalLine: state.originalLine + 1,
        originalSourceFileIndex: state.originalSourceFileIndex,
      }
    }
  }
}

const updateStateFromLineMappings = (lineMappings, state) => {
  if (IsEmptyString.isEmptyString(lineMappings)) {
    return
  }
  state.currentColumn = 0
  const chunks = lineMappings.split(',')
  for (const chunk of chunks) {
    applyChunk(state, chunk)
  }
}

const getColumnMapping = (mappings, line, column) => {
  Assert.string(mappings)
  Assert.number(line)
  Assert.number(column)
  let currentLine = 1
  const state = {
    currentColumn: 0,
    originalColumn: 0,
    originalLine: 0,
    originalSourceFileIndex: 0,
  }
  let index = 0

  while (index !== -1) {
    const newLineIndex = mappings.indexOf(';', index + 1)
    currentLine++
    const lineMappings = mappings.slice(index + 1, newLineIndex)
    if (currentLine === line) {
      return findMappingInLine(`${lineMappings},`, column, state)
    }
    updateStateFromLineMappings(lineMappings, state)
    index = newLineIndex
  }
  throw new Error(`no mapping found`)
}

export const getOriginalPosition = (sourceMap, line, column) => {
  try {
    Assert.object(sourceMap)
    Assert.string(sourceMap.mappings)
    Assert.array(sourceMap.sources)
    Assert.array(sourceMap.names)
    Assert.number(line)
    Assert.number(column)
    const { mappings, sources } = sourceMap
    if (!mappings) {
      throw new Error(`no source for line ${line} found`)
    }
    const { originalColumn, originalLine, originalSourceFileIndex } = getColumnMapping(mappings, line, column)
    const source = sources[originalSourceFileIndex]
    return {
      originalColumn,
      originalLine,
      source,
    }
  } catch (error) {
    throw new VError(error, `Failed to get original sourcemap position`)
  }
}
