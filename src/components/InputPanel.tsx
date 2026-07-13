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
        <span className="font-mono text-xs text-[#98a1af]">{value.length} chars</span>
      </PanelHeader>
      <JsonEditor value={value} onChange={onChange} />
    </div>
  );
}
