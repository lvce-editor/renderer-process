# Renderer Process

Set `preloadWorkers` in the HTML `Config` JSON to select workers to create early:

```json
{
  "preloadWorkers": ["rendererWorker", "editorWorker", "syntaxHighlightingWorker", "extensionManagementWorker", "fileSystemWorker", "activityBarWorker", "mainAreaWorker", "statusBarWorker", "iconThemeWorker"]
}
```

These nine workers are the default when the field is absent or is not an array. An empty array disables optional preloading. Renderer Worker always starts because it bootstraps the application. Unknown IDs are ignored and duplicates are created once. Omitted workers remain available on demand. Precreated workers use the existing port handoff, so initialization still runs through their normal parent worker. Worker URLs can be overridden with `workerUrls` in the same config.
