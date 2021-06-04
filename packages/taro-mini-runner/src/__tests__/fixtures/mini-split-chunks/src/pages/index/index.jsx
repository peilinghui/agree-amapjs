import React, { Component } from 'react'
import { View } from '@agreejs/components'
import Taro from '@agreejs/taro'
import consoleLogMain from '../../utils/consoleLogMain'

export default class Index extends Component {
  componentDidMount() {
    consoleLogMain()
  }

  render () {
    return (
      <View className='index'>
        <View onClick={() => Taro.navigateTo({ url: '/packageA/detail/index' })}>
          Go to detail
        </View>
        <View onClick={() => Taro.navigateTo({ url: '/packageA/my/index' })}>
          Go to my
        </View>
        <View onClick={() => Taro.navigateTo({ url: '/packageB/list/index' })}>
          Go to list
        </View>
      </View>
    )
  }
}
