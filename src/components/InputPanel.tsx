import React from "react";
import JsonEditor from "./JsonEditor";
import PanelHeader from "./PanelHeader";

interface InputPanelProps {
  value: string;
  onChange: (value: string) => void;
  title?: string;
}

export default function InputPanel({ value, onChange, title = "INPUT" }: InputPanelProps) {
  return (
    <div className="flex flex-col">
      <PanelHeader title={title}>
        <span className="text-xs text-neutral-600">{value.length} chars</span>
      </PanelHeader>
      <JsonEditor value={value} onChange={onChange} />
    </div>
  );
}
