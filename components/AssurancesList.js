"use client";
import EntityModal from "@/components/EntityModal";
import SearchFilter from "@/components/SearchFilter";

const BADGE = {
  active: ["badge-dispo", "Valide"],
  bientot: ["badge-planned", "Expire bientôt"],
  expiree: ["badge-maint", "Expirée"],
};

const CHIPS = [
  { value: "", label: "Toutes" },
  { value: "active", label: "Valides" },
  { value: "bientot", label: "Expire bientôt" },
  { value: "expiree", label: "Expirées" },
];

export default function AssurancesList({ rows, fields }) {
  return (
    <SearchFilter
      rows={rows}
      matchFields={["assureur", "numero_police", "vehicule_plaque", "type"]}
      chips={CHIPS}
      statusKey="statut_calc"
      placeholder="Rechercher un assureur, une plaque…"
    >
      {(filtered) => (
        <div className="panel" style={{ padding: "22px 8px" }}>
          <table>
            <thead>
              <tr>
                <th style={{ paddingLeft: 16 }}>Véhicule</th>
                <th>Assureur</th>
                <th>N° police</th>
                <th>Type</th>
                <th>Échéance</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const [bcls, blabel] = BADGE[a.statut_calc] || BADGE.active;
                return (
                  <tr key={a.id}>
                    <td className="mono">{a.vehicule_plaque || "—"}</td>
                    <td>{a.assureur}</td>
                    <td className="mono" style={{ fontSize: 12 }}>{a.numero_police || "—"}</td>
                    <td style={{ color: "var(--stone)", fontSize: 12 }}>{a.type || "—"}</td>
                    <td className="mono">{new Date(a.date_fin).toLocaleDateString("fr-FR")}</td>
                    <td>
                      <span className={`badge ${bcls}`}>{blabel}</span>
                    </td>
                    <td>
                      <EntityModal
                        mode="edit"
                        label={`Modifier — ${a.assureur}`}
                        endpoint="/api/assurances"
                        id={a.id}
                        fields={fields}
                        initialValues={{
                          vehicule_id: a.vehicule_id ?? "",
                          assureur: a.assureur,
                          numero_police: a.numero_police || "",
                          type: a.type || "",
                          date_debut: a.date_debut ? new Date(a.date_debut).toISOString().slice(0, 10) : "",
                          date_fin: new Date(a.date_fin).toISOString().slice(0, 10),
                          cout_fcfa: a.cout_fcfa ?? "",
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "var(--stone)", padding: "24px 0" }}>
                    Aucune assurance ne correspond à cette recherche.
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
