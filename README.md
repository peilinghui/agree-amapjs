# Taro

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![](https://img.shields.io/node/v/@tarojs/cli.svg?style=flat-square)](https://www.npmjs.com/package/@tarojs/cli)
[![](https://img.shields.io/npm/v/@tarojs/taro.svg?style=flat-square)](https://www.npmjs.com/package/@tarojs/taro)
[![](https://img.shields.io/npm/l/@tarojs/taro.svg?style=flat-square)](https://www.npmjs.com/package/@tarojs/taro)
[![](https://img.shields.io/npm/dt/@tarojs/taro.svg?style=flat-square)](https://www.npmjs.com/package/@tarojs/taro)
[![](https://img.shields.io/travis/NervJS/taro.svg?style=flat-square)](https://travis-ci.org/NervJS/taro)

[ç®ä½ä¸­æ](./README.md) | [English](./README_EN.md)

> ð½ Taro['tÉ:roÊ]ï¼æ³°ç½Â·å¥¥ç¹æ¼ï¼å®å®è­¦å¤éæ»æå®ï¼å®åæå¼ºçå¥¥ç¹æ¼ã

## ç®ä»

**Taro** æ¯ä¸ä¸ªå¼æ¾å¼è·¨ç«¯è·¨æ¡æ¶è§£å³æ¹æ¡ï¼æ¯æä½¿ç¨ React/Vue/Nerv ç­æ¡æ¶æ¥å¼åå¾®ä¿¡/äº¬ä¸/ç¾åº¦/æ¯ä»å®/å­èè·³å¨/ QQ å°ç¨åº/H5 ç­åºç¨ãç°å¦ä»å¸é¢ä¸ç«¯çå½¢æå¤ç§å¤æ ·ï¼WebãReact Nativeãå¾®ä¿¡å°ç¨åºç­åç§ç«¯å¤§è¡å¶éï¼å½ä¸å¡è¦æ±åæ¶å¨ä¸åçç«¯é½è¦æ±ææè¡¨ç°çæ¶åï¼éå¯¹ä¸åçç«¯å»ç¼åå¤å¥ä»£ç çææ¬æ¾ç¶éå¸¸é«ï¼è¿æ¶ååªç¼åä¸å¥ä»£ç å°±è½å¤ééå°å¤ç«¯çè½åå°±æ¾å¾æä¸ºéè¦ã

### çæ¬è¯´æ

å½å Taro å·²è¿å¥ 3.x æ¶ä»£ï¼ç¸è¾äº Taro 1/2 éç¨äºéè¿è¡æ¶çæ¶æï¼è®©å¼åèå¯ä»¥è·å¾å®æ´ç React/Vue ç­æ¡æ¶çå¼åä½éªï¼å·ä½è¯·åè[ãå°ç¨åºè·¨æ¡æ¶å¼åçæ¢ç´¢ä¸å®è·µã](https://mp.weixin.qq.com/s?__biz=MzU3NDkzMTI3MA==&mid=2247483770&idx=1&sn=ba2cdea5256e1c4e7bb513aa4c837834)ã

å¦æä½ æ³ä½¿ç¨ Taro 1/2ï¼å¯ä»¥è®¿é®[ææ¡£çæ¬](https://nervjs.github.io/taro/versions)è·å¾å¸®å©ã

## å­¦ä¹ èµæº

[5 åéä¸æ Taro å¼å](https://taro-docs.jd.com/taro/docs/guide)

[awesome-taro](https://github.com/NervJS/awesome-taro)

æéå°åï¼[Taro å¤ç«¯å¼åå®ç°åçä¸å®æ](https://juejin.im/book/5b73a131f265da28065fb1cd?referrer=5ba228f16fb9a05d3251492d)

## ç¤¾åºå±äº«

[Taro äº¤æµç¤¾åºââè®©æ¯ä¸æ¬¡äº¤æµé½è¢«æ²æ·](http://taro-club.jd.com/)

[Taro ç©æå¸åºââè®©æ¯ä¸ä¸ªè½®å­äº§çä»·å¼](http://taro-ext.jd.com/)

## ä½¿ç¨æ¡ä¾

Taro å·²ç»æå¥äºæä»¬ççäº§ç¯å¢ä¸­ä½¿ç¨ï¼ä¸çä¹å¨å¹¿æ³å°ä½¿ç¨ Taro å¼åå¤ç«¯åºç¨ã

<a href="https://nervjs.github.io/taro-user-cases/"><img src="https://raw.githubusercontent.com/NervJS/taro-user-cases/master/user-cases.jpg" /></a>

[å¾éæ´å¤ä¼ç§æ¡ä¾](https://github.com/NervJS/taro/issues/244)

## Taro ç¹æ§

### æ¡æ¶æ¯æ

#### React/Nerv æ¯æ

å¨ Taro 3 ä¸­å¯ä»¥ä½¿ç¨å®æ´ç React/Nerv å¼åä½éªï¼å·ä½è¯·åè[åºç¡æç¨ââReact](https://nervjs.github.io/taro/docs/react)

ä»£ç ç¤ºä¾

```javascript
import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'

export default class Index extends Component {
  state = {
    msg: 'Hello Worldï¼ '
  }
  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>{this.state.msg}</Text>
      </View>
    )
  }
}
```

#### Vue æ¯æ

å¨ Taro 3 ä¸­å¯ä»¥ä½¿ç¨å®æ´ç Vue å¼åä½éªï¼å·ä½è¯·åè[åºç¡æç¨ââVue](https://nervjs.github.io/taro/docs/vue)

ä»£ç ç¤ºä¾

```vue
<template>
  <view class="index">
    <text>{{msg}}</text>
  </view>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello World!'
    }
  },
  created () {},
  onShow () {},
  onHide () {}
}
</script>
```

### å¤ç«¯è½¬æ¢æ¯æ

Taro æ¹æ¡çåå¿å°±æ¯ä¸ºäºæé ä¸ä¸ªå¤ç«¯å¼åçè§£å³æ¹æ¡ã

ç®å Taro 3 å¯ä»¥æ¯æè½¬æ¢å° **å¾®ä¿¡/äº¬ä¸/ç¾åº¦/æ¯ä»å®/å­èè·³å¨/QQ å°ç¨åº** ä»¥å  **H5 ç«¯**ã

## å å¥å±å»º

#### å å¥ Taro ç¤¾åºå±å»ºå¡è®®

[Taro éä½ å å¥ç¤¾åºå±å»º](https://github.com/NervJS/taro/issues/4714)

#### ä¸º Taro è´¡ç®ä»£ç 

Taro éå¸¸æ¬¢è¿ç¤¾åºå¼åèä¸º Taro è´¡ç®ä»£ç ï¼å¨è´¡ç®ä¹åè¯·åéè¯»[è´¡ç®æå](https://nervjs.github.io/taro/docs/CONTRIBUTING.html)ã

å¦æä½ æ³ä¸º Taro å®ç°ä¸ä¸ªéè¦åè½ï¼éè¦åæ°å RFC  ææ¡£ï¼æç§ Taro ç[RFC æºå¶](https://github.com/NervJS/taro-rfcs)è¿è¡æä½ï¼å¨ç»è¿ç¤¾åºè®¨è®ºå®ååæå¯ä»¥è¿è¡ä»£ç çæäº¤ã

## é®é¢åé¦ä¸å»ºè®®

[ç» Taro æ ISSUE](https://nervjs.github.io/taro-issue-helper/)

> å¼ºçæ¨èéè¯» [ãæé®çæºæ§ã](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)ã[ãå¦ä½åå¼æºç¤¾åºæé®é¢ã](https://github.com/seajs/seajs/issues/545) å [ãå¦ä½ææå°æ¥å Bugã](http://www.chiark.greenend.org.uk/%7Esgtatham/bugs-cn.html)ã[ãå¦ä½åå¼æºé¡¹ç®æäº¤æ æ³è§£ç­çé®é¢ã](https://zhuanlan.zhihu.com/p/25795393)ï¼æ´å¥½çé®é¢æ´å®¹æè·å¾å¸®å©ã

[![Let's fund issues in this repository](https://issuehunt.io/static/embed/issuehunt-button-v1.svg)](https://issuehunt.io/repos/128624453)

## ç¹å«é¸£è°¢

[![nanjingboy](https://avatars1.githubusercontent.com/u/1390888?s=100&v=4)](https://github.com/nanjingboy/) | [![jsNewbee](https://avatars3.githubusercontent.com/u/20449400?s=100&v=4)](https://github.com/js-newbee/) | [![Qiyu8](https://avatars2.githubusercontent.com/u/15245051?s=100&v=4)](https://github.com/Qiyu8/) | [![Garfield550](https://avatars2.githubusercontent.com/u/3471836?s=100&v=4)](https://github.com/Garfield550/)
:---:|:---:|:---:|:---:
[nanjingboy](https://github.com/nanjingboy/) | [jsNewbee](https://github.com/js-newbee/) |  [Qiyu8](https://github.com/Qiyu8/) |  [Garfield Lee](https://github.com/Garfield550/)

## è´¡ç®èä»¬

<a href="https://github.com/NervJS/taro/graphs/contributors"><img src="https://opencollective.com/taro/contributors.svg?width=890&button=false" /></a>

## å¼åè®¡å

[Milestones](https://github.com/NervJS/taro/milestones)

## æ´æ°æ¥å¿

æ¬é¡¹ç®éµä» [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)ï¼æ´æ°æ¥å¿è¯·æ¥é [Release](https://github.com/NervJS/taro/releases)ã

## å¼åäº¤æµ

[å®æ¹äº¤æµå¾®ä¿¡ç¾¤](https://github.com/NervJS/taro/issues/198)

## License

MIT License

Copyright (c) O2Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
