const tl = require('azure-pipelines-task-lib');
const { resolve, basename, join } = require('path');
const dashify = require('dashify')
const globby = require('globby')
const { readFileSync, writeFileSync } = require('fs')
const { load } = require('cheerio')

function run () {
    let reportDir = tl.getPathInput('reportDir', true, true);
  
    let files = globby.sync([reportDir.replace(/\\/g, '/')], {expandDirectories : {files: ['*'], extensions: ['html']}})
  
    const fileProperties = []
  
    files.forEach(file => {
      tl.debug(`Reading report ${file}`)
      const fileContent = readFileSync(file).toString()
      const document = load(fileContent)
  
      writeFileSync(file, document.html())
  
      tl.debug(`Uploading report`)
      const attachmentProperties = {
        name: generateName(basename(file)),
        type: 'report-html'
      }
  
      fileProperties.push(attachmentProperties)
      tl.command('task.addattachment', attachmentProperties, file)
    })
  
    const summaryPath = resolve(join(reportDir,'report.html'))
    writeFileSync(summaryPath, JSON.stringify(fileProperties))
    console.log(summaryPath)
  
    tl.command('task.addattachment', { name: generateName('report.html'), type: 'report-html'}, summaryPath)
  }

  function generateName (fileName) {
    const jobName = dashify(tl.getVariable('Agent.JobName'))
    const stageName = dashify(tl.getVariable('System.StageDisplayName'))
    const stageAttempt = tl.getVariable('System.StageAttempt')
    const tabName = tl.getInput('tabName', false ) || 'Html-Report'
  
    return `${tabName}.${jobName}.${stageName}.${stageAttempt}.${fileName}`
  }

try {
    run()
} catch (error) {
    tl.setResult(tl.TaskResult.SucceededWithIssues, error.message);
}