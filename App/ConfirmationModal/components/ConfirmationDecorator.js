import React, { Component } from 'react'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  StyleSheet, Modal, View, TouchableWithoutFeedback, Text, Image
} from 'react-native'

import fonts from '../../Common/fonts'
import colors from '../../Common/colors'
import Button from '../../Common/Button'
import * as selectors from '../confirmationModal.selectors'
import { vacancyModalTypes } from '../confirmationModal.constants'
import { getCompanyInfo } from '../../Profile/profile.selectors'
import { hideModal, modalYes, modalNo } from '../confirmationModal.actions'

import ModalBody from './ModalBody'
import MatchModal from './MatchModal'
import ModalHeader from './ModalHeader'
import ModalButtons from './ModalButtons'

const HEIGHT_WITH_DESCRIPTION = 220
const HEIGHT_WITHOUT_DESCRIPTION = 180

const decorator = WrappedComponent => ({
  visible, modalType, dismissable, hideModal, modalYes, modalNo, companyUrl,
  modalOptions: { hasCancel, title, description, candidatePhoto, candidateName, titleHighlight },
  ...rest
}) => {
  return <View style={{flex: 1}}>
    <WrappedComponent {...rest} />
    <Modal visible={visible} transparent animationType={'none'} onRequestClose={modalNo}>
      <TouchableWithoutFeedback onPress={
        dismissable
          ? hasCancel
            ? modalNo
            : modalYes
          : null
        }>
        <View style={[
          styles.fullView,
          modalType === vacancyModalTypes.matchModal && {justifyContent: 'flex-start'}
        ]}>
          {
            modalType === vacancyModalTypes.matchModal
              ? <MatchModal
                  modalNo={modalNo}
                  modalYes={modalYes}
                  companyUrl={companyUrl}
                  candidateName={candidateName}
                  candidatePhoto={candidatePhoto}
                />
              : <View style={[styles.modalContainer, !description && {height: HEIGHT_WITHOUT_DESCRIPTION}]}>
                <ModalHeader type={modalType} photoUrl={candidatePhoto} />
                <ModalBody title={title} description={description} titleHighlight={titleHighlight} />
                <ModalButtons
                  type={modalType}
                  cancel={modalNo}
                  confirm={modalYes}
                  hasCancel={hasCancel}
                  />
              </View>
          }
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  </View>
}

const styles = StyleSheet.create({
  fullView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    width: 300,
    height: HEIGHT_WITH_DESCRIPTION,
    borderRadius: 8
  }
})

const mapStateToProps = state => ({
  visible: selectors.getModalVisibility(state),
  dismissable: selectors.getModalDismissable(state),
  companyUrl: getCompanyInfo(state).companyLogo,
  modalType: selectors.getModalType(state),
  modalOptions: selectors.getModalOptions(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  hideModal, modalYes, modalNo
}, dispatch)

export default WrappedComponent =>
  connect(mapStateToProps, mapDispatchToProps)(decorator(WrappedComponent))
