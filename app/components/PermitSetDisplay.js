import React, {Component, PropTypes} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Icon} from './UI/Icon'

@observer
export default class PermitSetDisplay extends Component {

  static propTypes = {
    store: PropTypes.object,
  }

  @action changePermitSet = (e) => {
    e.preventDefault()
    this.props.store.ui.showPermitSetModal = true
  }

  render() {
    const {currentPermitSetLabel} = this.props.store
    return (
      <div style={styles} onClick={this.changePermitSet}>
        <Icon icon='pencil' />{' '}
        Current Permit Set: <span style={highlightStyle}>{currentPermitSetLabel}</span>
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
