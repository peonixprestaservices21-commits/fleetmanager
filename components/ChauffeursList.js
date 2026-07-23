"use client";
import EntityModal from "@/components/EntityModal";
import SearchFilter from "@/components/SearchFilter";

const CHIPS = [
  { value: "", label: "Tous" },
  { value: "mission", label: "En route" },
  { value: "dispo", label: "Disponible" },
];

export default function ChauffeursList({ rows, fields }) {
  return (
    <SearchFilter
      rows={rows}
      matchFields={["nom", "permis", "vehicule_plaque"]}
      chips={CHIPS}
      statusKey="statut"
      placeholder="Rechercher un chauffeur…"
    >
      {(filtered) => (
        <div className="card-grid">
          {filtered.map((d) => {
            const initials = d.nom
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const enMission = d.statut === "mission";
            return (
              <div className="driver-card" key={d.id}>
                <div className="head" style={{ justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="avatar">{initials}</div>
                    <div>
                      <div className="name">{d.nom}</div>
                      <div className="role">
                        {d.permis} · {d.annees_experience} ans
                      </div>
                    </div>
                  </div>
                  <EntityModal
                    mode="edit"
                    label={`Modifier ${d.nom}`}
                    endpoint="/api/chauffeurs"
                    id={d.id}
                    fields={fields}
                    initialValues={{
                      nom: d.nom,
                      permis: d.permis || "",
                      annees_experience: d.annees_experience,
                      vehicule_id: d.vehicule_id ?? "",
                      statut: d.statut,
                    }}
                  />
                </div>
                <div className="stat-line">
                  <span>Véhicule</span>
                  <span>{d.vehicule_plaque || "—"}</span>
                </div>
                <div className="stat-line">
                  <span>Statut</span>
                  <span>
                    <span className={`badge ${enMission ? "badge-mission" : "badge-dispo"}`}>
                      {enMission ? "en route" : "disponible"}
                    </span>
                  </span>
                </div>
                <div className="stat-line">
                  <span>Missions</span>
                  <span>{d.missions_count}</span>
                </div>
                <div className="stat-line">
                  <span>Note</span>
                  <span>{Number(d.note).toFixed(1)} / 5</span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ color: "var(--stone)", padding: "24px 0" }}>
              Aucun chauffeur ne correspond à cette recherche.
            </div>
          )}
        </div>
      )}
    </SearchFilter>
  );
}
