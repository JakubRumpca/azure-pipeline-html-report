# azure-pipeline-html-report


Azure DevOps extension that provides a task for publishing report in a HTML format and embeds it into a Build and Release pages.

### Extension

In order to see report on tab one must first use `Publish HTML Report` task. This is supporting task which makes html tab visible.

This task takes one parameter - required `reportDir` which is a path to report directory and also optional `tabName` which is the name of the tab displayed within Azure DevOps report. Please note that you must publish the file as an artifact of the build in order for this task to display the report.
#### Example YAML setup

```YAML
steps:
  - task: PublishHtmlReport@1
    displayName: 'Publish HTML Report'
    inputs:
      reportDir: '$(ResultsPath)/reportName.html'
```
