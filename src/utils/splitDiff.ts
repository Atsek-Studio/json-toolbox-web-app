export interface SplitDiffRow {
  type: "equal" | "changed";
  before?: string;
  after?: string;
}

interface LineOperation {
  type: "equal" | "added" | "removed";
  before?: string;
  after?: string;
}

function lineOperations(beforeLines: string[], afterLines: string[]): LineOperation[] {
  const matrix = Array.from({ length: beforeLines.length + 1 }, () =>
    Array<number>(afterLines.length + 1).fill(0),
  );

  for (let left = beforeLines.length - 1; left >= 0; left -= 1) {
    for (let right = afterLines.length - 1; right >= 0; right -= 1) {
      matrix[left][right] = beforeLines[left] === afterLines[right]
        ? matrix[left + 1][right + 1] + 1
        : Math.max(matrix[left + 1][right], matrix[left][right + 1]);
    }
  }

  const operations: LineOperation[] = [];
  let left = 0;
  let right = 0;
  while (left < beforeLines.length || right < afterLines.length) {
    if (left < beforeLines.length && right < afterLines.length && beforeLines[left] === afterLines[right]) {
      operations.push({ type: "equal", before: beforeLines[left], after: afterLines[right] });
      left += 1;
      right += 1;
    } else if (right < afterLines.length && (left === beforeLines.length || matrix[left][right + 1] >= matrix[left + 1][right])) {
      operations.push({ type: "added", after: afterLines[right] });
      right += 1;
    } else {
      operations.push({ type: "removed", before: beforeLines[left] });
      left += 1;
    }
  }
  return operations;
}

function alignOperations(operations: LineOperation[]): SplitDiffRow[] {
  const aligned: SplitDiffRow[] = [];
  let index = 0;
  while (index < operations.length) {
    if (operations[index].type === "equal") {
      aligned.push({ ...operations[index], type: "equal" });
      index += 1;
      continue;
    }

    const block: LineOperation[] = [];
    while (index < operations.length && operations[index].type !== "equal") {
      block.push(operations[index]);
      index += 1;
    }
    const removed = block.filter((item) => item.type === "removed");
    const added = block.filter((item) => item.type === "added");
    const length = Math.max(removed.length, added.length);
    for (let row = 0; row < length; row += 1) {
      aligned.push({ type: "changed", before: removed[row]?.before, after: added[row]?.after });
    }
  }
  return aligned;
}

export function createSplitDiff(beforeLines: string[], afterLines: string[]): SplitDiffRow[] {
  return alignOperations(lineOperations(beforeLines, afterLines));
}
