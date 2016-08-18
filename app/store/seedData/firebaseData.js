// Nothing in this file is actually used, just an example

import {observable, computed, transaction, action, when} from 'mobx'
import {upsert} from '../utils/'
const db = null

// Example Firebase + Mobx pattern
class ObservableStore {

  // Define the observable and db ref
  @observable classificationDefs = []
  @observable classificationDefsRef = db.ref('classificationDefs')

  // Update only the db when the value that will represent the observable is changed
  @action updateClassificationDefinition(definition) {
    const findKey = {abbreviation: definition.abbreviation}
    this.classificationDefsRef.set(upsert(this.classificationDefs, findKey, definition))
  }

  // The observable is subscribed and updated automatically when the db changes,
  // even if offline
  @action updateDefs() {
    this.classificationDefsRef.on('value', snap => {
      this.classificationDefs = snap.val()
    })
  }


}



// == Seed data for firebase datastore =========================================
// This isn't used programmatically, it's copied to a file and uploaded to firebase
const seed = {
  "classificationDefs" : [ {
    "abbreviation" : "EL",
    "color" : "#FFEB3B",
    "label" : "Electrical",
    "textColor" : "darkText"
  }, {
    "abbreviation" : "PB",
    "color" : "#795548",
    "label" : "Plumbing",
    "textColor" : "lightText"
  } ],
  "excludeKeywords" : {
    "defaultKeywordSet" : {
      "PB" : "gas log"
    }
  },
  "includeKeywords" : {
    "defaultKeywordSet" : {
      "EL" : "electricity,electrical",
      "PB" : "plumbing,water line"
    }
  },
  "keywordSets" : {
    "defaultKeywordSet" : {
      "label" : "City of Boulder"
    }
  },
  "permitSets" : {
    "permitSet1" : {
      "fileName" : "city_of_boulder_residential_2000_2014_1000.json",
      "label" : "City of Boulder 2000-2014 (Residential)"
    },
    "permitSet2" : {
      "fileName" : "boulder_county_residential_2000_2015.json",
      "label" : "Boulder County 2000-2016 (Residential)"
    }
  },
  "currentSession" : {
    "permitSet" : "permitSet1",
    "keywordSet" : "defaultKeywordSet",
  }
}
