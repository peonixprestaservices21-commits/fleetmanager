import { query } from "@/lib/db";
import EntityModal from "@/components/EntityModal";
import MissionsList from "@/components/MissionsList";

export const dynamic = "force-dynamic";

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

  const chauffeurOptions = chauffeursRes.rows.map((c) => ({ value: c.id, label: c.nom }));
  const vehiculeOptions = vehiculesRes.rows.map((v) => ({ value: v.id, label: v.plaque }));

  const missionFields = [
    { name: "reference", fieldLabel: "Référence", required: true, placeholder: "#M-0143" },
    { name: "chauffeur_id", fieldLabel: "Chauffeur", type: "select", options: chauffeurOptions },
    { name: "vehicule_id", fieldLabel: "Véhicule", type: "select", options: vehiculeOptions },
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
        <EntityModal
          mode="create"
          label="Nouvelle mission"
          triggerLabel="+ Nouvelle mission"
          endpoint="/api/missions"
          fields={missionFields}
        />
      </div>

      <MissionsList rows={rows} fields={missionFields} />
    </>
  );
}
