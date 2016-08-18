import {observable, computed, transaction, action, autorun} from 'mobx'
import _ from 'lodash'
import * as s from './storeUtils/'
import crossfilter from 'crossfilter2'

// import {useStrict, } from 'mobx'
// useStrict(true)


import firebase from 'firebase'
require("firebase/database")
const firebaseConfig = {
  apiKey: "AIzaSyBvOguhwa2TdJwL-nGJdiuDLTY-KMw_oxM",
  authDomain: "permit-classifier.firebaseapp.com",
  databaseURL: "https://permit-classifier.firebaseio.com",
  storageBucket: "",
}
firebase.initializeApp(firebaseConfig)


// TODO:
// Copy keyword sets when creating new
class ModelStore {

  // UI store
  ui;

  // Firebase Refs
  db = firebase.database()
  currentSessionRef = this.db.ref('currentSession')
  keywordSetsRef = this.db.ref('keywordSets')
  permitSetsRef = this.db.ref('permitSets')
  classificationDefsRef = this.db.ref('classificationDefs')
  includeKeywordSetsRef = this.db.ref('includeKeywords')
  excludeKeywordSetsRef = this.db.ref('excludeKeywords')
  @observable permitSetRef = null
  @observable keywordSetRef = null
  @observable includeKeywordsRef = null
  @observable excludeKeywordsRef = null

  // model
  cf = undefined  // crossfilter is it's own observable store. Making it observable slows it down and causes problems
  dimensions = {}
  records = []
  @observable totalRecordsCount = 0
  @observable filteredRecordCount = 0
  @observable classifications = []
  @observable includeKeywords = {}
  @observable excludeKeywords = {}
  @observable classificationDefs = []
  @observable permitSets = undefined
  @observable currentPermitSetLabel = undefined
  @observable currentKeywordSetLabel = undefined
  @observable keywordSets = undefined

  // search and filter
  @observable searchString = ''
  @observable categoryFilters = []
  @observable permitTypeFilters = []
  @observable permitTypeSet = []
  @observable buildingCategoryFilters = []
  @observable buildingCategorySet = []

  // == Initialization =========================================================
  constructor(uiStore) {
    this.ui = uiStore

    // Update mobx store observables when firebase db refs see changes
    autorun(() => this.updateFirebaseRefs())
    autorun(() => this.updateCurrentKeywords())
    autorun(() => this.updateKeywordSets())
    autorun(() => this.updateCurrentPermitSet())
    autorun(() => this.updatePermitSets())
  }

  @computed get areRecordsLoaded() {
    return this.totalRecordsCount > 0 && !_.isEmpty(this.includeKeywords) && !_.isEmpty(this.excludeKeywords)
  }

  @action updateFirebaseRefs() {
    this.currentSessionRef.on('value', snap => {
      const {user, permitSet, keywordSet} = snap.val()
      this.userRef = this.db.ref(`users/${user}`)
      this.permitSetRef = this.db.ref(`permitSets/${permitSet}`)
      this.keywordSetRef = this.db.ref(`keywordSets/${keywordSet}`)
      this.includeKeywordsRef = this.db.ref(`includeKeywords/${keywordSet}`)
      this.excludeKeywordsRef = this.db.ref(`excludeKeywords/${keywordSet}`)
    })
  }

  updateCurrentPermitSet() {
    if (!this.permitSetRef) {
      return null
    }
    this.permitSetRef.on('value', async snap => {
      this.ui.isLoading = true
      const {fileName, label} = snap.val()
      const parsedRecords = await s.loadRecords(fileName, this)
      transaction(() => {
        this.currentPermitSetLabel = label
        this.records = parsedRecords
        this.permitTypeSet.replace(s.getPermitTypeSet(parsedRecords))
        this.buildingCategorySet.replace(s.getBuildingCategorySet(parsedRecords))
        this.totalRecordsCount = parsedRecords.length      // Should this be an @computed?
        this.filteredRecordCount = this.totalRecordsCount  // ??

        // Set up crosssfilter dimmensions
        this.cf = crossfilter(parsedRecords)
        this.dimensions['sanitizedDescription'] = this.cf.dimension(d => _.toLower(_.trim(d.description, '.')))
        this.dimensions['id'] = this.cf.dimension(d => d.id)
        this.dimensions['permitTypes'] = this.cf.dimension(d => _.lowerCase(d.type))
        this.dimensions['buildingCategory'] = this.cf.dimension(d => _.lowerCase(d.category))
        this.ui.isLoading = false
      })
      this.updateClassifications()
    })
  }

  updateCurrentKeywords() {
    this.classificationDefsRef.on('value', snap => {
      this.classificationDefs = snap.val()
    })
    if (this.includeKeywordsRef) {
      this.includeKeywordsRef.on('value', snap => {
        this.includeKeywords = snap.val()
      })
    }
    if (this.excludeKeywordsRef) {
      this.excludeKeywordsRef.on('value', snap => {
        this.excludeKeywords = snap.val()
      })
    }
    if (this.keywordSetRef) {
      this.keywordSetRef.on('value', snap => {
        this.currentKeywordSetLabel = snap.val().label
      })
    }
  }

  updateKeywordSets() {
    this.keywordSetsRef.on('value', snap => {
      this.keywordSets = snap.val()
    })
  }

  updatePermitSets() {
    this.permitSetsRef.on('value', snap => {
      this.permitSets = snap.val()
    })
  }

  // == Switching Keyword & Permit sets ======================================
  // Adds new keyword set from modal. Updates FB, not the store directly
  async addNewKeywordSet(label, keywordSetToDuplicate) {
    if (!label) {
      throw new Error('Label required to create a new keyword set', label)
    }
    const newKeywordSet = await s.createNewKeywordSet(this, keywordSetToDuplicate)
    const newKeywordSetKey = this.db.ref().child('keywordSets').push().key
    const updates = {
      [`/keywordSets/${newKeywordSetKey}`]: {label: label},
      [`/includeKeywords/${newKeywordSetKey}`]: newKeywordSet.includeKeywords,
      [`/excludeKeywords/${newKeywordSetKey}`]: newKeywordSet.excludeKeywords,
      [`/currentSession/keywordSet`]: newKeywordSetKey,
    }
    this.db.ref().update(updates)
    this.ui.showKeywordSetModal = false
  }

  // == Data Loading ===========================================================
  @computed get totalRecordsCountFormatted() {return Number(this.totalRecordsCount).toLocaleString()}
  @computed get filteredRecordCountFormatted() {return Number(this.filteredRecordCount).toLocaleString()}

  @action switchCurrentKeywordSet(keywordSetKey) {
    this.db.ref('/currentSession').update({keywordSet: keywordSetKey})
  }

  @action switchCurrentPermitSet(permitSetKey) {
    this.db.ref('/currentSession').update({permitSet: permitSetKey})
    this.ui.showPermitSetModal = false
  }

  // == Keyword Classification =================================================
  // Update Firebase onChange of keyword textarea. updateCurrentKeywords() updates UI through autorun
  // Store it as a string, then when updating classification, convert it to an array
  @action updateIncludeKeywords(classification, words) {
    this.includeKeywordsRef.set({...this.includeKeywords, [classification]: words})
  }

  @action updateExcludeKeywords(classification, words) {
    this.excludeKeywordsRef.set({...this.excludeKeywords, [classification]: words})
    // this.excludeKeywordsRef = {...this.excludeKeywords, [classification]: words}
  }

  @action updateClassifications() {
    this.classifications = s.classify(this.includeKeywords, this.excludeKeywords, this.records)
  }


  @action updateOrAddClassificationDef(newDefinition) {
    s.updateOrAddClassificationDefFB({
      newDefinition,
      classificationDefs: this.classificationDefs,
      classificationDefsRef: this.classificationDefsRef,
      includeKeywordSetsRef: this.includeKeywordSetsRef,
      excludeKeywordSetsRef: this.excludeKeywordSetsRef
    })
  }

  @action deleteClassificationDefinition(abbreviation) {
    if (_.size(this.classificationDefs) > 1) {
      s.deleteClassificationDefinitionFB(abbreviation, this.classificationDefsRef, this.includeKeywordSetsRef, this.excludeKeywordSetsRef)
    } else {
      this.ui.lastErrorMessage = 'You cannot delete the last classification definition or else all hell breaks loose'
    }
  }

  // == Search, Category & PermitType Filters ==============================================
  @action updateSearchString(searchString) {
    this.searchString = searchString
    this.filteredRecordCount = s.filterSearch(this.searchString, this.dimensions)
  }

  @action updateCategoryFilters(abbreviation) {
    this.categoryFilters = s.updateCategoryFilters(abbreviation, this.categoryFilters)
    this.filteredRecordCount = s.filterCategories(this.categoryFilters, this.dimensions, this.classifications)
  }

  @action updatePermitTypeFilters(permitTypeArray) {
    this.permitTypeFilters.replace(permitTypeArray)
    this.filteredRecordCount = s.filterSelectBoxSelections(this.permitTypeFilters, 'permitTypes', this.dimensions)
  }

  @action updateBuildingCategoryFilters(buildingCategoryArray) {
    this.buildingCategoryFilters.replace(buildingCategoryArray)
    this.filteredRecordCount = s.filterSelectBoxSelections(this.buildingCategoryFilters, 'buildingCategory', this.dimensions)
  }

  // == Exporting data =========================================================
  @computed get abbreviations() {
    return _.map(this.classificationDefs, def => def.abbreviation)
  }

  @computed get exportColumns() {
    return s.exportColumns(this.records, this.abbreviations)
  }

  @computed get joinedRecords() {
    const filteredRecords = this.dimensions.id ? this.dimensions.id.bottom(Infinity) : []
    return s.joinRecords(filteredRecords, this.classifications, this.abbreviations)
  }

}


class UIStore {

  isOnlineRef = firebase.database().ref(".info/connected")

  constructor() {
    this.isOnlineRef.on('value', snap => {this.isOnline = snap.val()})
    // autorun(() => {console.log('showErrorModal: ', this.showErrorModal)})
  }

  @observable isOnline = true
  @observable isLoading = true
  @observable route = undefined
  @observable isUpdatingClassifications = false
  @observable showClassificationDefModal = false
  @observable classificationDefModalType = ''  // set as classification def when modal is triggered
  @observable showResetDefsModal = false
  @observable showExportModal = false
  @observable showKeywordSetModal = false
  @observable showPermitSetModal = false

  @observable lastErrorMessage = ''

  @action updateErrorMessage(msg) {
    // console.log('update: msg: ', msg)
    this.lastErrorMessage = msg
    // console.log('update: this.lastErrorMessage: ', this.lastErrorMessage)
  }

  @computed get showErrorModal() {
    // console.log('show: Boolean(this.lastErrorMessage): ', Boolean(this.lastErrorMessage))
    return Boolean(this.lastErrorMessage)
  }

}


const uiStoreInstance = new UIStore()
export default function() {
  return new ModelStore(uiStoreInstance)
}


/* TODO:
 * Use app manifest so that the app can start up offline: https://www.youtube.com/watch?v=SobXoh4rb58
 * update classificationDefs to object and fix references (for Firebase... or maybe not):
 {
   EL: {color: ..., label: ..., textColor: ...}
   PB: {color: ..., label: ..., textColor: ...}
 }
 * Figure out why loading button indicator isn't working: b/c it's blocking the main thread
 * Figure out why loadRecords() blocks UI: b/c it's blocking the main thread
 * See notes below on background processes
 * Wrap loadRecords in transaction(?)
 */


/* Notes on background processing
Three options to get background processing:
1. Webworkers:
Webworkers in Electron can't use `fs` to load the large records array. So:
a) Send large `records` array to the worker and back every time. If it can use
structural sharing for the copy then it may end up being faster, but not ideal
b) Use xhr in the webworker and an API route on the server. I think the webworker
can be created when the app starts, so the records can be loaded in the background.
Then when we need to calculate `classify()` then we just send the classification
definitions to the worker and get back the results. Still passing back the classification
array will be someewhat expensive

2. Set up a background Electron window and communicate with it via IPC.
Lib and blog post: http://blog.smith-kyle.com/background-processes-in-electron/
I couldn't get this working. I want to wait until I and they can upgrade to
Electron ^1. Also this is a great post: https://blog.axosoft.com/tag/electron-js/
*/
