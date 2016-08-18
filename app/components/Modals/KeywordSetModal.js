import React, {Component, PropTypes} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Modal} from 'react-bootstrap'
import {Button} from '../UI'
import {Icon} from '../UI/Icon'
import _ from 'lodash'


@observer
export default class KeywordSetModal extends Component {

  static propTypes = {
    store: PropTypes.object,
  }

  state = {
    error: '',
    label: '',
    keywordSetToDuplicate: 'none',
  }

  updateLabel = (e) => {
    this.setState({label: e.currentTarget.value})
  }

  duplicateKeywordSet = (keywordSetKey, e) => {
    e.preventDefault()
    this.setState({keywordSetToDuplicate: keywordSetKey})
  }

  @action close = () => {
    this.props.store.ui.showKeywordSetModal = false
  }

  @action addNewKeywordSet = (e) => {
    e.preventDefault()
    const {label, keywordSetToDuplicate} = this.state
    if (label) {
      this.props.store.addNewKeywordSet(label, keywordSetToDuplicate)
      this.setState({error: ''})
    } else {
      this.setState({error: 'A label is required to create a new keyword set'})
    }
  }

  @action switchCurrentKeywordSet = (keywordSetKey, e) => {
    e.preventDefault()
    this.props.store.switchCurrentKeywordSet(keywordSetKey)
  }

  render() {
    const {
      state: {label, error, keywordSetToDuplicate},
      props: {store: {currentKeywordSetLabel, keywordSets, ui}}
    } = this
    return (
      <Modal show={ui.showKeywordSetModal} onHide={this.close} bsSize="large">

        <Modal.Header closeButton>
          <Modal.Title>Keyword Sets</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <h4>Switch to another keyword set <small>permit set will not change</small></h4>
          <div className="list-group">
            {_.map(keywordSets, (set, key) => {
              const isActive = currentKeywordSetLabel === set.label
              const setClass = isActive ? "disabled" : "list-group-item-info"
              return (
                <a href="#"
                  onClick={this.switchCurrentKeywordSet.bind(null, key)}
                  className={`list-group-item ${setClass}`}
                  disabled
                  key={key}>
                  {set.label}
                  {isActive ? <small> (current)</small> : null}
                </a>
              )
            })}
          </div>

          <hr />

          <h4>Or add a new keyword set</h4>
          <form className="form-horizontal">

            <div className="form-group">
              <label htmlFor="label" className="col-sm-2 control-label">
                Keyword Set Label
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  style={{width: 367}}
                  id="label"
                  onChange={this.updateLabel}
                  value={label} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="label" className="col-sm-2 control-label">
                Duplicate From:
              </label>
              <div className="col-sm-6">
                <div className="list-group">
                  {_.map({'none': {label: 'None'}, ...keywordSets}, (set, key) => {
                    const isActive = keywordSetToDuplicate === key
                    return (
                      <a href="#"
                      onClick={this.duplicateKeywordSet.bind(null, key)}
                      className={`list-group-item`}
                      key={key}>
                      {set.label}{'  '}
                      {isActive ? <Icon icon='check' /> : null}
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>

            <Button onClick={this.addNewKeywordSet}>
              Add new Keyword Set
            </Button>
          </form>

          {error &&
            <div className="form-group text-danger">
              <label htmlFor="textColor" className="col-sm-2 control-label">Error</label>
              <div className="col-sm-10" style={{marginTop: 6}}>
                <span dangerouslySetInnerHTML={{__html: error}} />
              </div>
            </div>
          }
        </Modal.Body>
      </Modal>
    )
  }
}
