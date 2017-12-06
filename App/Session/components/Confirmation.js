import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions } from 'react-native-router-flux'
import { View, StyleSheet, Dimensions, Image } from 'react-native'

import Assets from '../../Images'
import fonts from '../../Common/fonts'
import Button from '../../Common/Button'
import colors from '../../Common/colors'
import { userRegistered } from '../../Session/session.actions'

const { width, height } = Dimensions.get('window')

class Confirmation extends Component {
  constructor (props) {
    super(props)
    this.timeout = null
    this.state = {
      showAnimation: true
    }
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  getStarted = () => {
    const { userRegistered } = this.props
    userRegistered(true)
    Actions.tutorial()
  }

  render () {
    const { showAnimation } = this.state
    if (showAnimation) {
      this.timeout = setTimeout(() => {
        this.setState({
          showAnimation: false
        })
      }, 1500)
    }

    return (
      <View style={styles.screenView}>
        <View>
          {
            showAnimation
              ? <Image style={styles.image} source={Assets.common.registeredGif} resizeMode={'cover'} />
              : <Image style={[styles.image, {width: 307, height: 307, marginTop: 67}]} source={Assets.common.registeredStatic} resizeMode={'contain'} />
          }
        </View>
        <View style={styles.buttonContainer}>
          <Button btnStyle={[styles.confirmButton, showAnimation && {marginTop: 2}]}
            onPress={this.getStarted} >
            {I18n.t('buttons.getStarted')}
          </Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screenView: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'space-around',
    width: width,
    height: height
  },
  image: {
    marginTop: 70,
    alignSelf: 'center',
    width: 300,
    height: 300,
    borderRadius: 100
  },
  buttonContainer: {
    width: width - 100,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  confirmButton: {
    flex: 1,
    alignSelf: 'center'
  },
  textContainer: {
    alignSelf: 'center',
    marginTop: 13
  },
  textStyle: {
    fontFamily: fonts.openSansLight,
    fontSize: 20,
    textAlign: 'center',
    color: colors.dark,
    letterSpacing: -0.3
  }
})

Confirmation.propTypes = {
  profileCompleted: PropTypes.func
}

const mapDispatchToProps = dispatch => bindActionCreators({
  userRegistered
}, dispatch)

export default connect(null, mapDispatchToProps)(Confirmation)
