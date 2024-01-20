import React from 'react'
import MonacoEditor from 'react-monaco-editor'

export class AnnotatedTextEditor extends React.Component<{}, {code: string}, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      code: '// type your code...',
    }
  }
  editorDidMount(editor: any, monaco:any) {
    console.log('editorDidMount', editor)
    editor.focus()
  }
  onChange(newValue: any, e: any) {
    console.log('onChange', newValue, e)
  }
  render() {
    const code = this.state.code
    const options = {
      selectOnLineNumbers: true
    }
    return (
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={this.onChange.bind(this)}
        editorDidMount={this.editorDidMount.bind(this)}
      />
    )
  }
}
