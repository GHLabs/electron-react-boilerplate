import _ from 'lodash'
import {action} from 'mobx'


export function getBuildingCategorySet(records: Array): Array {
  return _(records)
    .flatMap(record => _.split(record.category, ','))
    .map(_.trim)
    .uniq()
    .value()
}
