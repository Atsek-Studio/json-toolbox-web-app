import React, { useId } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-tomorrow_night";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JsonEditor({ value, onChange }: JsonEditorProps) {
  const editorId = useId().replace(/:/g, "");

  return (
    <div className="editor-surface min-h-[480px] flex-1">
      <AceEditor
        name={`json-editor-${editorId}`}
        mode="json"
        theme="tomorrow_night"
        value={value}
        onChange={onChange}
        onLoad={(editor) => {
          editor.container.setAttribute("aria-label", "JSON input");
          editor.textInput.getElement().setAttribute("aria-label", "JSON input");
        }}
        width="100%"
        height="480px"
        fontSize={13}
        placeholder="Paste your JSON here..."
        showGutter={false}
        showPrintMargin={false}
        highlightActiveLine={false}
        wrapEnabled
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          behavioursEnabled: true,
          displayIndentGuides: false,
          fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
          padding: 16,
          showFoldWidgets: false,
          tabSize: 2,
          useWorker: false,
        }}
        className="json-input-editor"
      />
    </div>
  );
}
