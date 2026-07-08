import React from "react";
import JsonEditor from "./JsonEditor.jsx";
import PanelHeader from "./PanelHeader.jsx";

export default function InputPanel({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <PanelHeader title="INPUT">
        <span className="text-xs text-neutral-600">{value.length} chars</span>
      </PanelHeader>
      <JsonEditor value={value} onChange={onChange} />
    </div>
  );
}
