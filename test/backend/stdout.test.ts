import {
  assertThrows,
  assertThrowsAsync,
} from "https://deno.land/std/testing/asserts.ts";
import { StringWriter } from "https://deno.land/std@0.102.0/io/mod.ts";
import { StdoutBackend } from "../../lib/backend/stdout.ts";

const outputStream = new StringWriter("test");
const consoleSize = { columns: 4, rows: 4 };

Deno.test("cannot use the constructor directly", () => {
  assertThrows(
    () => {
      new StdoutBackend(outputStream, consoleSize, Symbol());
    },
    undefined,
    "You may not use the `StdoutBackend` constructor directly",
  );
});

Deno.test("cannot create multiple Screen instances", async () => {
  const first = await StdoutBackend.create();

  await assertThrowsAsync(
    async () => {
      await StdoutBackend.create(outputStream, consoleSize);
    },
    undefined,
    "Only one `StdoutBackend` instance can exist at a time",
  );

  await first.cleanup();
});
