"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddEntityModal({ label, buttonLabel, endpoint, fields }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  function update(name, val) {
    setValues((v) => ({ ...v, [name]: val }));
  }

  function close() {
    setOpen(false);
    setValues({});
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Erreur lors de l'enregistrement");
      }
      close();
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button type="button" className="btn btn-gold" onClick={() => setOpen(true)}>
        {buttonLabel}
      </button>

      {open && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{label}</h3>
              <button type="button" className="modal-close" onClick={close}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {fields.map((f) => (
                <div className="field" key={f.name}>
                  <label>{f.fieldLabel}</label>
                  {f.type === "select" ? (
                    <select
                      required={f.required}
                      value={values[f.name] ?? ""}
                      onChange={(e) => update(f.name, e.target.value)}
                    >
                      <option value="">—</option>
                      {f.options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type || "text"}
                      required={f.required}
                      placeholder={f.placeholder}
                      value={values[f.name] ?? ""}
                      onChange={(e) => update(f.name, e.target.value)}
                    />
                  )}
                </div>
              ))}

              {error && <div className="form-error">{error}</div>}

              <div className="modal-actions">
                <button type="button" className="btn" onClick={close}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-gold" disabled={loading}>
                  {loading ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
