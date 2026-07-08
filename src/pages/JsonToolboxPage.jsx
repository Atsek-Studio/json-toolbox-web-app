import React from "react";
import Header from "../components/Header.jsx";
import InputPanel from "../components/InputPanel.jsx";
import OutputPanel from "../components/OutputPanel.jsx";
import Toolbar from "../components/Toolbar.jsx";
import TreeView from "../components/TreeView.jsx";
import { useJsonToolbox } from "../hooks/useJsonToolbox.js";

export default function JsonToolboxPage() {
  const toolbox = useJsonToolbox();

  return (
    <section className="w-full bg-neutral-950 text-neutral-200 rounded-xl border border-neutral-800 overflow-hidden font-sans">
      <Header
        inputBytes={toolbox.inputBytes}
        outputBytes={toolbox.outputBytes}
        lastAction={toolbox.lastAction}
        hasError={Boolean(toolbox.error)}
      />
      <Toolbar
        onAction={toolbox.handleAction}
        activeAction={toolbox.lastAction}
        onClear={toolbox.handleClear}
        view={toolbox.view}
        onViewChange={toolbox.setView}
        convertTarget={toolbox.convertTarget}
        onConvertTargetChange={toolbox.setConvertTarget}
        rootName={toolbox.rootName}
        onRootNameChange={toolbox.setRootName}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
        <InputPanel value={toolbox.input} onChange={toolbox.setInput} />
        {toolbox.view === "text" ? (
          <OutputPanel
            output={toolbox.output}
            error={toolbox.error}
            isValid={toolbox.isValid}
            reduction={toolbox.reduction}
            copied={toolbox.copied}
            outputType={toolbox.lastAction === "convert" ? "code" : "json"}
            onCopy={toolbox.handleCopy}
            onSwap={toolbox.handleSwap}
          />
        ) : (
          <TreeView input={toolbox.input} />
        )}
      </div>
    </section>
  );
}
