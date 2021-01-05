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
      const attachmentProperties = {
        name: path.basename(file),
        type: 'report-html'
      }
  
      fileProperties.push(attachmentProperties)
      tl.command('task.addattachment', attachmentProperties, file)
      
    })

    const jobName = dashify(tl.getVariable('Agent.JobName'))
    const stageName = dashify(tl.getVariable('System.StageDisplayName'))
    const stageAttempt = tl.getVariable('System.StageAttempt')
    const tabName = tl.getInput('tabName', false ) || 'Html-Report'
    let path = resolve(reportDir)
    console.log(path)
    tl.addAttachment('report-html', `${tabName}.${jobName}.${stageName}.${stageAttempt}`, path)  
}


try {
    run()
} catch (error) {
    tl.setResult(tl.TaskResult.SucceededWithIssues, error.message);
}