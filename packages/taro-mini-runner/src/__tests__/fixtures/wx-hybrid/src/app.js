import Taro from '@agreejs/taro'
import React from 'react'

import './app.scss'

class App extends React.Component {
  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return (
      this.props.children
    )
  }
}

export default App