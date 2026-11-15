import { useState } from "react";

const EMPTY = {
  code: "",
  title: "",
  department: "",
  credits: "",
  capacity: "",
  description: "",
};

function Field({ name, label, value, onChange, error, as = "input", type = "text" }) {
  const Input = as;
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Input
        id={name}
        name={name}
        type={as === "input" ? type : undefined}
        value={value}
        onChange={onChange}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && <p id={`${name}-error`}>{error}</p>}
    </div>
  );
}

export function AddCourseForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onAdd({
        ...form,
        credits: Number(form.credits),
        capacity: Number(form.capacity),
        description: form.description === "" ? null : form.description,
      });
      setForm(EMPTY);
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  const fieldErrors = error?.fieldErrors ?? {};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a course</h2>
      <Field name="code" label="Code" value={form.code} onChange={handleChange} error={fieldErrors.code} />
      <Field name="title" label="Title" value={form.title} onChange={handleChange} error={fieldErrors.title} />
      <Field name="department" label="Department" value={form.department} onChange={handleChange} error={fieldErrors.department} />
      <Field name="credits" label="Credits" value={form.credits} onChange={handleChange} error={fieldErrors.credits} type="number" />
      <Field name="capacity" label="Capacity" value={form.capacity} onChange={handleChange} error={fieldErrors.capacity} type="number" />
      <Field name="description" label="Description" value={form.description} onChange={handleChange} error={fieldErrors.description} as="textarea" />
      {error && <p role="alert">{error.message}</p>}
      <button type="submit" disabled={submitting}>Add course</button>
    </form>
  );
}
