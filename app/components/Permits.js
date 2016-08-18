import React, {Component, PropTypes} from 'react'
import {observer} from 'mobx-react'
import ClassificationSidebar from './ClassificationSidebar'
import {sidebarWidth} from '../constants/AppConstants'
import PermitList from './PermitList'
// import DevTools from 'mobx-react-devtools'
import PermitSetDisplay from './PermitSetDisplay'
import ModalLauncher from './Modals'


@observer
export default class Permits extends Component {

  static propTypes = {
    store: PropTypes.object,
  }

  render() {
    let {store} = this.props
    return (
      <div>
        <div style={styles.sidebar}>
          <ClassificationSidebar store={store} />
        </div>
        <div style={styles.list}>
          <PermitSetDisplay store={store} />
          <div className='container'>
            <PermitList store={store} permits={store.permits} />
          </div>
        </div>
        <ModalLauncher store={store} />
        {/* <DevTools /> */}
        {!store.ui.isOnline && <div style={offlineAlert}>Offline</div>}
      </div>
    )
  }
}

const styles = {
  sidebar: {
    position: 'fixed',
    width: sidebarWidth,
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#f9f9f9',
    overflowY: 'scroll'
  },
  list: {
    position: 'absolute',
    left: sidebarWidth,
    right: 0
  }
}

const offlineAlert = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: 28,
  backgroundColor: '#00247E',
  padding: 4,
  fontSize: '1.2em',
  color: '#fff',
  textAlign: 'center',
}
