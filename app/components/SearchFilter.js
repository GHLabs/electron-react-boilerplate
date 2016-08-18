import React, {Component, PropTypes} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'


@observer
export default class SearchFilter extends Component {

  static propTypes = {
    store: PropTypes.object,
    permits: PropTypes.array
  }

  @action updateSearch = (e) => {
    e.preventDefault()
    this.props.store.updateSearchString(e.currentTarget.value)
  }

  render() {
    let {store} = this.props
    return (
      <form className="form-inline" style={{marginTop: '12px', display: 'inline-block'}}>
        <div className="form-group">
          <div className="input-group">
            <div className="input-group-addon">
              <i className="fa fa-search" />
            </div>
            <input
              type="text"
              onChange={this.updateSearch}
              value={store.searchString}
              className="form-control"
              placeholder="Search" />
          </div>
        </div>
      </form>
    )
  }
}
