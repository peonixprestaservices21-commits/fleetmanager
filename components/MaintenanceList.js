"use client";
import EntityModal from "@/components/EntityModal";
import SearchFilter from "@/components/SearchFilter";

const BADGE = {
  cours: ["badge-maint", "En cours"],
  planned: ["badge-planned", "Planifiée"],
  done: ["badge-done", "Terminée"],
};

const CHIPS = [
  { value: "", label: "Toutes" },
  { value: "cours", label: "En cours" },
  { value: "planned", label: "Planifiées" },
  { value: "done", label: "Terminées" },
];

export default function MaintenanceList({ rows, fields }) {
  return (
    <SearchFilter
      rows={rows}
      matchFields={["intervention", "vehicule_plaque", "garage"]}
      chips={CHIPS}
      statusKey="statut"
      placeholder="Rechercher une intervention…"
    >
      {(filtered) => (
        <div className="panel" style={{ padding: "22px 8px" }}>
          <table>
            <thead>
              <tr>
                <th style={{ paddingLeft: 16 }}>Véhicule</th>
                <th>Intervention</th>
                <th>Statut</th>
                <th>Garage</th>
                <th>Coût</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const [bcls, blabel] = BADGE[m.statut] || BADGE.planned;
                return (
                  <tr key={m.id}>
                    <td className="mono">{m.vehicule_plaque || "—"}</td>
                    <td>{m.intervention}</td>
                    <td>
                      <span className={`badge ${bcls}`}>{blabel}</span>
                    </td>
                    <td style={{ color: "var(--stone)", fontSize: 12 }}>{m.garage || "—"}</td>
                    <td className="mono">
                      {m.cout_fcfa ? `${Number(m.cout_fcfa).toLocaleString("fr-FR")} FCFA` : "—"}
                    </td>
                    <td>
                      <EntityModal
                        mode="edit"
                        label="Modifier l'intervention"
                        endpoint="/api/maintenance"
                        id={m.id}
                        fields={fields}
                        initialValues={{
                          vehicule_id: m.vehicule_id ?? "",
                          intervention: m.intervention,
                          statut: m.statut,
                          garage: m.garage || "",
                          cout_fcfa: m.cout_fcfa ?? "",
                          date_prevue: m.date_prevue || "",
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "var(--stone)", padding: "24px 0" }}>
                    Aucune intervention ne correspond à cette recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </SearchFilter>
  );
}
