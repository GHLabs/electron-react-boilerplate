import _ from 'lodash'


export function stripCost(costString) {
  const costFloat = _.trim(costString).replace(/[$,]+/g, "")
  return costFloat
    ? parseInt(costFloat, 10)
    : 0
}

export function sanitizeDescription(rawText) {
  const sanitized = _.flow(
      consistentHyphens,
      removeLineBreaks,
      padPeriods,
      padCommas,
      padAmpersands,
      padDash,
      padLeftParen,
      padRightParen,
      padSlash,
      compactSpaces,
      _.trim,
      _.toLower,
      _.deburr
    )(rawText)
  // console.log('rawText: ', rawText)
  // console.log('sanitized: ', sanitized)
  return sanitized
}


// Make sure there is at least one space on each side of the period.
// This is to make sure that when a user adds a space at the end of a word, it matches
// the last word in a sentence.
// Make sure this is called first so we can compact extra spaces.
// TODO: Couldn't all of these be done in a single function?
function padPeriods(rawText) {
  return String(rawText).split('.').join(' . ')
}
function padCommas(rawText) {
  return String(rawText).split(',').join(' , ')
}
function padAmpersands(rawText) {
  return String(rawText).split('&').join(' & ')
}
function padDash(rawText) {
  return String(rawText).split('-').join(' - ')
}
function padLeftParen(rawText) {
  return String(rawText).split('(').join(' ( ')
}
function padRightParen(rawText) {
  return String(rawText).split(')').join(' ) ')
}
function padSlash(rawText) {
  return String(rawText).split('/').join(' / ')
}
// compress all multiple spaces in a sentence into single spaces
function compactSpaces(rawText) {
  return _.compact(String(rawText).split(' ')).join(' ')
}
function removeLineBreaks(rawText) {
  return String(rawText).replace(/\r?\n|\r/g, ' ')
}

// Replace emdash, endash and hyphens with a hyphen
function consistentHyphens(rawText) {
  // if (/[—]/.test(rawText)) { console.log('emdash: ', rawText) }
  // if (/[–]/.test(rawText)) { console.log('endash: ', rawText) }
  // if (/[-]/.test(rawText)) { console.log('hyphen: ', rawText) }
  const re = /[—–-]/g     // checking for 3 different kinds of dashes
  return String(rawText).replace(re, '-')
}
