import { query } from "@/lib/db";
import EntityModal from "@/components/EntityModal";
import SearchFilter from "@/components/SearchFilter";

export const dynamic = "force-dynamic";

const CHIPS = [
  { value: "", label: "Tous" },
  { value: "mission", label: "En route" },
  { value: "dispo", label: "Disponible" },
];

export default async function ChauffeursPage() {
  const [{ rows }, vehiculesRes] = await Promise.all([
    query(`
      SELECT c.*, v.plaque AS vehicule_plaque
      FROM chauffeurs c
      LEFT JOIN vehicules v ON v.id = c.vehicule_id
      ORDER BY c.nom
    `),
    query("SELECT id, plaque FROM vehicules ORDER BY plaque"),
  ]);

  const vehiculeOptions = vehiculesRes.rows.map((v) => ({ value: v.id, label: v.plaque }));

  const chauffeurFields = [
    { name: "nom", fieldLabel: "Nom complet", required: true, placeholder: "Moussa Diop" },
    { name: "permis", fieldLabel: "Permis", placeholder: "Permis B" },
    { name: "annees_experience", fieldLabel: "Années d'expérience", type: "number" },
    { name: "vehicule_id", fieldLabel: "Véhicule assigné", type: "select", options: vehiculeOptions },
    {
      name: "statut",
      fieldLabel: "Statut",
      type: "select",
      options: [
        { value: "dispo", label: "Disponible" },
        { value: "mission", label: "En mission" },
      ],
    },
  ];

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Chauffeurs</h1>
          <div className="sub">{rows.length} chauffeurs actifs</div>
        </div>
        <EntityModal
          mode="create"
          label="Nouveau chauffeur"
          triggerLabel="+ Ajouter un chauffeur"
          endpoint="/api/chauffeurs"
          fields={chauffeurFields}
        />
      </div>

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
                      fields={chauffeurFields}
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
    </>
  );
}
