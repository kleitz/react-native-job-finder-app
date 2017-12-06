import { race, take, put } from 'redux-saga/effects'

import { SHOW_MODAL_REQUEST, MODAL_YES, MODAL_NO } from './confirmationModal.constants'
import { hideModal, showModal } from './confirmationModal.actions'

export function * confirmationSaga (modalInfo) {
  yield put(showModal(modalInfo))
  const result = yield race({
    yes: take(MODAL_YES),
    no: take(MODAL_NO)
  })

  yield put(hideModal())

  return !!result.yes
}
