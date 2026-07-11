import { useCallback, useMemo, useState } from "react";
import type { SqlConvertTarget, ToolboxError } from "../types";
import { generateFromSql } from "../utils/sqlGenerators";
import { parseCreateTable } from "../utils/sqlParser";

const SAMPLE_SQL = `CREATE TABLE [dbo].[Users] (
  [Id] INT IDENTITY(1,1) PRIMARY KEY,
  [Name] NVARCHAR(100) NOT NULL,
  [Email] VARCHAR(255) NULL UNIQUE,
  [IsActive] BIT NOT NULL DEFAULT 1,
  [Balance] DECIMAL(18, 2) NOT NULL DEFAULT 0,
  [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);`;

export function useSqlConverter() {
  const [input, setInput] = useState(SAMPLE_SQL);
  const [target, setTarget] = useState<SqlConvertTarget>("csharp-entity");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<ToolboxError | null>(null);
  const [copied, setCopied] = useState(false);
  const inputBytes = useMemo(() => new Blob([input]).size, [input]);

  const updateInput = useCallback((value: string) => {
    setInput(value);
    setOutput("");
    setError(null);
  }, []);

  const generate = useCallback((selectedTarget: SqlConvertTarget) => {
    setCopied(false);
    try {
      setOutput(generateFromSql(parseCreateTable(input), selectedTarget));
      setError(null);
    } catch (caught) {
      setOutput("");
      setError({ message: caught instanceof Error ? caught.message : String(caught) });
    }
  }, [input]);

  const convert = useCallback(() => generate(target), [generate, target]);

  const changeTarget = useCallback((nextTarget: SqlConvertTarget) => {
    setTarget(nextTarget);
    if (output) generate(nextTarget);
  }, [generate, output]);

  const copy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable in an insecure context.
    }
  }, [output]);

  const clear = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
  }, []);

  return { input, inputBytes, setInput: updateInput, target, setTarget: changeTarget, output, error, copied, convert, copy, clear };
}
