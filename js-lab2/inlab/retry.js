// IN-LAB TASK (AI closed). Do this in the lab, not at home.
//
// retry(task, attempts, delayMs)
//   task      a function returning a promise (e.g. () => fetchCourses({}))
//   attempts  how many times to try in total (at least 1)
//   delayMs   how long to wait between attempts
// Resolve with the first successful result. If every attempt fails, reject
// with the LAST error. Don't wait after the final failure.
// Stretch: double the delay after each failure (exponential backoff), when
// called as retry(task, attempts, delayMs, { backoff: true }).
import { wait } from "../src/s03-async.js";

export async function retry(task, attempts, delayMs, { backoff = false } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await wait(delayMs);
    }
  }
  throw lastError;
}
