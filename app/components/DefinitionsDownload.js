import React, {Component, PropTypes} from 'react'
import {observer} from 'mobx-react'
import {Button} from './UI'
import Papa from 'papaparse'


@observer
export default class DefinitionsDownload extends Component {

  static propTypes = {
    records: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    filename: PropTypes.string,
    label: PropTypes.string,
    style: PropTypes.object,
  }

  downloadFile = () => {
    const {filename, records} = this.props
    const fileString = JSON.stringify(records)
    const exportFilename = filename ? filename : 'download.json'
    const jsonData = new Blob([fileString], {type: 'text/json;charset=utf-8;'})

    //IE11 & Edge
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(jsonData, exportFilename)
    } else {
      //In FF link must be added to DOM to be clicked
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(jsonData)
      link.setAttribute('download', exportFilename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  render() {
    const {label} = this.props
    return (
      <Button onClick={this.downloadFile} icon='download' style={this.props.style}>
        {label && label}
      </Button>
    )
  }
}
