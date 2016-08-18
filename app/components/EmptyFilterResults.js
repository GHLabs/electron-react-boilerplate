import React, {Component} from 'react'
import {Row, Col} from 'react-bootstrap'


export default class EmptyFilterResults extends Component {

  render() {
    return (
      <div className="alert alert-info" style={styles}>
        <h5>No records match the filters</h5>
        <p>Filters are applied on top of one another. Adding any filter will always have the effect of reducing the size of the list or keeping it the same.</p>
        <h6>Suggestions: </h6>
        <ul>
          <li>Hit 'All' to show any classification</li>
          <li>Click an already-selected classification filter to remove it</li>
          <li>Remove text from the search filter to widen your search</li>
        </ul>
      </div>
    )
  }
}

const styles = {
  marginTop: '30px'
}
