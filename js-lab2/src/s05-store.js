// Section 05 — State as a state machine
//
// The whole app's state is ONE object. It only ever changes through
// transition(state, event), which returns a NEW state (or the SAME state
// when the event changes nothing). Never change `state` itself.

export const initialState = Object.freeze({
  status: "idle",       // "idle" | "loading" | "ready" | "error"
  courses: [],          // the courses from the last successful load
  error: null,          // the error message when status is "error"
  departments: [],      // every department name, sorted — filled by the first successful load
  department: "",       // the selected department filter ("" = all)
  query: "",            // the search box text
  planner: [],          // planned courses: { id, code, title, credits }
  grades: {},           // the SGPA calculator form: { [courseId]: "A" | "A-" | … }
});

export function transition(state, event) {
  switch (event.type) {
    case "LOAD_START":
      return { ...state, status: "loading", error: null };
    case "LOAD_OK": {
      const departments = state.departments.length
        ? state.departments
        : [...new Set(event.courses.map((c) => c.department))].sort();
      return { ...state, status: "ready", courses: event.courses, departments };
    }
    case "LOAD_FAIL":
      return { ...state, status: "error", error: event.message };
    case "SET_DEPARTMENT":
      if (state.department === event.department) return state;
      return { ...state, department: event.department };
    case "SET_QUERY":
      if (state.query === event.query) return state;
      return { ...state, query: event.query };
    case "ADD": {
      if (state.planner.some((c) => c.id === event.course.id)) return state;
      const { id, code, title, credits } = event.course;
      return {
        ...state,
        planner: [...state.planner, { id, code, title, credits }],
      };
    }
    case "REMOVE": {
      if (!state.planner.some((c) => c.id === event.id)) return state;
      const { [event.id]: _dropped, ...grades } = state.grades;
      return {
        ...state,
        planner: state.planner.filter((c) => c.id !== event.id),
        grades,
      };
    }
    case "SET_GRADE": {
      if ((state.grades[event.id] ?? "") === event.grade) return state;
      if (event.grade === "") {
        const { [event.id]: _dropped, ...grades } = state.grades;
        return { ...state, grades };
      }
      return {
        ...state,
        grades: { ...state.grades, [event.id]: event.grade },
      };
    }
    default:
      return state; // an event we don't know changes nothing
  }
}
