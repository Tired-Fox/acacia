import { createSignal } from "solid-js";
import { Checkbox } from "../../src/aria/Checkbox";

export function CCheckbox() {
  let [isChecked, setChecked] = createSignal(false);
  return (
    <div>
      <Checkbox onChange={(state) => setChecked(state)}>
        <div class="checkbox">
          <svg viewBox="0 0 18 18" aria-hidden="true">
            <polyline points="1 9 7 14 15 4" />
          </svg>
        </div>
        {isChecked() ? "Subscribed" : "Unsubscribed"}
      </Checkbox>
      <Checkbox invalid>
        <div class="checkbox">
          <svg viewBox="0 0 18 18" aria-hidden="true">
            <polyline points="1 9 7 14 15 4" />
          </svg>
        </div>
        Invalid Checkbox
      </Checkbox>
      <Checkbox indeterminate>
        <div class="checkbox">
          <svg viewBox="0 0 18 18" aria-hidden="true">
            <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" />
          </svg>
        </div>
        Indeterminate
      </Checkbox>
      <Checkbox indeterminate={isChecked()}>
        {({ isIndeterminate }) => {
          return (
            <>
              <div class="checkbox">
                {!isIndeterminate ? (
                  <svg viewBox="0 0 18 18" aria-hidden="true">
                    <polyline points="1 9 7 14 15 4" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 18 18" aria-hidden="true">
                    <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" />
                  </svg>
                )}
              </div>
              Dynamic
            </>
          );
        }}
      </Checkbox>
    </div>
  );
}
