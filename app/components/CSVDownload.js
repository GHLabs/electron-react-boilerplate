import React, {Component, PropTypes} from 'react'
import {observer} from 'mobx-react'
import {Button} from './UI'
import Papa from 'papaparse'


// TODO: Make a reusable component for csv and definition downloads
@observer
export default class CSVDownload extends Component {

  static propTypes = {
    records: PropTypes.array.isRequired,
    filename: PropTypes.string,
    label: PropTypes.string,
    style: PropTypes.object,
  }

  downloadFile = () => {
    const {filename, records} = this.props
    const csvString = Papa.unparse(records)
    const exportFilename = filename ? filename : 'filtered_records.csv'
    const csvData = new Blob([csvString], {type: 'text/csv;charset=utf-8;'})

    //IE11 & Edge
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(csvData, exportFilename)
    } else {
      //In FF link must be added to DOM to be clicked
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(csvData)
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
