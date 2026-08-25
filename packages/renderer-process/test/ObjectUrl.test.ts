import { expect, jest, test } from '@jest/globals'
import { createObjectUrl, revokeObjectUrl } from '../src/parts/ObjectUrl/ObjectUrl.ts'

test('creates object urls in the renderer process', () => {
  const blob = new Blob(['audio'], { type: 'audio/webm' })
  const createObjectURL = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/recording')

  expect(createObjectUrl(blob)).toBe('blob:http://localhost/recording')
  expect(createObjectURL).toHaveBeenCalledWith(blob)
})

test('revokes object urls in the renderer process', () => {
  const revokeObjectURL = jest.spyOn(URL, 'revokeObjectURL').mockReturnValue()

  revokeObjectUrl('blob:http://localhost/recording')

  expect(revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/recording')
})
