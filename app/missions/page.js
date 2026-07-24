import { query } from "@/lib/db";
import AddEntityModal from "@/components/AddEntityModal";

export const dynamic = "force-dynamic";

const BADGE = {
  mission: ["badge-mission", "En cours"],
  planned: ["badge-planned", "Planifiée"],
  done: ["badge-done", "Terminée"],
};

export default async function MissionsPage() {
  const [{ rows }, chauffeursRes, vehiculesRes] = await Promise.all([
    query(`
      SELECT m.*, c.nom AS chauffeur_nom, v.plaque AS vehicule_plaque
      FROM missions m
      LEFT JOIN chauffeurs c ON c.id = m.chauffeur_id
      LEFT JOIN vehicules v ON v.id = m.vehicule_id
      ORDER BY m.created_at DESC
    `),
    query("SELECT id, nom FROM chauffeurs ORDER BY nom"),
    query("SELECT id, plaque FROM vehicules ORDER BY plaque"),
  ]);

  const enCours = rows.filter((m) => m.statut === "mission").length;
  const planifiees = rows.filter((m) => m.statut === "planned").length;
  const terminees = rows.filter((m) => m.statut === "done").length;

  const missionFields = [
    { name: "reference", fieldLabel: "Référence", required: true, placeholder: "#M-0143" },
    {
      name: "chauffeur_id",
      fieldLabel: "Chauffeur",
      type: "select",
      options: chauffeursRes.rows.map((c) => ({ value: c.id, label: c.nom })),
    },
    {
      name: "vehicule_id",
      fieldLabel: "Véhicule",
      type: "select",
      options: vehiculesRes.rows.map((v) => ({ value: v.id, label: v.plaque })),
    },
    { name: "origine", fieldLabel: "Origine", required: true, placeholder: "Thiès" },
    { name: "destination", fieldLabel: "Destination", required: true, placeholder: "Diamniadio" },
    {
      name: "statut",
      fieldLabel: "Statut",
      type: "select",
      options: [
        { value: "mission", label: "En cours" },
        { value: "planned", label: "Planifiée" },
        { value: "done", label: "Terminée" },
      ],
    },
    { name: "horaire", fieldLabel: "Horaire", placeholder: "Aujourd'hui, 08h30" },
  ];

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Missions</h1>
          <div className="sub">
            {enCours} en cours · {planifiees} planifiée(s) · {terminees} terminée(s) cette semaine
          </div>
        </div>
        <AddEntityModal
          label="Nouvelle mission"
          buttonLabel="+ Nouvelle mission"
          endpoint="/api/missions"
          fields={missionFields}
        />
      </div>

      <div className="toolbar">
        <input className="search" placeholder="Rechercher une mission…" />
        <span className="chip active">Toutes</span>
        <span className="chip">En cours</span>
        <span className="chip">Planifiées</span>
        <span className="chip">Terminées</span>
      </div>

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
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => {
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
