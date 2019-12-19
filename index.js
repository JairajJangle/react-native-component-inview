import React, { Component } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'

export interface Iprops {
  disabled: boolean
}

const InViewPort = class extends Component<Iprops> {
  constructor(props: Iprops) {
    super(props)
    this.state = { rectTop: 0, rectBottom: 0 }
  }

  componentDidMount() {
    if (!this.props.disabled) {
      this.startWatching()
    }
  }

  componentWillUnmount() {
    this.stopWatching()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled) {
      this.stopWatching()
    } else {
      this.lastValue = null
      this.startWatching()
    }
  }

  startWatching() {
    if (this.interval) {
      return
    }
    this.interval = setInterval(() => {
      if (!this.myview) {
        return
      }
      this.myview.measure((x, y, width, height, pageX, pageY) => {
        this.setState({
          rectTop: pageY,
          rectBottom: pageY + height,
          rectWidth: pageX + width
        })
      })
      this.isInViewPort()
    }, this.props.delay || 100)
  }

  stopWatching() {
    this.interval = clearInterval(this.interval)
  }

  isInViewPort() {
    const window = Dimensions.get('window')
    const isVisible =
      this.state.rectBottom != 0 &&
      this.state.rectTop >= 0 &&
      this.state.rectBottom <= window.height &&
      this.state.rectWidth > 0 &&
      this.state.rectWidth <= window.width
    if (this.lastValue !== isVisible) {
      this.lastValue = isVisible
      this.props.onChange(isVisible)
    }
  }

  render() {
      return (
        <View
          ref={component => {
          this.myview = component
          }}
          {...this.props}
        >
          <View style={styles.text}>
            <Text>⬇ This is the offer that we're tracking</Text>
          </View>
        </View>
      )
  }
}

const styles = StyleSheet.create({
  text: {
    backgroundColor: 'red',
  }
})

export default InViewPort
