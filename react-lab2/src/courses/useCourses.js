import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    apiFetch("/api/courses")
      .then((data) => {
        if (ignore) return;
        setCourses(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
        setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function addCourse(courseRequest) {
    const created = await apiFetch("/api/courses", {
      method: "POST",
      body: courseRequest,
    });
    setCourses((prev) =>
      [...prev, created].sort((a, b) => a.code.localeCompare(b.code))
    );
    return created;
  }

  return { courses, status, error, addCourse };
}
