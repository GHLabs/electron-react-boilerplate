import React, {Component, PropTypes} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Modal} from 'react-bootstrap'
import {Button} from '../UI'


@observer
export default class ClassificationDefinitionModal extends Component {

  static propTypes = {
    store: PropTypes.object,
  }

  @action close = () => {
    this.props.store.ui.showResetDefsModal = false
  }

  @action resetDefinitions = () => {
    this.props.store.resetStore()
    this.close()
  }

  render() {
    const {store} = this.props
    return (
      <div>
        <Modal show={store.ui.showResetDefsModal} onHide={this.close} bsSize="large">

          <Modal.Header closeButton>
            <Modal.Title>Reset Classification Definitions</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Hold up! Are you sure you want to reset all of the definitions and re-classify records with the defaults?</p>
            <p>If so, you may want to export them first.</p>
          </Modal.Body>

          <Modal.Footer>
            <a onClick={this.close} style={{marginRight: 20}}>
              Cancel
            </a>
            <Button onClick={this.resetDefinitions}>
              Reset Definitions
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    )
  }
}
