import React, { Component } from 'react'
import { View, Text } from '@agreejs/components'
import Taro from '@agreejs/taro'
import './index.css'

export default class Index extends Component {
  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text onClick={() => {
          Taro.navigateTo({ url: '/packageA/detail/index' })
        }}>Hello world!</Text>
      </View>
    )
  }
}
