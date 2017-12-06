import * as actionTypes from './confirmationModal.constants'

const showModal = (modalInfo) => ({
  type: actionTypes.SHOW_MODAL,
  payload: {
    modalType: modalInfo.modalType,
    options: modalInfo.options
  }
})

const hideModal = () => ({
  type: actionTypes.HIDE_MODAL
})

const modalYes = () => ({
  type: actionTypes.MODAL_YES
})

const modalNo = () => ({
  type: actionTypes.MODAL_NO
})

export {
  showModal,
  hideModal,
  modalYes,
  modalNo
}
