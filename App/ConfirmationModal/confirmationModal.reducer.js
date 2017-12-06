import { fromJS } from 'immutable'
import * as actionTypes from './confirmationModal.constants'

const initialState = fromJS({
  visible: false,
  modalType: null,
  options: {
    dismissable: true,
    hasCancel: true,
    title: null,
    description: null,
    candidatePhoto: null,
    candidateName: null,
    titleHighlight: null
  }
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SHOW_MODAL:
      const { modalType, options } = action.payload
      return state.merge({ visible: true, modalType, options })
    case actionTypes.MODAL_NO:
    case actionTypes.MODAL_YES:
    case actionTypes.HIDE_MODAL:
      return initialState
    default:
      return state
  }
}
