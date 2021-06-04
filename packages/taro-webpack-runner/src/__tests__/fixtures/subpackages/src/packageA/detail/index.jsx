import React, { Component } from 'react'
import { View, Text } from '@agreejs/components'
import './index.css'

export default class Detail extends Component {
  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='detail'>
        <Text>I m detail</Text>
      </View>
    )
  }
}
