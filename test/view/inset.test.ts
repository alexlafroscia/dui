import { assertEquals, createView } from "../helpers.ts";
import { Inset } from "../../lib/mod.ts";

Deno.test("creating an Inset", () => {
  const { matrix, view } = createView();
  const inset = new Inset(view, { top: 1, bottom: 1, left: 1, right: 1 });

  inset.render({
    draw({ height, width, renderCell }) {
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          renderCell({ x, y }, "x");
        }
      }
    },
  });

  assertEquals(matrix.get(0, 0).content, " ");
  assertEquals(matrix.get(1, 1).content, "x");
  assertEquals(matrix.get(6, 6).content, "x");
  assertEquals(matrix.get(7, 7).content, " ");
});