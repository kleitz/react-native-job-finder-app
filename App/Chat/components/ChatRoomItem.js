import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
import {
  View, Text, Image, StyleSheet, TouchableWithoutFeedback, ActivityIndicator
} from 'react-native'

import fonts from '../../Common/fonts'
import colors from '../../Common/colors'
import SealIcon from '../../Common/SealIcon'
import ImageManager from '../../Images'

class ChatRoomCard extends Component {
  selectRoom = () => {
    this.props.roomSelected(this.props.room)
  }

  render () {
    let { room, loading } = this.props
    return (
        <TouchableWithoutFeedback onPress={!loading ? debounce(this.selectRoom, 5000, { leading: true, trailing: false }) : null}>
            <View style={styles.container} >
                {room.employeeImage !== null ?
                    <Image source={{uri: room.employeeImage}} style={styles.image} />
                    :
                    <Image source={ImageManager.common.companyAvatarPlaceholder} style={styles.image} />
                }
                <View style={styles.titleContainer}>
                    <Text style={styles.employeeName}>{`${room.employeeFirstName} ${room.employeeLastName}`}</Text>
                    <View style={styles.jobTitleContainer}>
                    <SealIcon name={'work'} color={colors.warmGrey} size={12} style={styles.jobIcon} />
                    <Text style={styles.jobTitle}>{room.latestJobName}</Text>
                    </View>
                </View>
                {
                    false &&
                    <ActivityIndicator color={colors.lightBlue} size={'small'} style={{marginRight: 10}} />
                }
                <View style={{alignItems: 'flex-end', marginLeft: 5}}>
                    <Text style={styles.lastActivity}>{room.latestMessageTime}</Text>
                    {
                    room.unreadCount !== 0
                    ? <View style={styles.unreadCountBalloon}>
                        <Text style={styles.unreadCount}>{room.unreadCount}</Text>
                    </View>
                    : null
                    }
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
    flexDirection: 'row',
    padding: 15
  },
  image: {
    width: 46,
    height: 46,
    borderRadius: 46 / 2
  },
  titleContainer: {
    flex: 1,
    marginLeft: 15
  },
  employeeName: {
    fontSize: 18,
    color: colors.dark
  },
  jobTitleContainer: {
    flexDirection: 'row',
    marginTop: 3
  },
  jobIcon: {
    marginTop: 3,
    marginRight: 6,
    height: 13
  },
  jobTitle: {
    color: colors.warmGrey,
    fontFamily: fonts.openSansLight,
    fontSize: 14
  },
  lastActivity: {
    color: colors.greyish,
    fontFamily: fonts.openSansLight,
    fontSize: 12
  },
  unreadCountBalloon: {
    alignItems: 'center',
    backgroundColor: colors.salmon,
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 12,
    width: 24,
    height: 24
  },
  unreadCount: {
    color: colors.white,
    fontSize: 12
  }
})

ChatRoomCard.propTypes = {
  room: PropTypes.shape({
    employeeImage: PropTypes.string,
    employeeFirstName: PropTypes.string,
    employeeLastName: PropTypes.string,
    latestMessageTime: PropTypes.string,
    unreadCount: PropTypes.number
  }),
  roomSelected: PropTypes.any,
  loading: PropTypes.bool
}

export default ChatRoomCard
