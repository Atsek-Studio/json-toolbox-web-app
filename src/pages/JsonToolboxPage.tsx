import React from "react";
import Header from "../components/Header";
import InputPanel from "../components/InputPanel";
import OutputPanel from "../components/OutputPanel";
import Toolbar from "../components/Toolbar";
import TreeView from "../components/TreeView";
import DiffResult from "../components/DiffResult";
import SchemaResult from "../components/SchemaResult";
import { useJsonToolbox } from "../hooks/useJsonToolbox";

export default function JsonToolboxPage() {
  const toolbox = useJsonToolbox();

  return (
    <section className="w-full bg-neutral-950 text-neutral-200 rounded-xl border border-neutral-800 overflow-hidden font-sans">
      <Header
        inputBytes={toolbox.inputBytes}
        outputBytes={toolbox.outputBytes}
        lastAction={toolbox.lastAction}
        hasError={Boolean(toolbox.error)}
        diffCount={toolbox.diffChanges.length}
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
        onCompare={toolbox.handleCompare}
        onValidateSchema={toolbox.handleValidateSchema}
      />
      {toolbox.lastAction === "diff" ? <>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
          <InputPanel title="ORIGINAL" value={toolbox.input} onChange={toolbox.setInput} />
          <InputPanel title="MODIFIED" value={toolbox.diffInput} onChange={toolbox.setDiffInput} />
        </div>
        <DiffResult
          changes={toolbox.diffChanges}
          error={toolbox.error}
          hasCompared={toolbox.diffHasCompared}
          beforeText={toolbox.input}
          afterText={toolbox.diffInput}
        />
      </> : toolbox.lastAction === "schema" ? <>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
          <InputPanel title="JSON DATA" value={toolbox.input} onChange={toolbox.setInput} />
          <InputPanel title="JSON SCHEMA" value={toolbox.schemaInput} onChange={toolbox.setSchemaInput} />
        </div>
        <SchemaResult result={toolbox.schemaResult} error={toolbox.error} />
      </> : <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
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
      </div>}
    </section>
  );
}
