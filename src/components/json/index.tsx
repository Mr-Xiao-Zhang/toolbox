import { Button, Space } from "antd";
import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import styles from "./index.module.less";

let _editor = null as any;

const JsonTool = () => {
  const monacoRef = useRef(null);

  const [value, setValue] = useState("");

  function handleEditorDidMount(editor: any, monaco: any) {
    _editor = editor;
    editor.focus();
  }

  const formatJson = () => {
    _editor.getAction("editor.action.formatDocument").run();
  };

  const reducerJson = () => {
    try {
      setValue(JSON.stringify(JSON.parse(value), null, ""));
    } catch (error) {
      setValue("错误的输入");
    }
  };

  const escape = () => {
    let myEscapedJSONString = value.replaceAll('"', '\\"');
    setValue(myEscapedJSONString);
  };

  const unEscape = () => {
    let myEscapedJSONString = value.replaceAll('\\"', '"');
    setValue(myEscapedJSONString);
  };

  return (
    <div>
      <Editor
        height="50vh"
        defaultLanguage="json"
        value={value}
        onChange={(val) => {
          setValue(val as string);
        }}
        onMount={handleEditorDidMount}
      />
      <Space wrap>
        <Button type="primary" onClick={formatJson}>
          格式化JSON
        </Button>
        <Button type="primary" onClick={reducerJson}>
          压缩JSON
        </Button>
        <Button type="primary" onClick={escape}>
          转义
        </Button>
        <Button type="primary" onClick={unEscape}>
          取消转义
        </Button>
      </Space>
    </div>
  );
};

export default JsonTool;
