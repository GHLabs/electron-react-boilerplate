import React, {Component, PropTypes} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Modal} from 'react-bootstrap'
import {Button} from '../UI'
import {map, pick, find, isObject, isEmpty, some, join, keys, pickBy} from 'lodash'
import {lightText, darkText, badgeColors} from '../../constants/AppConstants'


@observer
export default class ClassificationDefinitionModal extends Component {

  static propTypes = {
    store: PropTypes.object,
  }

  state = {
    error: '',
    label: '',
    oldAbbreviation: '',
    newAbbreviation: '',
    color: '',
    textColor: lightText,
    deleteWarning: '',
  }

  // Populate state with values if editing a definition
  componentWillMount() {
    const {store} = this.props
    const classType = store.ui.classificationDefModalType
    if (classType) {
      const def = find(store.classificationDefs, def => def.abbreviation === classType)
      if (isObject(def)) {
        this.setState({
          label: def.label,
          newAbbreviation: def.abbreviation,
          oldAbbreviation: def.abbreviation,  // Used to compare if abbreviation has been edited
          color: def.color,
          textColor: def.textColor,
          abbreviationRenameWarning: false
        })
      }
    }
  }

  setLabel = (e) => {
    this.setState({label: e.currentTarget.value})
  }

  setAbbreviation = (e) => {
    this.setState({newAbbreviation: e.currentTarget.value})
  }

  setBadgeColor = (color) => {
    this.setState({color: color})
  }

  setTextColor = (textColor) => {
    this.setState({textColor: textColor})
  }

  resetState = () => {
    this.setState({label: '', newAbbreviation: '', oldAbbreviation: '', color: '', textColor: lightText})
  }

  addAbbreviationRenameWarning = () => {
    this.setState({abbreviationRenameWarning: true})
  }

  setDeleteWarning = (e) => {
    e.preventDefault()
    this.setState({deleteWarning: 'This will delete this classification definition across all keyword sets. This is because classification definitions need to be consistent across all keyword sets. Any keywords assigned to the deleted classification definition in this or other keyword sets will be deleted along with this definition.'})
  }

  unSetDeleteWarning = (e) => {
    e.preventDefault()
    this.setState({deleteWarning: ''})
  }

  @action updateDefinition = (e) => {
    const {store} = this.props
    this.setState({error: ''})
    const defVals = pick(this.state, ['label', 'newAbbreviation', 'oldAbbreviation', 'color', 'textColor'])
    const errorVals = pick(this.state, ['label', 'newAbbreviation', 'color', 'textColor'])
    const errorMsg = classificationDefinitionErrors(errorVals, store.classificationDefs, store.ui.classificationDefModalType)
    if (errorMsg) {
      this.setState({error: errorMsg})
    } else {
      store.updateOrAddClassificationDef(defVals)
      store.ui.classificationDefModalType = undefined
      this.resetState()
      this.close()
    }
  }

  @action deleteDefinition = () => {
    const {store} = this.props
    store.deleteClassificationDefinition(this.state.oldAbbreviation)
    store.ui.classificationDefModalType = undefined
    this.resetState()
    this.close()
  }

  @action close = () => {
    this.props.store.ui.showClassificationDefModal = false
  }

  render() {
    const {label, newAbbreviation, color, textColor, error, abbreviationRenameWarning, deleteWarning} = this.state
    const {store} = this.props
    const isExistingDef = Boolean(store.ui.classificationDefModalType)
    const title = isExistingDef ? 'Edit' : 'Add'
    const submitLabel = isExistingDef ? 'Update' : 'Add'
    return (
      <Modal show={store.ui.showClassificationDefModal} onHide={this.close} bsSize="large">

        <Modal.Header closeButton>
          <Modal.Title>{title} Classification Type</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form className="form-horizontal">
            <div className="form-group">
              <label htmlFor="label" className="col-sm-2 control-label">Label</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  id="label"
                  onChange={this.setLabel}
                  value={label} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="abbreviation" className="col-sm-2 control-label">Abbreviation</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  id="abbreviation"
                  onChange={this.setAbbreviation}
                  onFocus={this.addAbbreviationRenameWarning}
                  value={newAbbreviation} />
                {abbreviationRenameWarning && isExistingDef && <p className="help-block">
                  <span className='text-danger'>Woah, cowboy. Renaming an classification abbreviation will change the abbreviation for all keyword sets, not just your current one. This is so we can have consistent categories across different keyword sets when we marge permit sets. Go ahead and do it if you know that's what you want.</span>
                </p>}
                <p className="help-block">
                  Keep it short, preferable 2 letters uppercase, max 3. These abbreviations are used across all keyword sets and cannot be changed.
                </p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="textColor" className="col-sm-2 control-label">Badge Color</label>
              <div className="col-sm-10" style={{marginTop: '6px'}}>
                {map(badgeColors, color => {
                  return (
                    <span
                      className="badge"
                      key={color}
                      onClick={this.setBadgeColor.bind(this, color)}
                      style={{backgroundColor: color, color: lightText, cursor: 'pointer'}}>
                      {newAbbreviation || 'PB'}
                    </span>
                  )
                })}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="textColor" className="col-sm-2 control-label">Text Color</label>
              <div className="col-sm-10" style={{marginTop: 6}}>
                <span
                  className="badge"
                  onClick={this.setTextColor.bind(this, lightText)}
                  style={{backgroundColor: '#888', color: lightText, cursor: 'pointer'}}>
                  Light Text
                </span>
                <span
                  className="badge"
                  onClick={this.setTextColor.bind(this, darkText)}
                  style={{backgroundColor: '#DCDADA', color: darkText, cursor: 'pointer'}}>
                  Dark Text
                </span>
              </div>
            </div>

            <hr />

            <div className="form-group">
              <label htmlFor="textColor" className="col-sm-2 control-label">Final Output</label>
              <div className="col-sm-10" style={{marginTop: 6}}>
                <span style={{marginRight: 20}}>{label}</span>
                <span
                  className="badge"
                  style={{backgroundColor: color, color: textColor}}>
                  {newAbbreviation}
                </span>
              </div>
            </div>

            {error &&
              <div className="form-group text-danger">
                <label htmlFor="textColor" className="col-sm-2 control-label">Error</label>
                <div className="col-sm-10" style={{marginTop: 6}}>
                  <span dangerouslySetInnerHTML={{__html: error}} />
                </div>
              </div>
            }
          </form>
        </Modal.Body>

        <Modal.Footer>
          {isExistingDef &&
            <div className="clearfix">
              <a onClick={this.setDeleteWarning} href="#" className='text-danger' style={{float: 'left'}}>
                Delete Definition
              </a>
            </div>
          }
          {deleteWarning &&
            <div className='well'>
              <p className="text-danger text-left">{deleteWarning}</p>
              <Button onClick={this.unSetDeleteWarning}>
                Cancel Deletion
              </Button>
              <Button onClick={this.deleteDefinition} style={{float: 'left'}}>
                No really, delete this definition across all keyword sets
              </Button>
            </div>
          }
          <a onClick={this.close} style={{marginRight: 20}}>
            Cancel
          </a>
          <Button onClick={this.updateDefinition}>
            {submitLabel} Definition
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}




function classificationDefinitionErrors(vals, classificationDefs, classificationDefModalType) {

  // Check to see if required fields are filled out.
  // Apparently you can't use chain on objects
  const missing = join(keys(pickBy(vals, isEmpty)), ', ')
  const missingMsg = missing
    ? `You are missing these fields: ${missing} <br/>`
    : ''

  // When creating new definitions, check to see if we are trying to create a
  // duplicate abbreviation (used as the primary key)
  const dupeMsg = classificationDefModalType === vals.abbreviation
    ? ''
    : some(classificationDefs, def => def.abbreviation === vals.abbreviation)
      ? 'You are trying to create a duplicate abbreviation. We need unique abbreviations'
      : ''

  return missingMsg + dupeMsg
}
