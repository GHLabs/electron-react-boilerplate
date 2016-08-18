import React, {Component, PropTypes} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Modal} from 'react-bootstrap'
import _ from 'lodash'


@observer
export default class PermitSetModal extends Component {

  static propTypes = {
    store: PropTypes.object,
  }

  updateLabel = (e) => {
    this.setState({label: e.currentTarget.value})
  }

  @action close = () => {
    this.props.store.ui.showPermitSetModal = false
  }

  @action switchCurrentPermitSet = (permitSetKey, e) => {
    e.preventDefault()
    this.props.store.switchCurrentPermitSet(permitSetKey)
  }

  render() {
    const {
      props: {store: {currentPermitSetLabel, permitSets, ui}}
    } = this
    return (
      <Modal show={ui.showPermitSetModal} onHide={this.close} bsSize="large">

        <Modal.Header closeButton>
          <Modal.Title>Keyword Sets</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <h4>Switch to another permit set</h4>
          <div className="list-group">
            {_.map(permitSets, (set, key) => {
              const isActive = currentPermitSetLabel === set.label
              const setClass = isActive ? "disabled" : "list-group-item-info"
              return (
                <a href="#"
                  onClick={this.switchCurrentPermitSet.bind(null, key)}
                  className={`list-group-item ${setClass}`}
                  disabled
                  key={key}>
                  {set.label}
                  {isActive ? <small> (current)</small> : null}
                  <small style={{float: 'right'}}>
                    <em>{set.fileName}</em>
                  </small>
                </a>
              )
            })}
          </div>

        </Modal.Body>
      </Modal>
    )
  }
}
