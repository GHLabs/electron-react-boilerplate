import React, {Component, PropTypes} from 'react'
import {observer} from 'mobx-react'
import ClassificationDefinitionModal from './ClassificationDefinitionModal'
import ResetDefsModal from './ResetDefsModal'
import ExportModal from './ExportModal'
import KeywordSetModal from './KeywordSetModal'
import PermitSetModal from './PermitSetModal'
import ErrorModal from './ErrorModal'


@observer
export default class ModalLauncher extends Component {

  static propTypes = {
    store: PropTypes.object,
  }

  render() {
    const {store} = this.props
    return (
      <div>
        {store.ui.showResetDefsModal &&
          <ResetDefsModal store={store} />
        }

        {store.ui.showExportModal &&
          <ExportModal store={store} />
        }

        {/* There's important functionality when mounting,
        so we want to mount & unmount this when shown. */}
        {store.ui.showClassificationDefModal &&
          <ClassificationDefinitionModal store={store} />
        }

        {store.ui.showKeywordSetModal &&
          <KeywordSetModal store={store} />
        }

        {store.ui.showPermitSetModal &&
          <PermitSetModal store={store} />
        }

        {store.ui.showErrorModal &&
          <ErrorModal store={store} />
        }
      </div>
    )
  }
}
