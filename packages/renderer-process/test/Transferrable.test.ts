/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as Transferrable from '../src/parts/Transferrable/Transferrable.ts'

test('transfer and acquire', () => {
  const id = 1
  const value = 2
  Transferrable.transfer(value, id)
  expect(Transferrable.acquire(id)).toBe(value)
})

test('item should be deleted after acquiring', () => {
  const id = 1
  const value = 2
  Transferrable.transfer(value, id)
  Transferrable.acquire(id)
  expect(Transferrable.acquire(id)).toBe(undefined)
})
