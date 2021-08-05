import { assertEquals, Spy, spy } from "../helpers.ts";
import { List } from "../../lib/widgets/list.ts";
import { Cell } from "../../lib/cell.ts";
import { Colors } from "../../lib/color/mod.ts";

Deno.test("writing entries", () => {
  const list = new List(["first", "second"]);
  const renderCell: Spy<void> = spy();

  list.draw({ height: 3, width: 10, renderCell });

  assertEquals(renderCell.calls, [
    ...[..."first".padEnd(10, " ")].map((char, index) => ({
      args: [{ x: index, y: 0 }, new Cell(char)],
      returned: undefined,
    })),
    ...[..."second".padEnd(10, " ")].map((char, index) => ({
      args: [{ x: index, y: 1 }, new Cell(char)],
      returned: undefined,
    })),
  ]);
});

Deno.test("rendering a selected entry", () => {
  const list = new List(["first"], 0);
  const renderCell: Spy<void> = spy();

  list.draw({ height: 3, width: 10, renderCell });

  assertEquals(renderCell.calls, [
    ...[..."first".padEnd(10, " ")].map((char, index) => ({
      args: [{ x: index, y: 0 }, new Cell(char, Colors.Black, Colors.Blue)],
      returned: undefined,
    })),
  ]);
});