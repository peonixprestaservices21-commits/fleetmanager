import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

const BADGE = {
  cours: ["badge-maint", "En cours"],
  planned: ["badge-planned", "Planifiée"],
  done: ["badge-done", "Terminée"],
};

export default async function MaintenancePage() {
  const { rows } = await query(`
    SELECT ma.*, v.plaque AS vehicule_plaque
    FROM maintenances ma
    LEFT JOIN vehicules v ON v.id = ma.vehicule_id
    ORDER BY ma.created_at DESC
  `);

  const enCours = rows.filter((m) => m.statut === "cours").length;
  const planifiees = rows.filter((m) => m.statut === "planned").length;
  const terminees = rows.filter((m) => m.statut === "done").length;

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Maintenance</h1>
          <div className="sub">
            {enCours} en cours · {planifiees} planifiée(s) · {terminees} terminée(s)
          </div>
        </div>
        <button className="btn btn-gold">+ Planifier une intervention</button>
      </div>

      <div className="panel" style={{ padding: "22px 8px" }}>
        <table>
          <thead>
            <tr>
              <th style={{ paddingLeft: 16 }}>Véhicule</th>
              <th>Intervention</th>
              <th>Statut</th>
              <th>Garage</th>
              <th>Coût</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => {
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
