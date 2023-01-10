import { expect, jest, test } from "@jest/globals"
import { formatString } from "."

test("Formats YAML", () => {
  expect(
    formatString(`
data:

# Stored DB data
  title:  "First Document"
  created : 2022-11-03

meta :
 author: "Sebastian Werner"
 mail: "s.werner@sebastian-software.de"
 posts:
   - 1
`)
  ).toMatchInlineSnapshot(`
    "data:
      # Stored DB data
      title: First Document
      created: 2022-11-03

    meta:
      author: Sebastian Werner
      mail: s.werner@sebastian-software.de
      posts:
        - 1
    "
  `)
})
