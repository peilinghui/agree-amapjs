import React, { Component } from 'react'
import { View } from '@agreejs/components'
import Taro from '@agreejs/taro'

export default class Index extends Component {
  render () {
    return (
      <View className='index'>
        <View onClick={() => Taro.navigateTo({ url: '/packageA/detail/index' })}>
          Go to detail
        </View>
        <View onClick={() => Taro.navigateTo({ url: '/packageA/my/index' })}>
          Go to my
        </View>
      </View>
    )
  }
}
