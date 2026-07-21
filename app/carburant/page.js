import { query } from "@/lib/db";
import AddEntityModal from "@/components/AddEntityModal";

export const dynamic = "force-dynamic";

export default async function CarburantPage() {
  const [logs, totals, vehiculesRes, chauffeursRes] = await Promise.all([
    query(`
      SELECT f.*, v.plaque AS vehicule_plaque, c.nom AS chauffeur_nom
      FROM carburant_logs f
      LEFT JOIN vehicules v ON v.id = f.vehicule_id
      LEFT JOIN chauffeurs c ON c.id = f.chauffeur_id
      ORDER BY f.date_plein DESC
      LIMIT 20
    `),
    query(`
      SELECT COALESCE(SUM(cout_fcfa),0) AS total_fcfa, COALESCE(SUM(volume_l),0) AS total_l
      FROM carburant_logs WHERE date_plein >= date_trunc('month', CURRENT_DATE)
    `),
    query("SELECT id, plaque FROM vehicules ORDER BY plaque"),
    query("SELECT id, nom FROM chauffeurs ORDER BY nom"),
  ]);

  const carburantFields = [
    {
      name: "vehicule_id",
      fieldLabel: "Véhicule",
      type: "select",
      options: vehiculesRes.rows.map((v) => ({ value: v.id, label: v.plaque })),
    },
    {
      name: "chauffeur_id",
      fieldLabel: "Chauffeur",
      type: "select",
      options: chauffeursRes.rows.map((c) => ({ value: c.id, label: c.nom })),
    },
    { name: "date_plein", fieldLabel: "Date du plein", type: "date" },
    { name: "volume_l", fieldLabel: "Volume (L)", type: "number", required: true },
    { name: "cout_fcfa", fieldLabel: "Coût (FCFA)", type: "number", required: true },
  ];

  const rows = logs.rows;
  const maxCout = Math.max(...rows.map((r) => Number(r.cout_fcfa)), 1);
  const totalFcfa = Number(totals.rows[0].total_fcfa);
  const totalL = Number(totals.rows[0].total_l);

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Carburant</h1>
          <div className="sub">Suivi des pleins</div>
        </div>
        <AddEntityModal
          label="Enregistrer un plein"
          buttonLabel="+ Enregistrer un plein"
          endpoint="/api/carburant"
          fields={carburantFields}
        />
      </div>

      <div className="kpi-row">
        <div className="kpi accent">
          <div className="label">Total du mois</div>
          <div className="value">
            {totalFcfa.toLocaleString("fr-FR")}
            <small>FCFA</small>
          </div>
        </div>
        <div className="kpi">
          <div className="label">Volume total</div>
          <div className="value">
            {totalL}
            <small>L</small>
          </div>
        </div>
        <div className="kpi">
          <div className="label">Coût moyen / plein</div>
          <div className="value">
            {rows.length ? Math.round(totalFcfa / rows.length).toLocaleString("fr-FR") : 0}
            <small>FCFA</small>
          </div>
        </div>
        <div className="kpi">
          <div className="label">Pleins ce mois</div>
          <div className="value">{rows.length}</div>
        </div>
      </div>

      <div className="panel" style={{ padding: "22px 8px" }}>
        <div style={{ padding: "0 16px 14px" }}>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14.5, fontWeight: 600 }}>
            Derniers pleins
          </h2>
        </div>
        <table>
          <thead>
            <tr>
              <th style={{ paddingLeft: 16 }}>Date</th>
              <th>Véhicule</th>
              <th>Chauffeur</th>
              <th>Volume</th>
              <th>Coût</th>
              <th>Part du plein max</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ color: "var(--stone)", fontSize: 12 }}>
                  {new Date(r.date_plein).toLocaleDateString("fr-FR")}
                </td>
                <td className="mono">{r.vehicule_plaque || "—"}</td>
                <td>{r.chauffeur_nom || "—"}</td>
                <td className="mono">{Number(r.volume_l)} L</td>
                <td className="mono">{Number(r.cout_fcfa).toLocaleString("fr-FR")} FCFA</td>
                <td>
                  <div className="fuel-bar-track">
                    <div
                      className="fuel-bar-fill"
                      style={{ width: `${(Number(r.cout_fcfa) / maxCout) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
