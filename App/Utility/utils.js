import I18n from 'react-native-i18n'
import { fromJS } from 'immutable'

const formatAddress = ({companyStreet, companyStreetNumber, companyCity, companyZip}) => {
  return [
    companyStreet,
    companyStreetNumber,
    companyCity,
    companyZip
  ].filter(item => !!item)
  .join(', ')
}

const isPhoneValid = (phoneNumber) => {
  const phoneRegex = /^\+?([0-9]){10,10}$/
  return phoneRegex.test(phoneNumber)
}

const translateHelper = prefix => (sufix, config) => I18n.t(`${prefix}.${sufix}`, config)

const stripTextOfHTML = (richText) => {
  return richText.replace(/<\/?[^>]+(>|$)/g, '')
}

/*
// Used to merge two Immutable list by a specified key (default 'id')
*/
const mergeBy = (list1, list2, by = 'id') => {
  let m = fromJS([])
  list1.forEach((l1, outerIndex) => {
    list2.forEach((l2, innerIndex) => {
      if (l1.get(by) === l2.get(by)) {
        m = m.push(l1.merge(l2))
        list1 = list1.delete(outerIndex)
        list2 = list2.delete(innerIndex)
      }
    })
  })
  return m.concat(list2)
}

export default {
  formatAddress,
  isPhoneValid,
  translateHelper,
  stripTextOfHTML,
  mergeBy
}
