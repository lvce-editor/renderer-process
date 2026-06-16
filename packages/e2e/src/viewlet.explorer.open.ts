import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'explorer.open'

export const test: Test = async ({ expect, FileSystem, Locator, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.css`, `abc`)
  await Workspace.setPath(tmpDir)

  // act
  await SideBar.open('Explorer')

  // assert
  const explorer = Locator('.Explorer')
  await expect(explorer).toBeVisible()
  const file = explorer.locator('[aria-label="test.css"]')
  await expect(file).toBeVisible()
}
