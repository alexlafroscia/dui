import { assertEquals, createView } from "../helpers.ts";

Deno.test("creating a view", () => {
  const { view } = createView();

  assertEquals(view.width, 8);
  assertEquals(view.height, 8);
});

Deno.test("writing to a view", () => {
  const { matrix, view } = createView();

  view.render({
    draw({ height, width, renderCell }) {
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          renderCell({ x, y }, "x");
        }
      }
    },
  });

  for (let x = 0; x < view.width; x++) {
    for (let y = 0; y < view.height; y++) {
      assertEquals(matrix.get(x, y).content, "x");
    }
  }
});
