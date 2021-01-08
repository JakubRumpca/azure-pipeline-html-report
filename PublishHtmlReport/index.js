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
  
      const attachmentProperties = {
        name: generateName(basename(file)),
        type: 'report-html'
      }
  
      fileProperties.push(attachmentProperties)
      tl.command('task.addattachment', attachmentProperties, file)
      
    })

    const jobName = dashify(tl.getVariable('Agent.JobName'))
    const stageName = dashify(tl.getVariable('System.StageDisplayName'))
    const stageAttempt = tl.getVariable('System.StageAttempt')
    const tabName = tl.getInput('tabName', false ) || 'Html-Report'
    const summaryPath = resolve(reportDir)
    writeFileSync(summaryPath, JSON.stringify(fileProperties))
    console.log(summaryPath)
    tl.addAttachment('report-html', `${tabName}.${jobName}.${stageName}.${stageAttempt}`, summaryPath)
}
function generateName (fileName) {
    const jobName = dashify(tl.getVariable('Agent.JobName'))
    const stageName = dashify(tl.getVariable('System.StageDisplayName'))
    const stageAttempt = tl.getVariable('System.StageAttempt')
    const tabName = tl.getInput('tabName', false ) || 'Html-Report'
  
    return `${tabName}.${jobName}.${stageName}.${stageAttempt}.${fileName}`
  }

try {
    let reportDir = tl.getPathInput('reportDir', true, true);
    const jobName = dashify(tl.getVariable('Agent.JobName'))
    const stageName = dashify(tl.getVariable('System.StageDisplayName'))
    const stageAttempt = tl.getVariable('System.StageAttempt')
    const tabName = tl.getInput('tabName', false ) || 'Html-Report'
    let path = resolve(reportDir)
    console.log(path)
    tl.addAttachment('report-html', `${tabName}.${jobName}.${stageName}.${stageAttempt}`, path)  
} catch (error) {
    tl.setResult(tl.TaskResult.SucceededWithIssues, error.message);
}