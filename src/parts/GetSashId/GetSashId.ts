export const getSashId = ($Target) => {
  if ($Target.id === 'SashPanel') {
    return 'Panel'
  }
  if ($Target.id === 'SashSideBar') {
    return 'SideBar'
  }
  return ''
}
