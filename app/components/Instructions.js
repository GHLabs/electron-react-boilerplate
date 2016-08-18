import React, {Component} from 'react'
import {Row, Col} from 'react-bootstrap'
import {sidebarWidth} from '../constants/AppConstants.js'
import {Icon} from './UI'


export default class Instructions extends Component {

  state = {
    isOpen: false
  }

  toggleInstructions = () => {
    this.setState({isOpen: !this.state.isOpen})
  }

  render() {
    const {isOpen} = this.state
    return (
      <div style={styles}>
        <h6 onClick={this.toggleInstructions} style={{cursor: 'pointer'}}>
          Instructions&nbsp;
          <Icon icon='question-circle' />
        </h6>
        {isOpen &&
          <div className="alert alert-info" >
            <h4>Comma-separated keywords:</h4>
            <p>To find records that match a classification, enter comma-separated keywords.</p>
            <p><strong>Case-insensitive:</strong> Keyword matching is case-insensitive </p>
            <p><strong>Spaces around punctuaction:</strong> Descriptions are lower-cased and compacted to only have a single space between words. A space is also added around all commas, dashes, periods and parenthesis so words next to these marks will match keywords with spaces like elsewhere in a sentence.</p>
            <p><strong>Keywords match visible descriptions:</strong> Keywords match descriptions in the table. To see the original, unprocessed description, hover over the processed description.</p>
            <p><strong>Spaces after commas:</strong> Don't add a space before or after a comma unless you want the keyword to include those spaces. This allows you to look for individual words, or strings within words. </p>
            <p><strong>word1...word2 match pattern:</strong> Using <code>...</code> between two words will match a description if those two words exist in that order and there is zero or more characters between them (including a space).</p>
            <p><strong>Exclude Keywords:</strong> An exclusion keyword will prevent classifying a row if it has that string it in. For example, to classify 'fire' as plumbing (fire sprinkler, fire suppression), but 'fire door' is giving a false match, add 'fire door' as an exclusion.</p>
            <p><strong>Description field</strong> Classification by keyword is only performed on the description field. Category and Type are not taking into consideration but are there to give guidance to the person classifying.</p>
            <p>&nbsp;</p>

            <h4>Classification Definitions:</h4>
            <p>Definitions consist of a label (Roof), abbreviation (RF), badge color and text color. To edit these or delete them, click on the badge or label in the sidebar.</p>
            <p>&nbsp;</p>


            <h4>Saving changes</h4>
            <p>Changes are saved locally every time 'Update' is clicked. Next time you load the app the changes should persist.</p>
            <p>&nbsp;</p>

            <h4>Export</h4>
            <p>Exporting will export the entire record with preview, not just what is shown during classification. The record will include the classifications</p>
            <p>&nbsp;</p>

            <h4>Debugging</h4>
            <p>Control-click and choose 'inspect element' To look at what is being saved in local storage, go to:</p>
            <p><span className="text-info">Resources -> Local Storage -> file://</span></p>
            <p>&nbsp;</p>
          </div>
        }
      </div>
    )
  }
}

const styles = {
  width: sidebarWidth - 20,
  marginTop: '40px',
  marginLeft: '-15px',
  fontSize: '.9em'
}
