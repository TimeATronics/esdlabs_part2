// Sections 12–13 exercise: the "Add a course" form, built by hand with the DOM.
// Run it:  npm run web   → open http://localhost:5500/web/
// Finish src/s11-catalog.js (departments) and src/s13-forms.js first.
import { courses } from "../data/courses.js";
import { departments } from "../src/s11-catalog.js";
import { isComplete, toCourse } from "../src/s13-forms.js";

// Step 1 — select the elements you need (querySelector / querySelectorAll).
const form = document.querySelector("#add-course");
const fields = [...form.querySelectorAll("input, select")];
const submit = form.querySelector('button[type="submit"]');
const departmentSelect = form.querySelector('select[name="department"]');
const list = document.querySelector("#course-list");
const countEl = document.querySelector("#count");
const status = document.querySelector("#status");

// A closure that hands out ids after the catalogue's last one (20).
const nextId = (() => {
  let last = 20;
  return () => ++last;
})();

// Step 2 — fill the department dropdown from the data.
for (const name of departments(courses)) {
  departmentSelect.append(new Option(name, name));
}

// Step 3 — read every field into one object: { code, title, department, credits }.
function readForm() {
  return fields.reduce(
    (values, field) => ({ ...values, [field.name]: field.value }),
    {}
  );
}

// Step 4 — enable the button only when the form is complete.
function updateButton() {
  submit.disabled = !isComplete(readForm());
}
form.addEventListener("input", updateButton);
updateButton();

// Step 5 — on "submit": stop the page reload, build the course with
// toCourse(values, nextId), append renderItem(course) to the list,
// update the count and status, reset the form, disable the button again.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = readForm();
  if (!isComplete(values)) return;

  const course = toCourse(values, nextId);
  list.append(renderItem(course));
  countEl.textContent = list.children.length;
  status.textContent = `Added ${course.code}.`;
  form.reset();
  submit.disabled = true;
});

// Step 6 — one list item per course. Clicking the item toggles the
// "selected" class; clicking Remove removes it WITHOUT also selecting it.
function renderItem(course) {
  const item = document.createElement("li");
  item.className = "item";

  const text = document.createElement("span");
  text.textContent = `${course.code} · ${course.title} · ${course.credits} cr`;

  const remove = document.createElement("button");
  remove.type = "button";
  remove.textContent = "Remove";

  item.addEventListener("click", () => {
    item.classList.toggle("selected");
  });

  remove.addEventListener("click", (event) => {
    event.stopPropagation();
    item.remove();
    countEl.textContent = list.children.length;
  });

  item.append(text, remove);
  return item;
}
