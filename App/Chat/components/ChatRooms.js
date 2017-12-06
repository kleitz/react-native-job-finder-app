import { connect } from 'react-redux'

import I18n from 'react-native-i18n'
import { bindActionCreators } from 'redux'
import { Actions } from 'react-native-router-flux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native'

import bugsnag from '../../Config/BugsnagConfig'
import colors from '../../Common/colors'
import NoChatRooms from './NoChatRooms'
import ChatRoomItem from './ChatRoomItem'
import SealHeader from '../../Common/SealHeader'
// import NoInternetCard from '../../netInfo/components/NoInternetCard'

import { getRooms, getRoomMessages, setRoomBubble } from '../chat.actions'
import * as loaderSelectors from '../../Utility/loaders/loaders.selectors'
import { isToday, isYesterday, format, valueOf } from '../../Utility/dateUtils'
import utils from '../../Utility/utils'
import selectors from '../chat.selectors'

let T = utils.translateHelper('chat')

class ChatRooms extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      refreshing: false
    }
  }
  componentDidMount () {
    bugsnag.leaveBreadcrumb('[Chat rooms]-> component did mount', { type: 'request' })
    const { getRooms } = this.props
    getRooms()
  }

  pullToRefresh = () => {
    bugsnag.leaveBreadcrumb('[Chat rooms]-> pull to refresh', { type: 'request' })
    const { getRooms } = this.props
    getRooms()
  }

  mapRooms = (chatRooms) => {
    return chatRooms
      ? chatRooms
        .sort((a, b) => valueOf(b.latestMessageTime) - valueOf(a.latestMessageTime))
        .map((cr, index) => {
          let room = Object.assign({}, cr)
          if (room.latestMessageTime && isToday(room.latestMessageTime)) {
            room.latestMessageTime = T('today')
          } else if (room.latestMessageTime && isYesterday(room.latestMessageTime)) {
            room.latestMessageTime = T('yesterday')
          } else if (room.latestMessageTime) {
            room.latestMessageTime = format(room.latestMessageTime, 'DD/MM/YYYY')
          } else {
            room.latestMessageTime = ''
          }
          return this.createChatRoomCard(room, index)
        })
      : null
  }

  createChatRoomCard = (room, index) => {
    const { loading } = this.state
    return (
      <ChatRoomItem
        key={index}
        room={room}
        loading={loading}
        roomSelected={this.onRoomSelected}
      />
    )
  }

  onRoomSelected = (room) => {
    bugsnag.leaveBreadcrumb('[Chat rooms]-> select chat room', { type: 'navigation', room })
    const { setRoomBubble, getRoomMessages } = this.props
    getRoomMessages(room.id)
    if (room.unreadCount > 0) {
      setRoomBubble(room.id, 0)
    }

    Actions.chatRoom({roomId: room.id})
  }

  render () {
    const { chatRooms, refreshing } = this.props
    const rooms = this.mapRooms(chatRooms)
    return (
      <View style={styles.container}>
        <SealHeader title={T('title')} />
        {
          rooms.length
          ? <ScrollView
            style={styles.roomList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.pullToRefresh}
              />
            }
          >
            {rooms}
          </ScrollView>
          : <NoChatRooms />
        }
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1
  },
  roomList: {
    backgroundColor: colors.background,
    flex: 1
  }
})

ChatRooms.propTypes = {
  getRooms: PropTypes.any,
  chatRooms: PropTypes.any,
  getRoomMessages: PropTypes.any
}

const mapStateToProps = state => ({
  chatRooms: selectors.getRooms(state),
  refreshing: loaderSelectors.getRefreshChatRoomsLoader(state)
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getRooms, getRoomMessages, setRoomBubble
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ChatRooms)
