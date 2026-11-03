// Section 15 exercise: a counter, three ways.
// Run it:  npm run web   → open http://localhost:5500/web/counter.html
// Follow section 15 of the lab doc: stage 1 → 2 → 3 → 4.

import { useState } from "../src/s15-state.js";

const countEl = document.querySelector("#count");
const parityEl = document.querySelector("#parity");
const inc = document.querySelector("#inc");
const dec = document.querySelector("#dec");
const reset = document.querySelector("#reset");
const stepInput = document.querySelector("#step");

function render() {
  const count = getCount();
  const step = getStep();
  countEl.textContent = count;
  parityEl.textContent = count % 2 === 0 ? "even" : "odd";
  dec.disabled = count - step < 0;
  document.title = `Count: ${count}`;
}

const [getCount, setCount] = useState(0, render);
const [getStep, setStep] = useState(1, render);

inc.addEventListener("click", () => {
  setCount((count) => count + getStep());
});

dec.addEventListener("click", () => {
  setCount((count) => count - getStep());
});

reset.addEventListener("click", () => {
  setCount(0);
});

stepInput.addEventListener("input", () => {
  const step = Number(stepInput.value);
  if (Number.isFinite(step) && step > 0) setStep(step);
});

render();
