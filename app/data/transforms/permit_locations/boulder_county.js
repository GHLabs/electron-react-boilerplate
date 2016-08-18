import _ from 'lodash'
import moment from 'moment'
import {sanitizeDescription, stripCost} from '../utils'


// Filtering out non residential
export function boulderCity(rows) {
  return _(rows)
    .filter(d => !_.includes(['NonResidential'], d["CATEGORY"]))
    .map((d, index) => ({
      id: index,
      permitId: _.trim(d["CASE NUMBER"]),
      assessorId: _.padStart(_.trim(d["ASSESSOR ID"]), 7, 0),
      category: _.trim(d["CATEGORY"]),                    // Maps to Building Category in UI
      // use: _.trim(d["BUILING USES AND WORK SCOPES"]),  // Not currently used
      type: _.trim(d["PERMIT TYPES"]),                    // Maps to Permit Types dropdown in UI
      description: d["NARRATIVE DESCRIPTION"],
      sanitizedDescription: sanitizeDescription(d["NARRATIVE DESCRIPTION"]),
      jobCost: stripCost(d["TOTAL PROJECT VALUE"]) || stripCost(d["TOTAL SUBPERMIT VALUE"]) || 0,
      year: moment(d["APPLIED"], 'M/D/YY').format('YYYY')
    }))
    .compact()
    .value()
}


// Filtering out non residential
export function boulderUnincorporated(rows) {
  return _(rows)
    .filter(d => d["PermitClassMapped"] !== 'Non-Residential')
    .map((d, index) => ({
      id: index,
      permitId: _.trim(d["PermitNum"]),
      parcelId: _.trim(d["PIN"]),
      category: _.trim(d["PermitClass"]),
      // use: _.trim(d["PermitClass"]),
      type: _.trim(d["PermitType"]),
      description: d["Description"],
      sanitizedDescription: sanitizeDescription(d["Description"]),
      jobCost: stripCost(d["EstProjectCost"]),
      year: moment(d["AppliedDate"], 'YYYY-MM-DD').format('YYYY')
    }))
    .compact()
    .value()
}


export function louisville(rows) {
  return _(rows)
    .filter(d => d["Parcel"])
    .map((d, index) => ({
      id: index,
      permitId: _.trim(d["Activity"]),
      parcelId: _.trim(d["Parcel"]),
      category: _.trim(d["Type"]),
      // use: _.trim(d["PermitClass"]),
      type: _.trim(d["Sub Type"]),
      description: d["Description"],
      sanitizedDescription: sanitizeDescription(d["Description"]),
      jobCost: stripCost(d["Valuation"]) || stripCost(d["Valuation2"]) || stripCost(d["Valuation3"]) || 0,
      year: moment(d["DATE_B"], 'MM/DD/YYYY').format('YYYY')
    }))
    .compact()
    .value()
}
