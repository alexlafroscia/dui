import { DrawApi, Widget } from "../widget.ts";
import { EventHandler } from "../event-handler.ts";
import { Row } from "../../renderable/mod.ts";
import { Event } from "../../events/event.ts";

export abstract class List<T> implements Widget, EventHandler {
  protected selectedIndex: number | undefined = undefined;
  private offset = 0;

  constructor(private entries: T[], selectedEntryIndex?: number) {
    this.selectedIndex = selectedEntryIndex;
  }

  abstract makeRow(entry: T, selected: boolean): Row;

  get hasSelection(): boolean {
    return typeof this.selectedIndex === "number";
  }

  get selected(): T | undefined {
    return this.hasSelection ? this.entries[this.selectedIndex!] : undefined;
  }

  selectEntry(index: number) {
    this.selectedIndex = index;
  }

  selectPrevious(increment = 1) {
    if (this.hasSelection) {
      this.selectedIndex = Math.max(
        0, // Ftrst item
        this.selectedIndex as number - increment, // Previous item
      );
    }
  }

  selectNext(increment = 1) {
    if (this.hasSelection) {
      this.selectedIndex = Math.min(
        this.selectedIndex as number + increment, // Next item
        this.entries.length - 1, // Last item
      );
    }
  }

  clearSelection() {
    this.selectedIndex = undefined;
  }

  draw({ height, renderRow }: DrawApi) {
    const numberToDraw = Math.min(this.entries.length, height);

    for (let y = this.offset; y < numberToDraw; y++) {
      const entry = this.entries[y];

      renderRow(y, this.makeRow(entry, this.selectedIndex === y));
    }
  }

  handleEvent(event: Event): boolean {
    if (event.type === "ControlInputEvent") {
      if (event.key === "ArrowUp") {
        this.selectPrevious();
        return true;
      }

      if (event.key === "ArrowDown") {
        this.selectNext();
        return true;
      }
    }

    return false;
  }
}