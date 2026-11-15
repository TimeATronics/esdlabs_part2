# Audit — React Lab 2

Part of what you submit. Fill in sections 0–4 **before** you ask the AI to change anything:
deciding what's wrong is your job, not the AI's. The sheet you audit against is "The Shape
of a Good React Slice" — section 08 of the lab doc.

Point at code as `file:line`, e.g. `CoursesPage.jsx:14`.

---

## 0. What came back

| File the AI gave you | What's in it (components, hooks) | Lines |
| --- | --- | --- |
| src/courses/CoursesPage.jsx | One CoursesPage component. It contains the list, the form, the fetch, and the add call. It uses 13 useState calls, one useEffect, useMemo, two useCallback wrappers, and useRef. | 161 |

- Does it run? List loads / valid add appears in order / duplicate code shows the 409
  message / bad input shows fieldErrors under the inputs:
  - Yes. The list loaded. I filled the form and clicked Add course; the new course appeared in the list. When I submitted a duplicate code, the server replied with a 409 and the page showed the message. When I entered invalid values, the page showed the reasons under the fields. However, in this part of the code, the field errors were not connected to their inputs, so a screen reader could not tie a message to its field.
- Requests in the Network tab — on page load: __ ; per add: __
  - On page load: 1 GET. Per add: 1 POST and 1 GET.
- `npm test` before any fix: __ passed / __ failed. Which test files fail?
  - 12 passed and 50 failed. The failing files were test/courses/AddCourseForm.test.jsx, test/courses/CoursesView.test.jsx, test/courses/fieldErrors.test.jsx, and test/courses/useCourses.test.jsx.

## 1. Part A — walk the allowed list

Is each element present, and in the right place?

| Element (the sheet, Part A) | Where it is in the AI's code (`file:line`, or "missing") | Right place? If not, where should it be? |
| --- | --- | --- |
| One View component that only renders | Missing. The list markup is inside CoursesPage at line 92. | It should be CoursesView.jsx. |
| Fetch + logic in a separate hook or module | CoursesPage.jsx line 31 and line 54. | It should be useCourses.js. |
| `useState` for the course list, at the right level | CoursesPage.jsx line 15. | Move to useCourses.js, because the view and the add action both need the list. |
| `useState` for the form's inputs, at the right level | CoursesPage.jsx lines 19 to 24. | Move to AddCourseForm.jsx, because only the form reads them. |
| `useEffect` — for the initial fetch only (with a cleanup) | CoursesPage.jsx lines 45 to 47. It has no cleanup, and it reloads after each add. | Move to useCourses.js and add the ignore cleanup with an empty dependency array. |
| Props down, callbacks up (the form raises "add this course") | Missing. The form calls apiFetch itself at line 61. | AddCourseForm should call onAdd, and CoursesPage should pass addCourse. |
| `.map` to render the list, with a stable `key` | CoursesPage.jsx line 105. It uses key={index}. | Move to CoursesView.jsx and use key={course.id}. |
| Loading / error / empty states, from one `status` | Missing. The component has separate loading and error state at lines 16 and 17, plus a stored courseCount at line 18. | Move to useCourses.js as one status and one error message. |

## 2. Part B — scan for "not yet"

Search the files (VS Code: Ctrl/Cmd+Shift+F) for each one.

| Not yet | Found? (`file:line`) | What it does in *this* slice | Cut, or keep — and why |
| --- | --- | --- | --- |
| `useMemo` | CoursesPage.jsx line 50 | Sorts the courses on every render. | Cut. The hook can keep the list sorted when it loads and after an add. |
| `useCallback` | CoursesPage.jsx lines 31 and 54 | Wraps the load function and the submit handler. | Cut both. Plain functions are enough here, and the effect can use an empty dependency array. |
| `useReducer` | Not found | Nothing | Not needed. |
| `useRef` | CoursesPage.jsx line 28 | Contains a reference to the Code input so it can be focused after an add. | Cut. Focus after add is not in the contract. |
| Context (`createContext`, `useContext`) | Not found | Nothing | Not needed. |
| A data-fetching library, or `axios`, or raw `fetch` instead of `apiFetch` | Not found. It uses apiFetch. | Nothing | Nothing to change. |
| TypeScript (types, interfaces, `.ts`/`.tsx`) | Not found | Nothing | Not needed. |
| Anything else nobody taught you (name it) | None | Nothing | Nothing to change. |

## 3. The rule — every hook and every component split

One row for **each** `useState`, `useEffect` and custom hook call, and for **each**
component. Say what it does *in this slice*. "The AI added it" and "just in case" are not
answers — if you can't name its job, the decision is "cut".

| Hook call or component (`file:line`) | What earns it here? (one sentence) | Keep / cut / move (to where) |
| --- | --- | --- |
| CoursesPage, line 14 | It does the page, the list, the form, and the fetch, so it is four jobs in one component. | Cut and split into useCourses, CoursesView, AddCourseForm, and CoursesPage. |
| `useState` courses, line 15 | The list is shared by the view and the add action. | Move to useCourses. |
| `useState` loading, line 16 | It tracks whether the request is still running. | Replace with status in useCourses. |
| `useState` error, line 17 | It contains the load error message. | Move to useCourses as error. |
| `useState` courseCount, line 18 | It stores a number that is already courses.length. | Cut. |
| `useState` code, title, department, credits, capacity, description, lines 19 to 24 | They hold the six values typed into the form. | Move to AddCourseForm. |
| `useState` submitting, line 25 | It disables the button while the add request is running. | Move to AddCourseForm. |
| `useState` formError, line 26 | It contains the add error message. | Move to AddCourseForm as part of one error object. |
| `useState` fieldErrors, line 27 | It contains the per-field reasons from a 400. | Move to AddCourseForm as part of the same error object. |
| `useRef` codeInputRef, line 28 | It lets the code focus the Code input after an add. | Cut, because focus after add is not in the contract. |
| `useCallback` fetchCourses, line 31 | It wraps the load function for the effect. | Cut and use a plain function inside the effect. |
| `useEffect`, line 45 | It loads the list once when the page appears. | Move to useCourses with an ignore cleanup and an empty dependency array. |
| `useMemo` sortedCourses, line 50 | It keeps a sorted copy of the list. | Cut and sort in the hook when the list changes. |
| `useCallback` handleSubmit, line 54 | It wraps the submit handler for the form. | Cut and use a plain function in AddCourseForm. |

## 4. Decisions — before any fix prompt

- I cut: useMemo, both useCallback wrappers, useRef, courseCount, the separate loading and error fields, the reload after add, key={index}, and the parseInt calls.
- I moved: the list, status, error, and add logic to useCourses; the six form values, submitting, and error to AddCourseForm; the list rendering to CoursesView; the wiring to CoursesPage.
- I added: one status field, an ignore cleanup, stable keys, accessible field errors, a role alert, and insertion of the 201 body in code order.
- Other issues/smells I found: thirteen useState calls in one component, a stored count, a reload after every add, key={index}, parseInt instead of Number, and no cleanup in the effect.

---

## 5. Strip check (section 14 of the doc)

For each "not yet" item you removed — one at a time:

| Removed | `npm test` after | The app after (loads / adds / shows errors) |
| --- | --- | --- |
| useMemo | 4 passed and 0 failed in CoursesPage.test.jsx | The list still loaded, a valid add still appeared, the duplicate still showed its message, and the field errors still showed. |
| useCallback around fetchCourses | 4 passed and 0 failed | The list still loaded and the page still added a course. |
| useCallback around handleSubmit | 4 passed and 0 failed | The form still submitted and still showed errors. |
| useRef | 4 passed and 0 failed | The page still loaded and added a course. Only the focus after add was gone. |

If the AI used none, say so here, and say which rule in prompt 1 you think prevented it.
- The AI agent used all four.

After this, I could see that none of the four items was needed for this part to work. However, they were still on the "not yet" list, so the final four files use none of them.

## 6. Before / after

|  | Before (the AI's first version) | After (yours) |
| --- | --- | --- |
| Files and components | One file, CoursesPage. | Four files: useCourses, CoursesView, AddCourseForm, and CoursesPage. |
| `useState` calls (and where) | Thirteen in CoursesPage. | Three in useCourses and three in AddCourseForm. |
| `useEffect` calls | One in CoursesPage, without cleanup. | One in useCourses, with cleanup. |
| "Not yet" items | useMemo, two useCallback wrappers, and useRef. | None. |
| Requests: on load / per add | One GET on load, then one POST and one GET per add. | One GET on load, then one POST per add. |
| `npm test` | 12 passed and 50 failed. | 62 passed and 0 failed. |

## 7. Two sentences

- One thing the AI got right that you might not have thought of: it kept the form values after a failed add and showed the server's message, which is the behavior the contract asks for.
- One thing you will never accept from an AI without checking again: storing a value that can be computed, or reloading the whole list after an add when the 201 body already contains the new course.
