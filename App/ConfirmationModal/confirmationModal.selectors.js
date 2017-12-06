import { createSelector } from 'reselect'

const getConfirmationModal = state => state.get('confirmationModal')

const getModalVisibility = createSelector(
  getConfirmationModal,
  modal => modal.get('visible')
)

const getModalType = createSelector(
  getConfirmationModal,
  modal => modal.get('modalType')
)

const getModalOptions = createSelector(
  getConfirmationModal,
  modal => modal.get('options').toJS()
)

const getModalDismissable = createSelector(
  getConfirmationModal,
  modal => modal.get('options').get('dismissable')
)

export {
  getModalVisibility,
  getModalType,
  getModalOptions,
  getModalDismissable
}
