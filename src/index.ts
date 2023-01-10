import {
  parseDocument,
  isCollection,
  isScalar,
  isDocument,
  isPair,
  Node,
  Scalar
} from "yaml"
import glob from "fast-glob"
import { readFileSync, writeFileSync } from "fs"
import { format } from "prettier"

function cleanupStringTypes(node: unknown) {
  if (isCollection(node)) {
    node.items.forEach((child) => cleanupStringTypes(child))
  }

  if (isPair(node)) {
    cleanupStringTypes(node.key)
    cleanupStringTypes(node.value)
  }

  if (
    isScalar(node) &&
    (node.type === "QUOTE_DOUBLE" || node.type === "QUOTE_SINGLE")
  ) {
    // By deleting the type the required format seems to get auto detected.
    delete node.type
  }
}

export function formatString(text: string) {
  const document = parseDocument(text)

  cleanupStringTypes(document.contents)

  const processed = document.toString()
  return format(processed, { parser: "yaml" })
}

async function main(patterns: string[]) {
  const files = await glob(patterns)

  files
    .filter((filePath) => {
      return filePath.endsWith(".yml") || filePath.endsWith(".yaml")
    })
    .map((filePath) => {
      console.log(`Processing: ${filePath}...`)
      const formatted = formatString(readFileSync(filePath, "utf8"))
      writeFileSync(filePath, formatted, "utf8")
    })
}

main(process.argv.slice(1))
