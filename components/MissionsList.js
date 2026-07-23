"use client";
import EntityModal from "@/components/EntityModal";
import SearchFilter from "@/components/SearchFilter";

const BADGE = {
  mission: ["badge-mission", "En cours"],
  planned: ["badge-planned", "Planifiée"],
  done: ["badge-done", "Terminée"],
};

const CHIPS = [
  { value: "", label: "Toutes" },
  { value: "mission", label: "En cours" },
  { value: "planned", label: "Planifiées" },
  { value: "done", label: "Terminées" },
];

export default function MissionsList({ rows, fields }) {
  return (
    <SearchFilter
      rows={rows}
      matchFields={["reference", "chauffeur_nom", "vehicule_plaque", "origine", "destination"]}
      chips={CHIPS}
      statusKey="statut"
      placeholder="Rechercher une mission…"
    >
      {(filtered) => (
        <div className="panel" style={{ padding: "22px 8px" }}>
          <table>
            <thead>
              <tr>
                <th style={{ paddingLeft: 16 }}>Réf.</th>
                <th>Chauffeur</th>
                <th>Véhicule</th>
                <th>Trajet</th>
                <th>Statut</th>
                <th>Horaire</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const [bcls, blabel] = BADGE[m.statut] || BADGE.planned;
                const initials = (m.chauffeur_nom || "??")
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <tr key={m.id}>
                    <td className="mono">{m.reference}</td>
                    <td className="cell-driver">
                      <div className="avatar" style={{ width: 26, height: 26, fontSize: 10 }}>
                        {initials}
                      </div>
                      {m.chauffeur_nom || "—"}
                    </td>
                    <td className="mono">{m.vehicule_plaque || "—"}</td>
                    <td>
                      <div className="route-line">
                        <span className="pt" />
                        {m.origine}
                        <span className="dash" />
                        <span className="pt" />
                        {m.destination}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${bcls}`}>{blabel}</span>
                    </td>
                    <td style={{ color: "var(--stone)", fontSize: 12 }}>{m.horaire}</td>
                    <td>
                      <EntityModal
                        mode="edit"
                        label={`Modifier ${m.reference}`}
                        endpoint="/api/missions"
                        id={m.id}
                        fields={fields}
                        initialValues={{
                          reference: m.reference,
                          chauffeur_id: m.chauffeur_id ?? "",
                          vehicule_id: m.vehicule_id ?? "",
                          origine: m.origine,
                          destination: m.destination,
                          statut: m.statut,
                          horaire: m.horaire || "",
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "var(--stone)", padding: "24px 0" }}>
                    Aucune mission ne correspond à cette recherche.
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
