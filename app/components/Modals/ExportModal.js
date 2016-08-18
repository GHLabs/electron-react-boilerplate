import React, {Component, PropTypes} from 'react'
import {Row, Col, Modal} from 'react-bootstrap'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import CSVDownload from '../CSVDownload'
import DefinitionsDownload from '../DefinitionsDownload'
import {FlexTable, FlexColumn} from 'react-virtualized'
import styles from './ExportModal.css'
import moment from 'moment'


@observer
export default class ExportModal extends Component {

  static propTypes = {
    store: PropTypes.object,
  }

  rowClassName = (index) => {
    if (index < 0) {
      return styles.headerRow
    } else {
      return index % 2 === 0 ? styles.evenRow : styles.oddRow
    }
  }

  @action close = () => {
    this.props.store.ui.showExportModal = false
  }

  componentWillMount() {
    this.tableWidth = window.screen.width * 0.91
    this.tableHeight = window.screen.height * 0.65
  }

  render() {
    const {store} = this.props
    const {exportColumns, joinedRecords, classificationDefs, filteredRecordCountFormatted, totalRecordsCountFormatted} = store
    const columnWidth = this.tableWidth / exportColumns.length
    const downloadTimestamp = moment().format('YYYY_MM_DD_HH_mm')
    return (
      <Modal show={store.ui.showExportModal} onHide={this.close} dialogClassName="export-modal">

        <Modal.Header closeButton>
          <Modal.Title>
            <Row>
              <Col md={6}>
                <h4>Filtered Records
                  <small> Downloading <strong>{filteredRecordCountFormatted} of {totalRecordsCountFormatted}</strong> records.</small>
                </h4>
              </Col>
              <Col md={6}>
                <div style={{marginTop: '-18px', marginRight: '40px', textAlign: 'right'}}>
                  <CSVDownload
                    records={joinedRecords}
                    filename={`filterd_permits_${downloadTimestamp}.csv`}
                    label='Download Filtered Records' />
                  {' '}
                  <DefinitionsDownload
                    records={classificationDefs}
                    filename={`classification_definitions_${downloadTimestamp}.json`}
                    label='Download Classification Definitions' />
                </div>
              </Col>
            </Row>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FlexTable
            width={this.tableWidth}
            height={this.tableHeight}
            headerHeight={20}
            rowHeight={40}
            headerClassName={styles.headerColumn}
            rowClassName={this.rowClassName}
            rowCount={joinedRecords.length}
            rowGetter={({index}) => joinedRecords[index]}>
            {exportColumns.map(columnKey => (
              <FlexColumn
                label={columnKey}
                dataKey={columnKey}
                width={columnWidth > 100 ? columnWidth : 100}
                key={columnKey} />
            ))}
          </FlexTable>
        </Modal.Body>
      </Modal>
    )
  }
}
