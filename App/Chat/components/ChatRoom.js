import React from 'react'
import _ from 'lodash'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import Config from 'react-native-config'
import { bindActionCreators } from 'redux'
import { Actions, ActionConst } from 'react-native-router-flux'
import { GiftedChat, Bubble, MessageText, Message, Composer, Send } from 'react-native-gifted-chat'
import {
  View, StyleSheet, NativeModules, NativeEventEmitter,
  DeviceEventEmitter, Platform, Image, Text, Dimensions, AppState
} from 'react-native'

import selectors from '../chat.selectors'
import { sendMessage, addMessage, setSession, getRoomMessages, fetchCurrentEmployeeProfileAndGo } from '../chat.actions'

import fonts from 'common/fonts'
import bugsnag from '../../Config/BugsnagConfig'
import colors from 'common/colors'
import SealHeader from 'common/SealHeader'
import Assets from '../../Images'

const TOKBOX_API_KEY = Config.TOKBOX_API_KEY
const OpenTok = Platform.OS === 'ios' ? NativeModules.OpenTokIOS : NativeModules.OpenTokAndroid

const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.lightBlue
  },
  headerButtonText: {
    color: 'white',
    fontWeight: '300'
  },
  headerTitle: {
    color: 'white',
    fontWeight: '400'
  },
  noChats: {
    alignItems: 'center',
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    bottom: 40
  },
  image: {
    width: 106,
    height: 81,
    marginTop: 60
  },
  noMessagesText: {
    marginTop: 25,
    width: width - 30 * 2,
    fontFamily: fonts.openSansRegular,
    color: colors.placeholderGray,
    fontSize: 16,
    letterSpacing: -0.3,
    textAlign: 'center'
  }
})

let alreadyPressedBackBtn = false

class Chat extends React.Component {
  constructor (props) {
    super(props)
    this.interval = null
    this.state = {
      cameraColor: 'white',
      isConnected: false,
      messages: []
    }

    this.emitter = Platform.OS === 'ios' ? new NativeEventEmitter(OpenTok) : DeviceEventEmitter
  }

  componentWillReceiveProps (props) {
    let { tokboxToken, sessionId } = props.room

    // if (this.props.fromNotification) {
    //   tokboxToken = this.props.tokboxKeysBackup.tokboxToken
    //   tokboxSessionId = this.props.tokboxKeysBackup.tokboxSessionId
    // } else {
    //   tokboxToken = this.props.tokboxKeys.tokboxToken
    //   tokboxSessionId = this.props.tokboxKeys.tokboxSessionId
    // }

    if (sessionId && tokboxToken && !this.state.isConnected) {
      this.setState({ isConnected: true })

      OpenTok.connect(
        TOKBOX_API_KEY,
        sessionId,
        tokboxToken,
        err => {
          this.setState({ isConnected: false })
          console.log('connect >', err)
        }
      )
    }
    let messages = props.room ? props.room.messages : null
    if (messages) {
      this.mapMessages(messages)
    }
  }

  componentDidMount () {
    bugsnag.leaveBreadcrumb('Navigated to chat room', {
      type: 'navigation',
      component: '<Chat />',
      previousScreen: 'ChatRooms'
    })
    alreadyPressedBackBtn = false
    // console.log('IdleTimerManager', IdleTimerManager)
    // IdleTimerManager.setIdleTimerDisabled(true)
    let messages = this.props.room ? this.props.room.messages : null
    if (messages) {
      this.mapMessages(messages)
    }

    let { tokboxToken, sessionId } = this.props.room

    if (sessionId && tokboxToken && !this.state.isConnected) {
      bugsnag.leaveBreadcrumb('Connecting to Opentok', {
        type: 'request',
        tokboxToken,
        sessionId
      })

      this.setState({ isConnected: true })

      OpenTok.connect(
        TOKBOX_API_KEY,
        sessionId,
        tokboxToken,
        err => {
          this.setState({ isConnected: false })
          console.log('connect >', err)
        }
      )
    }

    this.addListeners()
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange = (appState) => {
    bugsnag.leaveBreadcrumb('Handle app state change in chat room', {
      type: 'process',
      appState
    })
    if (appState === 'background') {
      OpenTok.disconnect(err => console.error(`Error on disconnect: ${err}`))
      this.removeListeners()
    }
    if (appState === 'active') {
      let { tokboxToken, sessionId, id } = this.props.room
      let { getRoomMessages } = this.props

      OpenTok.connect(
        TOKBOX_API_KEY,
        sessionId,
        tokboxToken,
        err => console.log('connect >', err)
      )
      this.addListeners()
      getRoomMessages(id)
    }
  }

  componentWillUnmount () {
    bugsnag.leaveBreadcrumb('Chat room will unmount', { type: 'navigation' })
    // IdleTimerManager.setIdleTimerDisabled(false)
    this.setState({isConnected: false})
    clearInterval(this.interval)
    OpenTok.disconnect(err => console.error(`Error on disconnect: ${err}`))
    this.removeListeners()
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  addListeners = () => {
    bugsnag.leaveBreadcrumb('Adding chat event listeners', { type: 'process' })
    this.onConnectListener = this.emitter.addListener(OpenTok.onSessionConnect, this.onConnect)
    this.onReceiveListener = this.emitter.addListener(OpenTok.onMessageReceived, this.onReceive)
    this.onDisconnectListener = this.emitter.addListener(OpenTok.onSessionDisconnect, this.onDisconnect)
  }

  removeListeners = () => {
    bugsnag.leaveBreadcrumb('Remove chat event listeners', { type: 'process' })
    if (this.onConnectListener) {
      this.onConnectListener.remove()
      DeviceEventEmitter.removeListener(OpenTok.onSessionConnect, this.onConnect)
      this.onConnectListener = null
    }
    if (this.onReceiveListener) {
      this.onReceiveListener.remove()
      DeviceEventEmitter.removeListener(OpenTok.onMessageReceived, this.onReceive)
      this.onReceiveListener = null
    }
    if (this.onDisconnectListener) {
      this.onDisconnectListener.remove()
      DeviceEventEmitter.removeListener(OpenTok.onSessionDisconnect, this.onDisconnect)
      this.onDisconnectListener = null
    }
  }

  onConnect = (session) => {
    bugsnag.leaveBreadcrumb('OpenTok successful connect', { type: 'process' })
    this.props.setSession(session)
    this.setState({isConnected: true})
  }

  onDisconnect = (session) => {
    bugsnag.leaveBreadcrumb('OpenTok disconnect', { type: 'process' })
    if (this.state.isConnected) {
      console.warn(`Dropped OpenTok connection.`)
    }
    this.props.setSession({})
    console.log(`session did disconnect`)
  }

  onReceive = (data) => {
    const { room: { id, messages }, session } = this.props
    const { body, createdAt, messageId } = JSON.parse(data.message)
    const { connectionId } = data
    let { addMessage } = this.props

    /* Stupid proof start */
    let foundMessageIndex = messages.findIndex(item => {
      return item.id === messageId
    })

    if (foundMessageIndex !== -1) {
      return
    }
    /* Stupid proof end
        - sometimes OpenTok emits the event twice for the same message specially for android
    */

    bugsnag.leaveBreadcrumb('Chat receive data', { type: 'process', id, messageId })

    // ignore call message
    if (body.includes(`class='videochat-invitation'`)) {
      return
    }

    let fromEmployee = !(connectionId === session.connectionId)
    addMessage(id, {
      id: messageId,
      body,
      createdAt,
      fromEmployee,
      messageType: 'textMessage'
    })
  }

  onSend = (messages = []) => {
    const { text } = messages[0]
    const msg = {
      message: {
        body: text,
        fromEmployee: false,
        messageType: 'textMessage'
      },
      connectionCount: 1
    }

    bugsnag.leaveBreadcrumb('Chat send message', { type: 'process', msg })

    this.props.sendMessage(this.props.room.id, msg)
  }

  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: { borderRadius: 12, backgroundColor: colors.white },
          right: { borderRadius: 12, backgroundColor: colors.lightBlue }
        }}
      />
    )
  }

  renderMessageText = (props) =>
    <MessageText
      {...props}
      textStyle={{
        left: { color: colors.dark, fontSize: 14 },
        right: { color: colors.white, fontSize: 14 }
      }}
    />

  mapMessages = (messages) => {
    this.setState({
      messages: messages.map(m => ({
        _id: m.id,
        text: m.body,
        createdAt: new Date(m.createdAt),
        user: {
          _id: m.fromEmployee ? 2 : 1
        }
      })).sort((a, b) => b.createdAt - a.createdAt)
    })
  }

  renderMessage = (props) =>
    <Message
      {...props}
      containerStyle={{
        left: { justifyContent: 'flex-start', marginLeft: -30 },
        right: { justifyContent: 'flex-start', marginRight: 10 }
      }}
    />

  renderSend = (props) => (<Send {...props} label={I18n.t('chat.sendMessage')} />)

  renderComposer = (props) => (<Composer {...props} placeholder={I18n.t('chat.typeAMessage')} />)

  goBackToChatRooms = () => {
    bugsnag.leaveBreadcrumb('Leave chat room', { type: 'navigation' })
    Actions.chatTab({ type: ActionConst.REPLACE })
  }

  backButtonAction = (fromNotification) => () => {
    if (alreadyPressedBackBtn) return
    alreadyPressedBackBtn = true

    if (fromNotification) {
      this.goBackToChatRooms()
    } else {
      Actions.pop()
    }
  }

  goToProfile = () => {
    const { fetchCurrentEmployeeProfileAndGo, room: { employeeId } } = this.props
    fetchCurrentEmployeeProfileAndGo(employeeId)
  }

  render () {
    const { messages } = this.state
    const { room, fromNotification } = this.props

    return (
      <View style={{flex: 1, backgroundColor: colors.background}}>
        <SealHeader
          title={`${room.employeeFirstName} ${room.employeeLastName}`}
          titleFn={this.goToProfile}
          titleIcon='forward'
          leftIconSize={13}
          rightIconSize={13}
          leftBtnText={'icon-back'}
          rightBtnFn={null}
          leftBtnFn={_.throttle(this.backButtonAction(fromNotification), 5000)}
        />
        {
          messages && messages.length === 0 &&
          <View style={styles.noChats}>
            <Image
              resizeMode={'contain'}
              style={styles.image}
              source={Assets.common.chatRoomPlaceholder}
            />
            <Text style={styles.noMessagesText}>
              {I18n.t('chat.noMessages')}
            </Text>
          </View>
        }
        <GiftedChat
          bottomOffset={0}
          user={{ _id: 1 }}
          onSend={this.onSend}
          renderSend={this.renderSend}
          messages={this.state.messages}
          renderBubble={this.renderBubble}
          renderMessage={this.renderMessage}
          renderComposer={this.renderComposer}
          renderMessageText={this.renderMessageText}
          renderInputToolbar={this.renderInputToolbar}
        />
      </View>
    )
  }
}

const mapStateToProps = (state, props) => ({
  room: selectors.getRoom(state, props.roomId),
  session: selectors.getSession(state)
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  sendMessage, addMessage, setSession, getRoomMessages, fetchCurrentEmployeeProfileAndGo
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
