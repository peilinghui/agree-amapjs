import React, { Component } from 'react'
import { View, Text } from '@agreejs/components'
import './index.scss'

export default class Index extends Component {
  render () {
    return (
      <View className='title'>
        <Text>{this.props.title}</Text>
      </View>
    )
  }
}
