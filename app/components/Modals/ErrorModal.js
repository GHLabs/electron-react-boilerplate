import React, {Component, PropTypes} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Modal} from 'react-bootstrap'


@observer
export default class ErrorModal extends Component {

  static propTypes = {
    store: PropTypes.object,
  }

  @action close = () => {
    this.props.store.ui.updateErrorMessage(null)
  }

  render() {
    const {
      props: {store: {ui}}
    } = this
    return (
      <Modal show={ui.showErrorModal} onHide={this.close} bsSize="large">

        <Modal.Header closeButton>
          <Modal.Title><span className="text-danger">Error</span></Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p dangerouslySetInnerHTML={{__html: ui.lastErrorMessage}} />
        </Modal.Body>
      </Modal>
    )
  }
}
