import { expect, test } from '@jest/globals'
import * as DiffInline from '../src/parts/DiffInline/DiffInline.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'

test('deletion', () => {
  const linesA = ['a']
  const linesB = []
  expect(DiffInline.diffInline(linesA, linesB)).toEqual([
    {
      leftIndex: 0,
      rightIndex: -1,
      type: DiffType.Deletion,
    },
  ])
})

test('insertion', () => {
  const linesA = []
  const linesB = ['a']
  expect(DiffInline.diffInline(linesA, linesB)).toEqual([
    {
      leftIndex: -1,
      rightIndex: 0,
      type: DiffType.Insertion,
    },
  ])
})

test('two insertions', () => {
  const linesA = []
  const linesB = ['a', 'b']
  expect(DiffInline.diffInline(linesA, linesB)).toEqual([
    { leftIndex: -1, rightIndex: 0, type: 1 },
    { leftIndex: -1, rightIndex: 1, type: 1 },
  ])
})

test('three insertions', () => {
  const linesA = []
  const linesB = ['a', 'b', 'c']
  expect(DiffInline.diffInline(linesA, linesB)).toEqual([
    { leftIndex: -1, rightIndex: 0, type: 1 },
    { leftIndex: -1, rightIndex: 1, type: 1 },
    { leftIndex: -1, rightIndex: 2, type: 1 },
  ])
})

test('insertion at start', () => {
  const linesA = ['b', 'c']
  const linesB = ['a', 'b', 'c']
  expect(DiffInline.diffInline(linesA, linesB)).toEqual([
    { leftIndex: 0, rightIndex: 0, type: 0 },
    { leftIndex: 1, rightIndex: 0, type: 1 },
    { leftIndex: 1, rightIndex: 1, type: 0 },
    { leftIndex: -1, rightIndex: 2, type: 0 },
  ])
})

test.skip('insertion at end', () => {
  const linesA = ['a', 'b']
  const linesB = ['a', 'b', 'c']
  const expected = [0, 0, 1, 1]
  expect(DiffInline.diffInline(linesA, linesB)).toEqual(new Uint32Array(expected))
})

test.skip('insertion at start and end', () => {
  const linesA = ['c']
  const linesB = ['a', 'b', 'c', 'd']
  const expected = [0, 0, 1, 2, 1, 0, 4, 4]
  expect(DiffInline.diffInline(linesA, linesB)).toEqual(new Uint32Array(expected))
})

test.skip('replacement', () => {
  const linesA = ['a']
  const linesB = ['b']
  const expected = [1, 1, 1, 1]
  expect(DiffInline.diffInline(linesA, linesB)).toEqual(new Uint32Array(expected))
})

test.skip('word replacement', () => {
  const linesA = ['The', 'cat', 'in', 'the', 'hat']
  const linesB = ['The', 'dog', 'in', 'the', 'hat']
  const expected = [2, 2, 2, 2]
  expect(DiffInline.diffInline(linesA, linesB)).toEqual([new Uint32Array(expected)])
})

test.skip('word insertion', () => {
  const linesA = ['The', 'cat', 'in', 'the', 'hat']
  const linesB = ['The', 'furry', 'cat', 'in', 'the', 'hat']
  const expected = [1, 0, 2, 2]
  expect(DiffInline.diffInline(linesA, linesB)).toEqual(new Uint32Array(expected))
})

test.skip('wordDeletion', () => {
  const linesA = ['The', 'cat', 'in', 'the', 'hat']
  const linesB = ['The', 'cat']
  const expected = [3, 5, 2, 0]
  expect(DiffInline.diffInline(linesA, linesB)).toEqual(new Uint32Array(expected))
})

test.skip('two edits', () => {
  const linesA = ['The', 'cat', 'in', 'the', 'hat']
  const linesB = ['The', 'ox', 'in', 'the', 'box']
  const expected = [1, 1, 1, 1, 5, 5, 5, 5]
  expect(DiffInline.diffInline(linesA, linesB)).toEqual(new Uint32Array(expected))
})
