import React, {Component, PropTypes} from 'react'
import {observer} from 'mobx-react'
import {FlexTable, FlexColumn} from 'react-virtualized'
import styles from './PermitList.css'
import {Row, Col} from 'react-bootstrap'
import CategoryFilters from './CategoryFilters'
import PermitTypeFilters from './PermitTypeFilters'
import BuildingCategoryFilters from './BuildingCategoryFilters'
import SearchFilter from './SearchFilter'
import {map, find, isEmpty, isObject} from 'lodash'
import {sidebarWidth} from '../constants/AppConstants'
import Loader from './Loader'


@observer
export default class PermitList extends Component {

  static propTypes = {
    store: PropTypes.object,
  }

  rowClassName = ({index}) => {
    if (index < 0) {
      return styles.headerRow
    } else {
      return index % 2 === 0 ? styles.evenRow : styles.oddRow
    }
  }

  cellClassification = ({rowData}) => {
    let {store} = this.props
    const {id} = rowData
    const classifications = id < store.classifications.length
      ? store.classifications[id]
      : []
    return (
      <span>
        {map(classifications, classification => {
          const def = find(store.classificationDefs, d => {
            return d.abbreviation === classification
          })
          const badgeStyle = isObject(def)
            ? {backgroundColor: def.color, color: def.textColor}
            : {backgroundColor: '#999', color: '#fff'}
          return (
            <span className="badge" style={badgeStyle} key={classification}>
              {classification}
            </span>
          )
        })}
      </span>
    )
  }

  descriptionRenderer = ({rowData}) => {
    const {description, sanitizedDescription} = rowData
    return <span title={description && description}>{sanitizedDescription}</span>
  }

  typeFilterHeader = () => {
    return <PermitTypeFilters store={this.props.store} label='Permit Types' />
  }

  categoryFilterHeader = () => {
    return <BuildingCategoryFilters store={this.props.store} label='Building Category' />
  }

  // TODO: force FlexTable to rerender on classification update
  // https://github.com/bvaughn/react-virtualized/issues/134#issuecomment-213666333
  renderTable = (filteredRecords) => {
    const tableWidth = window.screen.width - sidebarWidth - 50
    return (
      <FlexTable
        width={tableWidth}
        height={2000}
        headerHeight={40}
        rowHeight={40}
        headerClassName={styles.headerColumn}
        rowClassName={this.rowClassName}
        rowCount={filteredRecords.length}
        rowGetter={({index}) => filteredRecords[index]}>
        <FlexColumn
          width={100}
          label='Classifications'
          dataKey='id'
          cellRenderer={this.cellClassification} />
        <FlexColumn
          label='Id'
          dataKey='id'
          width={40} />
        <FlexColumn
          headerRenderer={this.categoryFilterHeader}
          dataKey='category'
          width={170} />
        <FlexColumn
          headerRenderer={this.typeFilterHeader}
          dataKey='type'
          width={200} />
        <FlexColumn
          width={710}
          label='Description'
          dataKey='sanitizedDescription'
          cellRenderer={this.descriptionRenderer} />
      </FlexTable>
    )
  }

  render() {
    let {store} = this.props
    let {dimensions, filteredRecordCountFormatted, totalRecordsCountFormatted} = store

    // dimensions.id.bottom(Infinity) gives me ids in ascending order
    const filteredRecords = dimensions.id ? dimensions.id.bottom(Infinity) : []
    return (
      <div>
        <Row style={{marginBottom: '10px'}}>
          <Col sm={8}>
            <CategoryFilters store={store} />
          </Col>
          <Col sm={2}>
            <SearchFilter store={store} />
          </Col>
          <Col sm={2}>
            <div style={{fontWeight: 700, marginTop: '18px', color: '#777'}}>
              <h4>{filteredRecordCountFormatted} / {totalRecordsCountFormatted} <small>records</small></h4>
            </div>
          </Col>
        </Row>
        {store.isLoading
          ? <Loader />
          : this.renderTable(filteredRecords)}
          {/* : isEmpty(filteredRecords) ? <EmptyFilterResults /> : this.renderTable(filteredRecords)} */}
      </div>
    )
  }
}
