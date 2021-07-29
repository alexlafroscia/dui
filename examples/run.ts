import * as log from "https://deno.land/std@0.102.0/log/mod.ts";
import { eventStream, Fill, Input, Screen, Text } from "../lib/mod.ts";
import "./setup-log.ts";

const INTRO_TEXT = "Hello! This text is pretty long, to show off wrapping";

let screen;

try {
  screen = await Screen.create();
  const [lineNumbers, _lineSpacer, rest] = screen.verticalSplit(2, 1, Fill);
  const [
    header,
    _headerSpacer,
    content,
    _footerSpacer,
    footer,
  ] = rest.horizontalSplit(1, 1, Fill, 1, 1);
  const [left, right] = content.verticalSplit(0.125, Fill);

  await screen.transaction(() => {
    // Write line numbers to screen
    lineNumbers.render({
      draw(view, write) {
        for (let i = 0; i < view.height; i++) {
          write({ x: 0, y: i }, i.toString().padStart(2, "0"));
        }
      },
    });

    header.render(new Text("x".repeat(header.width)));
    footer.render(new Text("x".repeat(footer.width)));

    left.render(new Text(INTRO_TEXT, { wrap: true }));
  });

  const input = new Input(right);

  for await (const event of eventStream(Deno.stdin)) {
    log.debug(event);

    // Stop the event loop if the user hits `CTL-C`
    if (event.type === "ControlInputEvent" && event.key === "ETX") {
      break;
    }

    input.handleEvent(event);

    // Re-render
    await screen.transaction(() => {
      right.render(input);
    });
  }
} finally {
  await screen?.cleanup();
}
