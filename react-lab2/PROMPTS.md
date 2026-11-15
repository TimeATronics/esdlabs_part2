# Prompt log — React Lab 2

Part of what you submit. It shows *how* you used AI: did you hand it the contract and the
rules, or type "make it work"? Fill it in **as you go**, not from memory at the end.

- Name and roll number:
  - Aradhya Chakrabarti
  - MT2026012
- AI tool and plan (e.g. ChatGPT free, Gemini, Claude free, Copilot):
  - Tool: OpenCode free models.
  - Plan: one session. I pasted the contract prompt unchanged and kept the whole exchange in one chat so the contract stayed in view.

**Log every prompt you send, in order — including the ones that didn't help.** Paste each
prompt in full. One exception: if you pasted CONTRACT.md's prompt 1 unchanged, write
"CONTRACT.md prompt 1, unchanged". Summarise each reply; don't paste whole files.

---

## Prompt 1 — generate

**Sent:**

```text
CONTRACT.md prompt 1, unchanged
```

**What came back:** (which files; which hooks it used; anything from the "not yet" list;
anything it did that the contract didn't ask for)

- One file, src/courses/CoursesPage.jsx, with the list and the form in the same component.
- It used thirteen useState calls, one useEffect, useMemo, two useCallback wrappers, and a useRef for focus.
- It kept loading and error as separate fields, stored a courseCount, reloaded the whole list after every add, and used key={index}.
- The field errors were shown, but they had no aria-invalid or aria-describedby, and the form-level error had no role="alert".

**Did it run?** (`npm run dev`: list loads? add works? 409 shown? fieldErrors shown?
`npm test`: __ passed / __ failed)

- The list loaded.
- I filled the form and clicked Add course; the new course appeared in the list.
- When I submitted a duplicate code, the server replied with a 409 and the page showed the message.
- When I entered invalid values, the page showed the reasons under the fields.
- On page load it sent one GET. Each add sent one POST and then another GET for the whole list.
- npm test before any fix: 12 passed and 50 failed.
- The page test file passed all four tests. The form, view, field error, and hook test files failed because those files were still placeholders.
- However, in this part of the code, the field errors were not connected to their inputs, so a screen reader could not tie a message to its field.

**What I did with it:**

- After going through the generated code, I found some issues as per the AUDIT. However, they were very small changes, so I manually fixed them.
- I kept the parts that matched the contract.
- I wrote the four files described in section 4 of CONTRACT.md myself.
- I did not send a second prompt.

---

## Prompt 2 —

**Why I sent it:** (for a fix prompt: which decision in AUDIT.md it carries out)

- I did not send a second prompt.

**Sent:**

```text

```

**What came back:**

- Nothing.

**What I kept, and what I rejected:**

- Nothing.

---

<!-- Copy the "Prompt 2" block for each further prompt. -->

## Afterwards

- How many prompts did the whole feature take?
  - I used 1 prompt as mentioned above.
- Which of your prompts would you write differently now, and how?
  - I would have probably written a similar prompt again itself, because the prompt in CONTRACT.md was pretty self sufficient.
  - The one change I would make is to ask for accessible field errors explicitly, since the first draft displayed the messages but did not connect them to their inputs.
- One thing the rules in prompt 1 prevented (or failed to prevent):
  - The rules prevented extra hooks such as useMemo, useCallback, useRef, and useReducer, along with context and data-fetching libraries.
  - Maybe accessibility on the page was not a priority, so the generated code did not have accessible attributes for field errors. I found out about this during the audit and fixed manually.
