import path from 'path'
import camelize from 'camelize'
import { transformCSS } from 'taro-css-to-react-native'
import { types as Types, template as Template, PluginObj } from 'babel__core'
import { ConvertPluginPass as PluginPass } from './types'

const STYLE_SHEET_NAME = '_styleSheet'
const GET_STYLE_FUNC_NAME = '_getStyle'
const MERGE_STYLES_FUNC_NAME = '_mergeStyles'
const GET_CLS_NAME_FUNC_NAME = '_getClassName'
const NAME_SUFFIX = 'styleSheet'
const RN_CSS_EXT = ['.css', '.scss', '.sass', '.less', '.styl', '.stylus']

const isStyle = value => {
  const ext = path.extname(value)
  return RN_CSS_EXT.indexOf(ext) > -1
}

const isModuleSource = value => value.indexOf('.module.') > -1

const string2Object = str => {
  const entries = str.replace(/;+$/g, '')
    .split(';')
    .map(l => {
      const arr = l.split(':')
      arr[1] = arr[1]?.replace(/px/g, 'PX')
      return arr
    })
  const cssObject = transformCSS(entries)
  return cssObject
}

const object2Expression = (template, cssObject) => {
  const ast = template.ast(`var a = ${JSON.stringify(cssObject)}`)
  return ast.declarations[0]?.init
}

function findLastImportIndex (body) {
  const bodyReverse = body.slice(0).reverse()
  let _index = 0

  bodyReverse.some((node, index) => {
    if (node.type === 'ImportDeclaration') {
      _index = body.length - index - 1
      return true
    }
    return false
  })

  return _index
}

const MergeStylesFunction = `
function _mergeStyles() {
  var newTarget = {};

  for (var index = 0; index < arguments.length; index++) {
    var target = arguments[index];

    for (var key in target) {
      newTarget[key] = Object.assign(newTarget[key] || {}, target[key]);
    }
  }

  return newTarget;
}
`
const getClassNameFunction = `
function ${GET_CLS_NAME_FUNC_NAME}() {
  var className = [];
  var args = arguments[0];
  var type = Object.prototype.toString.call(args).slice(8, -1).toLowerCase();

  if (type === 'string') {
    args = args.trim();
    args && className.push(args);
  } else if (type === 'array') {
    args.forEach(function (cls) {
      cls = ${GET_CLS_NAME_FUNC_NAME}(cls).trim();
      cls && className.push(cls);
    });
  } else if (type === 'object') {
    for (var k in args) {
      k = k.trim();
      if (k && args.hasOwnProperty(k) && args[k]) {
        className.push(k);
      }
    }
  }

  return className.join(' ').trim();
}
`
const getStyleFunction = `
function ${GET_STYLE_FUNC_NAME}(classNameExpression) { 
  var className = ${GET_CLS_NAME_FUNC_NAME}(classNameExpression);
  var classNameArr = className.split(/\\s+/);

  var style = [];
  if (classNameArr.length === 1) {
    style.push(${STYLE_SHEET_NAME}[classNameArr[0].trim()]);
  } else {
      classNameArr.forEach(function(cls) {
      style.push(${STYLE_SHEET_NAME}[cls.trim()]);
    });
  }

  return style;
}
`

export default function (babel: {
  types: typeof Types
  template: typeof Template
}): PluginObj {
  const { types: t, template } = babel

  const getClassNameFunctionTemplate = template(getClassNameFunction)
  const getStyleFunctionTemplete = template(getStyleFunction)
  const getClassNameFunctionStmt = getClassNameFunctionTemplate()
  const getStyleFunctionStmt = getStyleFunctionTemplete()

  function getMap (str) {
    return str.split(/\s+/).map((className) => {
      // return template(`${STYLE_SHEET_NAME}["${className}"]`)().expression
      const stmt = template(`${STYLE_SHEET_NAME}["${className}"]`)()
      if (t.isExpressionStatement(stmt)) {
        return stmt.expression
      }
    })
  }

  function isCSSModuleExpression (value, cssModuleStylesheets) {
    if (t.isJSXExpressionContainer(value)) {
      if (t.isMemberExpression(value.expression) && t.isIdentifier(value.expression.object)) {
        // className ?????????????????? css module ?????????????????? style ??????
        if (cssModuleStylesheets.includes(value.expression.object.name)) {
          return true
        }
      }
    }
  }

  function getArrayExpression (value, cssModuleStylesheets) {
    // css module ??? className ????????? style ?????????????????????????????? style ??????
    if (isCSSModuleExpression(value, cssModuleStylesheets)) {
      return [value.expression]
    }

    let str

    if (!value || value.value === '') {
      // className
      // className=""
      return []
    } else if (value.type === 'JSXExpressionContainer' && value.expression && typeof value.expression.value !== 'string') {
      // className={{ container: true }}
      // className={['container wrapper', { scroll: false }]}
      return [t.callExpression(t.identifier(GET_STYLE_FUNC_NAME), [value.expression])]
    } else {
      // className="container"
      // className={'container'}
      str = (value.expression ? value.expression.value : value.value).trim()
    }

    return str === '' ? [] : getMap(str)
  }

  let existStyleImport = false

  return {
    name: 'transform-react-jsx-to-rn-stylesheet',
    visitor: {
      Program: {
        enter (astPath, state: PluginPass) {
          let lastImportAstPath
          for (const stmt of astPath.get('body')) {
            if (t.isImportDeclaration(stmt.node)) {
              if (isStyle(stmt.node.source.value)) {
                existStyleImport = true
                // ??? Program ??????????????? import ??????
                // ?????????????????????????????? import ????????????????????? @babel/plugin-transform-typescript ???????????????
                importDeclaration(stmt, state, t)
              }
              lastImportAstPath = stmt
            }
          }
          if (existStyleImport) {
            const { file } = state
            const styleSheetIdentifiers = file.get('styleSheetIdentifiers') || []
            let expression
            // only one css file????????????????????????????????????????????????
            if (styleSheetIdentifiers.length === 1) {
              expression = `var ${STYLE_SHEET_NAME} = ${styleSheetIdentifiers[0].name};\n`
            } else if (styleSheetIdentifiers.length > 1) {
              const params = styleSheetIdentifiers.reduce((current, next) => `${current},${next.name}`, '').slice(1)
              expression = `${MergeStylesFunction}\n
              var ${STYLE_SHEET_NAME} = ${MERGE_STYLES_FUNC_NAME}(${params});\n`
            } else {
              expression = `var ${STYLE_SHEET_NAME} = {}`
            }
            const expressionAst = template.ast(expression)
            lastImportAstPath.insertAfter(expressionAst)
          }
        },
        exit (astPath, state: PluginPass) {
          const { file } = state
          const node = astPath.node
          const injectGetStyle = file.get('injectGetStyle')
          // ???????????????import ???????????????????????????????????????????????????????????????
          const lastImportIndex = findLastImportIndex(node.body)

          if (injectGetStyle) {
            // @ts-ignore
            node.body.splice(lastImportIndex + 1, 0, getClassNameFunctionStmt)
            // @ts-ignore
            node.body.splice(lastImportIndex + 2, 0, getStyleFunctionStmt)
          }
          existStyleImport = false
        }
      },
      JSXOpeningElement ({ node }, state: PluginPass) {
        const { file } = state
        const cssModuleStylesheets = file.get('cssModuleStylesheets') || []

        // Check if has "style"
        let hasStyleAttribute = false
        let styleAttribute
        let hasClassName = false
        let classNameAttribute

        const attributes = node.attributes
        for (let i = 0; i < attributes.length; i++) {
          const attribute = attributes[i]
          if (t.isJSXAttribute(attribute)) {
            const name = attribute.name
            if (name) {
              if (!hasStyleAttribute) {
                hasStyleAttribute = name.name === 'style'
                styleAttribute = hasStyleAttribute && attributes[i]
              }

              if (!hasClassName) {
                hasClassName = name.name === 'className'
                classNameAttribute = hasClassName && attributes[i]
              }
            }
          }
        }

        if (hasClassName && existStyleImport) {
          // Remove origin className
          attributes.splice(attributes.indexOf(classNameAttribute), 1)

          if (
            classNameAttribute.value &&
            classNameAttribute.value.type === 'JSXExpressionContainer' &&
            typeof classNameAttribute.value.expression.value !== 'string' && // not like className={'container'}
            !isCSSModuleExpression(classNameAttribute.value, cssModuleStylesheets) // ????????? css module ??????????????????
          ) {
            file.set('injectGetStyle', true)
          }

          const arrayExpression = getArrayExpression(classNameAttribute.value, cssModuleStylesheets)

          if (arrayExpression.length === 0) {
            return
          }

          if (hasStyleAttribute && styleAttribute.value) {
            let expression
            // ?????? ?????? style ??????oject???style="width:100;height:100;" => style={{width:'100',height:'100'}}
            if (t.isStringLiteral(styleAttribute.value)) {
              const cssObject = string2Object(styleAttribute.value.value)
              expression = object2Expression(template, cssObject)
            } else {
              expression = styleAttribute.value.expression
            }
            const expressionType = expression.type

            // style={[styles.a, styles.b]} ArrayExpression
            if (expressionType === 'ArrayExpression') {
              expression.elements = arrayExpression.concat(expression.elements)
              // style={styles.a} MemberExpression
              // style={{ height: 100 }} ObjectExpression
              // style={{ ...custom }} ObjectExpression
              // style={custom} Identifier
              // style={getStyle()} CallExpression
              // style={this.props.useCustom ? custom : null} ConditionalExpression
              // style={custom || other} LogicalExpression
            } else {
              styleAttribute.value = t.jSXExpressionContainer(t.arrayExpression(arrayExpression.concat(expression)))
            }
          } else {
            const expression = arrayExpression.length === 1 ? arrayExpression[0] : t.arrayExpression(arrayExpression)
            attributes.push(t.jSXAttribute(t.jSXIdentifier('style'), t.jSXExpressionContainer(expression)))
          }
        } else if (hasStyleAttribute) {
          if (t.isStringLiteral(styleAttribute.value)) {
            const cssObject = string2Object(styleAttribute.value.value)
            styleAttribute.value = t.jSXExpressionContainer(object2Expression(template, cssObject))
          }
        }
      }
    }
  }
}

// ???????????? js ??????????????????????????????????????????????????????????????????????????????????????? remove
function importDeclaration (astPath, state, t) {
  const { file } = state
  const node = astPath.node
  const sourceValue = node.source.value
  const specifiers = node.specifiers
  const ext = path.extname(sourceValue)
  const styleSheetIdentifiers = file.get('styleSheetIdentifiers') || []
  const cssModuleStylesheets = file.get('cssModuleStylesheets') || []
  const isCSSModule = state.opts?.isCSSModule

  // ???????????????????????? css module
  if (isStyle(sourceValue)) {
    // ?????????????????????
    let styleSheetName = ''
    // `import styles from './foo.css'` kind
    if (specifiers.length > 0) {
      styleSheetName = specifiers[0].local.name
    }

    if (isModuleSource(sourceValue) && isCSSModule) {
      if (styleSheetName) {
        cssModuleStylesheets.push(styleSheetName)
      }
    } else {
      const cssFileName = path.basename(sourceValue)
      const cssFileBaseName = path.basename(cssFileName, ext)
      // ??????????????????????????????
      const styleSheetSource = sourceValue
      let styleSheetIdentifierName
      if (styleSheetName) {
        styleSheetIdentifierName = styleSheetName
      } else {
        styleSheetName = camelize(`${cssFileBaseName}${ext}_${NAME_SUFFIX}`)
        const repeatName = styleSheetIdentifiers.find(identifier => identifier.name === styleSheetName)
        styleSheetIdentifierName = repeatName ? styleSheetName + '1' : styleSheetName // fix repeat name
        // styleSheetIdentifierName = camelize(`${cssFileBaseName}${ext}_${NAME_SUFFIX}`)
      }
      const styleSheetIdentifier = t.identifier(styleSheetIdentifierName)

      node.specifiers = [t.importDefaultSpecifier(styleSheetIdentifier)]
      node.source = t.stringLiteral(styleSheetSource)
      styleSheetIdentifiers.push(styleSheetIdentifier)
    }
  }

  file.set('styleSheetIdentifiers', styleSheetIdentifiers)
  file.set('cssModuleStylesheets', cssModuleStylesheets)
}
