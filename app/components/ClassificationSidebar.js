import React, {Component, PropTypes} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Row} from 'react-bootstrap'
import {Button} from './UI'
import {map, isString} from 'lodash'
import KeywordSetDisplay from './KeywordSetDisplay'
import Instructions from './Instructions'
import {sidebarWidth} from '../constants/AppConstants'


@observer
export default class ClassificationSidebar extends Component {

  static propTypes = {
    store: PropTypes.object,
  }

  @action updateClassifications = () => {
    this.props.store.updateClassifications()
  }

  @action updateIncludeKeywords = (classification, e) => {
    this.props.store.updateIncludeKeywords(classification, e.currentTarget.value)
  }

  @action updateExcludeKeywords = (classification, e) => {
    this.props.store.updateExcludeKeywords(classification, e.currentTarget.value)
  }

  @action openClassificationDefinition = (abbreviation) => {
    const {store} = this.props
    store.ui.showClassificationDefModal = true
    store.ui.classificationDefModalType = isString(abbreviation) ? abbreviation : undefined
  }

  @action openResetDefsModal = () => {
    this.props.store.ui.showResetDefsModal = true
  }

  @action openExportModal = () => {
    this.props.store.ui.showExportModal = true
  }

  renderKeywordBox = (definition) => {
    const {store} = this.props
    const {abbreviation, label, color, textColor} = definition
    const badgeStyle = {backgroundColor: color, color: textColor}
    if (!abbreviation) {
      return null
    }
    return (
      <Row key={abbreviation}>
        <h5 style={styles.classHeader} onClick={this.openClassificationDefinition.bind(null, abbreviation)}>
          <span className="badge" style={{...badgeAlignment, ...badgeStyle}}>
            {abbreviation}
          </span>
          &nbsp; {label}
        </h5>
        <div style={textAreaStyles}>
          <div style={subLabelStyle}>include</div>
          <textarea value={store.includeKeywords[abbreviation]}
            onChange={this.updateIncludeKeywords.bind(this, abbreviation)}
            style={{width: 185}}
            rows={4} />
        </div>
        <div style={textAreaStyles}>
          <div style={subLabelStyle}>exclude</div>
          <textarea value={store.excludeKeywords[abbreviation]}
            onChange={this.updateExcludeKeywords.bind(this, abbreviation)}
            style={{width: 185, marginLeft: 10}}
            rows={4} />
        </div>
      </Row>
    )
  }

  renderUpdateButton = () => {
    return this.props.store.ui.isUpdatingClassifications
      ? <Button style={styles.update} icon='cog' spin>Updating</Button>
      : <Button onClick={this.updateClassifications} style={styles.update}>Update</Button>
  }

  render() {
    const {store} = this.props
    return (
      <div>
        <KeywordSetDisplay store={store} />
        <div className='container' style={styles.container}>
          <Row>
            <h3>Classifications
              <small>
                {this.renderUpdateButton()}
              </small>
            </h3>
          </Row>

          {map(store.classificationDefs, def => this.renderKeywordBox(def))}

          <Row style={{marginTop: '20px'}}>
            {/*<a  href="#" onClick={this.openResetDefsModal}>
              Reset Definitions
            </a>*/}
            <div style={{display: 'inline-block', float: 'right', marginRight: '20px'}}>
              <Button icon='table,download' onClick={this.openExportModal} style={{marginRight: '8px'}}/>
              <Button onClick={this.openClassificationDefinition}>
                Add Classification Definition
              </Button>
            </div>
          </Row>

          <Instructions />
        </div>
      </div>
    )
  }
}

// == styles ===================================================================
const styles = {
  classHeader: {
    marginBottom: 0,
    verticalAlign: 'bottom',
    cursor: 'pointer'
  },
  container: {
    marginLeft: '10px',
    width: `${sidebarWidth}px`
  },
  update: {
    margin: '0 20px 0 10px',
    float: 'right'
  }
}

const badgeAlignment = {
  verticalAlign: 'bottom'
}

const textAreaStyles = {
  position: 'relative',
  display: 'inline-block',
  fontSize: '.8em'
}

const subLabelStyle = {
  position: 'absolute',
  right: 0,
  top: '-14px',
  color: '#999',
  fontSize: '0.9em'
}
