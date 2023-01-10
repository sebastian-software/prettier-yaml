import { parseDocument, isCollection, isScalar, isDocument, isPair, Node, Scalar } from 'yaml'
import glob from 'fast-glob'
import { readFileSync, writeFileSync } from 'fs'
import { format } from "prettier"

function cleanupStringTypes(node: unknown) {
  if (isCollection(node)) {
    node.items.forEach((child) => cleanupStringTypes(child))
  }

  if (isPair(node)) {
    cleanupStringTypes(node.key)
    cleanupStringTypes(node.value)
  }

  if (isScalar(node) && (node.type === "QUOTE_DOUBLE" || node.type === "QUOTE_SINGLE")) {
    // By deleting the type the required format seems to get auto detected.
    delete node.type
  }
}

async function main(patterns: string[]) {
  const files = await glob(patterns)

  files.filter((filePath) => {
    return filePath.endsWith(".yml") || filePath.endsWith(".yaml")
  }).map((filePath) => {
    console.log(`Processing: ${filePath}...`)
    const text = readFileSync(filePath, "utf8")
    const document = parseDocument(text)

    cleanupStringTypes(document.contents)

    const processed = document.toString()
    const formatted = format(processed, { parser: "yaml" })

    writeFileSync(filePath, formatted, "utf8")
  })
}

main(process.argv.slice(1))
