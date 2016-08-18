import Promise from 'bluebird'
import fs from 'fs'
Promise.promisifyAll(fs)
const electron = require('electron')
const remote = require('electron').remote
const resourcesPath = remote.process.resourcesPath
const appPath = remote.app.getAppPath()
console.log('resourcesPath: ', resourcesPath)
console.log('appPath: ', appPath)

export async function loadRecords(fileName, store) {
  // const filePath = `${appPath}/data/ready/${fileName}`
  const filePath = `./app/data/ready/${fileName}`
  return fs.readFileAsync(filePath, 'utf8')
    .then(records => JSON.parse(records))
    .catch(err => {
      store.ui.updateErrorMessage(
        `Unable to read permit records.<br/><br/>
        Path: ${filePath}.<br/><br/>
        ${err}`
      )
    })
}
