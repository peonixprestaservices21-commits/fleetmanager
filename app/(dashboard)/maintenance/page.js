import { query } from "@/lib/db";
import EntityModal from "@/components/EntityModal";
import MaintenanceList from "@/components/MaintenanceList";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const [{ rows }, vehiculesRes] = await Promise.all([
    query(`
      SELECT ma.*, v.plaque AS vehicule_plaque
      FROM maintenances ma
      LEFT JOIN vehicules v ON v.id = ma.vehicule_id
      ORDER BY ma.created_at DESC
    `),
    query("SELECT id, plaque FROM vehicules ORDER BY plaque"),
  ]);

  const enCours = rows.filter((m) => m.statut === "cours").length;
  const planifiees = rows.filter((m) => m.statut === "planned").length;
  const terminees = rows.filter((m) => m.statut === "done").length;

  const vehiculeOptions = vehiculesRes.rows.map((v) => ({ value: v.id, label: v.plaque }));

  const maintenanceFields = [
    { name: "vehicule_id", fieldLabel: "Véhicule", type: "select", options: vehiculeOptions },
    { name: "intervention", fieldLabel: "Intervention", required: true, placeholder: "Vidange + freins" },
    {
      name: "statut",
      fieldLabel: "Statut",
      type: "select",
      options: [
        { value: "cours", label: "En cours" },
        { value: "planned", label: "Planifiée" },
        { value: "done", label: "Terminée" },
      ],
    },
    { name: "garage", fieldLabel: "Garage", placeholder: "Garage Sarr Auto, Thiès" },
    { name: "cout_fcfa", fieldLabel: "Coût (FCFA)", type: "number" },
    { name: "date_prevue", fieldLabel: "Date prévue", placeholder: "28/07/2026" },
  ];

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Maintenance</h1>
          <div className="sub">
            {enCours} en cours · {planifiees} planifiée(s) · {terminees} terminée(s)
          </div>
        </div>
        <EntityModal
          mode="create"
          label="Planifier une intervention"
          triggerLabel="+ Planifier une intervention"
          endpoint="/api/maintenance"
          fields={maintenanceFields}
        />
      </div>

      <MaintenanceList rows={rows} fields={maintenanceFields} />
    </>
  );
}
