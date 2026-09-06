export const fileSaved = (applicationId: string, uri: string): void => {
  window.dispatchEvent(new CustomEvent('lvce-file-saved', { detail: { applicationId, uri } }))
}
