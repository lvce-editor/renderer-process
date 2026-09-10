// Wire protocol IDs shared with test-worker. Keep existing string callers compatible.
const conditionNames: Readonly<Record<number, string>> = {
  1: 'toBeFocused',
  10: 'toHaveJSProperty',
  11: 'toHaveText',
  12: 'toHaveValue',
  2: 'toBeHidden',
  3: 'toBeVisible',
  4: 'toContainText',
  5: 'toHaveAttribute',
  6: 'toHaveClass',
  7: 'toHaveCount',
  8: 'toHaveCss',
  9: 'toHaveId',
}

export const getConditionName = (condition: number | string): string => {
  if (typeof condition === 'string') {
    return condition
  }
  const name = conditionNames[condition]
  if (!name) {
    throw new Error(`unexpected condition type ${condition}`)
  }
  return name
}
