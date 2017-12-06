import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { RichTextEditor } from 'react-native-zss-rich-text-editor'
import I18n from 'react-native-i18n'

import colors from '../../../Common/colors'
import utils from '../../../Utility/utils'
import SealIcon from '../../../Common/SealIcon'

class TextEditor extends Component {
  constructor (props) {
    super(props)

    this.state = {
      toolbarButtons: {
        bold: false,
        italic: false,
        underline: false
      }
    }
  }

  onEditorInitialized = () => {
    this.richtext.setContentPlaceholder(I18n.t('createVacancy.descriptionScreen.placeholder'))
    this.focusEditor()
    this.richtext.registerContentChangeListener((richText) => {
      let plainText = utils.stripTextOfHTML(richText)
      this.props.onChangeText(plainText, richText)
    })
  }

  insertLink = () => {
    this.richtext.prepareInsert()
    this.richtext.getSelectedText().then(selectedText => {
      this.richtext.showLinkDialog(selectedText)
    })
  }

  focusEditor = () => {
    this.richtext.focusContent()
  }

  render () {
    const { editorHeight } = this.props
    return (
      <View style={[styles.container, {height: editorHeight}]}>
        <View style={styles.toolbar}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                toolbarButtons: {
                  ...this.state.toolbarButtons,
                  bold: !this.state.toolbarButtons.bold
                }
              })
              this.richtext.setBold()
            }}
            style={[styles.toolbarBtn, this.state.toolbarButtons.bold ? { backgroundColor: colors.lightBlue } : null]}>
            <SealIcon name='bold' size={16} style={[styles.toolbarBtnIcon, this.state.toolbarButtons.bold ? { color: colors.white } : null]} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                toolbarButtons: {
                  ...this.state.toolbarButtons,
                  italic: !this.state.toolbarButtons.italic
                }
              })
              this.richtext.setItalic()
            }}
            style={[styles.toolbarBtn, this.state.toolbarButtons.italic ? { backgroundColor: colors.lightBlue } : null]}>
            <SealIcon name='italic' size={16} style={[styles.toolbarBtnIcon, this.state.toolbarButtons.italic ? { color: colors.white } : null]} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                toolbarButtons: {
                  ...this.state.toolbarButtons,
                  underline: !this.state.toolbarButtons.underline
                }
              })
              this.richtext.setUnderline()
            }}
            style={[styles.toolbarBtn, this.state.toolbarButtons.underline ? { backgroundColor: colors.lightBlue } : null]}>
            <SealIcon name='underline' size={16} style={[styles.toolbarBtnIcon, this.state.toolbarButtons.underline ? { color: colors.white } : null]} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { this.richtext.insertBulletsList() }}
            style={styles.toolbarBtn}>
            <SealIcon name='bulletpoint' size={15} style={styles.toolbarBtnIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.insertLink}
            style={styles.toolbarBtn}>
            <SealIcon name='chain-links' size={16} style={styles.toolbarBtnIcon} />
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: colors.white, height: 10 }} />
        <RichTextEditor
          ref={(r) => { this.richtext = r }}
          style={styles.richText}
          hiddenTitle
          enableOnChange
          initialContentHTML={this.props.initialText}
          editorInitializedCallback={() => this.onEditorInitialized()}
        />
      </View>
    )
  }
}

TextEditor.propTypes = {
  onChangeText: PropTypes.func,
  initialText: PropTypes.string
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: colors.inputBorder
  },
  toolbar: {
    flexDirection: 'row',
    height: 35,
    borderBottomWidth: 1,
    borderColor: colors.inputBorder
  },
  toolbarBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.inputBorder,
    borderLeftWidth: 1
  },
  toolbarBtnIcon: {
    color: colors.lightBlue
  },
  richText: {
    bottom: 0
  }
})

export default TextEditor
