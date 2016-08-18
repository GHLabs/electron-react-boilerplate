import React, { Component, PropTypes } from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {hashHistory} from 'react-router'
import createStore from '../store/createStore'
const store = createStore()


// Update the mobx store with route
hashHistory.listen(e => {
  action('updateStoreWithRoute', () => {store.ui.route = e.pathname})
})


// Allow for control-clicking to bring up inspector. This is currently enabled in production
const debugMenu = require('debug-menu')
debugMenu.install()

@observer
export default class App extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return React.cloneElement(this.props.children, {store: store})
  }
}
