import { beforeEach, expect, test } from '@jest/globals'
import * as PendingViewletCommands from '../src/parts/PendingViewletCommands/PendingViewletCommands.ts'

beforeEach(() => {
  PendingViewletCommands.clear()
})

test('takes commands for an in-order transaction', () => {
  const commands = [['Viewlet.setDom2', 1, []]]
  const transactionId = PendingViewletCommands.queue(1, commands)

  expect(PendingViewletCommands.take(1, transactionId)).toEqual(commands)
})

test('takes earlier transactions before later commands', () => {
  const firstCommands = [['Viewlet.setDom2', 1, ['first']]]
  const secondCommands = [['Viewlet.setDom2', 1, ['second']]]
  const firstTransactionId = PendingViewletCommands.queue(1, firstCommands)
  const secondTransactionId = PendingViewletCommands.queue(1, secondCommands)

  expect(PendingViewletCommands.take(1, secondTransactionId)).toEqual([])
  expect(PendingViewletCommands.take(1, firstTransactionId)).toEqual([...firstCommands, ...secondCommands])
})

test('does not take commands before their commit arrives', () => {
  const firstCommands = [['Viewlet.setDom2', 1, ['first']]]
  const secondCommands = [['Viewlet.setDom2', 1, ['second']]]
  const firstTransactionId = PendingViewletCommands.queue(1, firstCommands)
  const secondTransactionId = PendingViewletCommands.queue(1, secondCommands)

  expect(PendingViewletCommands.take(1, firstTransactionId)).toEqual(firstCommands)
  expect(PendingViewletCommands.take(1, secondTransactionId)).toEqual(secondCommands)
})

test('orders transactions independently for each view', () => {
  const firstViewCommands = [['Viewlet.setDom2', 1, ['first view']]]
  const secondViewCommands = [['Viewlet.setDom2', 2, ['second view']]]
  const firstViewTransactionId = PendingViewletCommands.queue(1, firstViewCommands)
  const secondViewTransactionId = PendingViewletCommands.queue(2, secondViewCommands)

  expect(PendingViewletCommands.take(2, secondViewTransactionId)).toEqual(secondViewCommands)
  expect(PendingViewletCommands.take(1, firstViewTransactionId)).toEqual(firstViewCommands)
})

test('throws when a transaction does not exist', () => {
  expect(() => PendingViewletCommands.take(1, 1)).toThrow('pending viewlet command transaction not found: 1')
})

test('throws when a transaction belongs to another view', () => {
  const transactionId = PendingViewletCommands.queue(1, [])

  expect(() => PendingViewletCommands.take(2, transactionId)).toThrow(`pending viewlet command transaction ${transactionId} belongs to 1, not 2`)
})
