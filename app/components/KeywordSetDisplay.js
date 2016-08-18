import React, {Component, PropTypes} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Icon} from './UI/Icon'

@observer
export default class KeywordSetDisplay extends Component {

  static propTypes = {
    store: PropTypes.object,
  }

  @action changeKeywordSet = (e) => {
    e.preventDefault()
    this.props.store.ui.showKeywordSetModal = true
  }

  render() {
    return (
      <div style={styles} onClick={this.changeKeywordSet}>
        <Icon icon='pencil' />{' '}
        Current Keyword Set: <span style={highlightStyle}>{this.props.store.currentKeywordSetLabel}</span>
      </div>
    )
  }
}

const styles = {
  width: '100%',
  backgroundColor: '#443D3A',
  color: '#AFAFAF',
  padding: '2px 8px',
  fontSize: '.9em',
  cursor: 'pointer'
}

const highlightStyle = {
  color: '#D4D4D4'
}
