import _ from 'lodash'
import {action} from 'mobx'


export function getPermitTypeSet(records: Array): Array {
  return _(records)
    .flatMap(record => _.split(record.type, ','))
    .map(_.trim)
    .uniq()
    .value()
}
