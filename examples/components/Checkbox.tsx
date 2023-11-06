import { createSignal } from "solid-js";
import { Checkbox, CheckboxGroup } from "../../src/aria/form/Checkbox";

export function CCheckbox() {
  let [isSubscribed, setSubscribed] = createSignal(false);
  const [checked, setChecked] = createSignal<string[]>(['valid']);

  return (
    <div>
      <Checkbox onChange={(state) => setSubscribed(state)}>
        <div class="checkbox">
          <svg viewBox="0 0 18 18" aria-hidden="true">
            <polyline points="1 9 7 14 15 4" />
          </svg>
        </div>
        {isSubscribed() ? "Subscribed" : "Unsubscribed"}
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
      <Checkbox indeterminate={isSubscribed()}>
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

      <CheckboxGroup
        label="Checkbox Group"
        values={checked()}
        onChange={setChecked}
        name="sample"
        invalid={!checked().includes('valid')}
      >
        <Checkbox value="checkbox">
            <div class="checkbox">
                <svg viewBox="0 0 18 18" aria-hidden="true">
                    <polyline points="1 9 7 14 15 4" />
                </svg>
            </div>
            Checkbox
        </Checkbox>
        <Checkbox value="valid">
            <div class="checkbox">
                <svg viewBox="0 0 18 18" aria-hidden="true">
                    <polyline points="1 9 7 14 15 4" />
                </svg>
            </div>
            Valid
        </Checkbox>
      </CheckboxGroup>
      <CheckboxGroup
        label="Disabled Checkbox Group"
        name="sample"
        disabled
      >
        <Checkbox value="checkbox">
            <div class="checkbox">
                <svg viewBox="0 0 18 18" aria-hidden="true">
                    <polyline points="1 9 7 14 15 4" />
                </svg>
            </div>
            Checkbox
        </Checkbox>
        <Checkbox value="valid">
            <div class="checkbox">
                <svg viewBox="0 0 18 18" aria-hidden="true">
                    <polyline points="1 9 7 14 15 4" />
                </svg>
            </div>
            Valid
        </Checkbox>
      </CheckboxGroup>
      <CheckboxGroup
        label="Readonly Checkbox Group"
        name="sample"
        readonly
      >
        <Checkbox value="checkbox" checked>
            <div class="checkbox">
                <svg viewBox="0 0 18 18" aria-hidden="true">
                    <polyline points="1 9 7 14 15 4" />
                </svg>
            </div>
            Checkbox
        </Checkbox>
        <Checkbox value="valid" indeterminate>
            <div class="checkbox">
                <svg viewBox="0 0 18 18" aria-hidden="true">
                    <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" />
                </svg>
            </div>
            Valid
        </Checkbox>
      </CheckboxGroup>
    </div>
  );
}
