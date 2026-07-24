import { query } from "@/lib/db";
import EntityModal from "@/components/EntityModal";
import AssurancesList from "@/components/AssurancesList";

export const dynamic = "force-dynamic";

export default async function AssurancesPage() {
  const [{ rows }, vehiculesRes] = await Promise.all([
    query(`
      SELECT a.*, v.plaque AS vehicule_plaque,
        CASE
          WHEN a.date_fin < CURRENT_DATE THEN 'expiree'
          WHEN a.date_fin <= CURRENT_DATE + INTERVAL '30 days' THEN 'bientot'
          ELSE 'active'
        END AS statut_calc
      FROM assurances a
      LEFT JOIN vehicules v ON v.id = a.vehicule_id
      ORDER BY a.date_fin ASC
    `),
    query("SELECT id, plaque FROM vehicules ORDER BY plaque"),
  ]);

  const expirees = rows.filter((a) => a.statut_calc === "expiree").length;
  const bientot = rows.filter((a) => a.statut_calc === "bientot").length;
  const valides = rows.filter((a) => a.statut_calc === "active").length;

  const vehiculeOptions = vehiculesRes.rows.map((v) => ({ value: v.id, label: v.plaque }));

  const assuranceFields = [
    { name: "vehicule_id", fieldLabel: "Véhicule", type: "select", options: vehiculeOptions },
    { name: "assureur", fieldLabel: "Assureur", required: true, placeholder: "AXA Sénégal" },
    { name: "numero_police", fieldLabel: "N° de police", placeholder: "AX-2026-01023" },
    { name: "type", fieldLabel: "Type de couverture", placeholder: "Tous risques" },
    { name: "date_debut", fieldLabel: "Date de début", type: "date" },
    { name: "date_fin", fieldLabel: "Date d'échéance", type: "date", required: true },
    { name: "cout_fcfa", fieldLabel: "Coût (FCFA)", type: "number" },
  ];

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Assurances</h1>
          <div className="sub">
            {valides} valide(s) · {bientot} expire(nt) bientôt · {expirees} expirée(s)
          </div>
        </div>
        <EntityModal
          mode="create"
          label="Nouvelle police d'assurance"
          triggerLabel="+ Ajouter une assurance"
          endpoint="/api/assurances"
          fields={assuranceFields}
        />
      </div>

      {(expirees > 0 || bientot > 0) && (
        <div className="alert">
          <span className="ico">⚠</span>
          <span>
            {expirees > 0 && (
              <>
                <b>{expirees} assurance(s) expirée(s)</b>
                {bientot > 0 && " · "}
              </>
            )}
            {bientot > 0 && <b>{bientot} à renouveler dans les 30 jours</b>}
          </span>
        </div>
      )}

      <AssurancesList rows={rows} fields={assuranceFields} />
    </>
  );
}
