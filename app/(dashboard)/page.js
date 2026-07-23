import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

const STATUT_LABEL = { dispo: "Disponible", mission: "En mission", maint: "Maintenance" };

async function getData() {
  const [vehicules, chauffeursCount, missionsActives, carburantMois, alertesMaint] = await Promise.all([
    query("SELECT * FROM vehicules ORDER BY plaque"),
    query("SELECT COUNT(*) FROM chauffeurs"),
    query("SELECT COUNT(*) FROM missions WHERE statut = 'mission'"),
    query(
      `SELECT COALESCE(SUM(cout_fcfa),0) AS total, COALESCE(SUM(volume_l),0) AS volume
       FROM carburant_logs WHERE date_plein >= date_trunc('month', CURRENT_DATE)`
    ),
    query("SELECT COUNT(*) FROM maintenances WHERE statut IN ('planned','cours')"),
  ]);

  const fuelByVehicule = await query(`
    SELECT v.plaque, COALESCE(SUM(f.volume_l),0) AS total_l
    FROM vehicules v
    LEFT JOIN carburant_logs f ON f.vehicule_id = v.id AND f.date_plein >= date_trunc('month', CURRENT_DATE)
    GROUP BY v.plaque ORDER BY v.plaque
  `);

  const fuelTrend = await query(`
    SELECT to_char(month, 'Mon') AS label, COALESCE(SUM(f.cout_fcfa), 0) AS total
    FROM generate_series(
      date_trunc('month', CURRENT_DATE) - interval '5 months',
      date_trunc('month', CURRENT_DATE),
      interval '1 month'
    ) AS month
    LEFT JOIN carburant_logs f ON date_trunc('month', f.date_plein) = month
    GROUP BY month
    ORDER BY month
  `);

  const missionsByDriver = await query(`
    SELECT c.nom, COUNT(m.id) AS total
    FROM chauffeurs c
    LEFT JOIN missions m ON m.chauffeur_id = c.id
    GROUP BY c.nom
    ORDER BY total DESC, c.nom
    LIMIT 8
  `);

  return {
    vehicules: vehicules.rows,
    nbChauffeurs: chauffeursCount.rows[0].count,
    nbMissionsActives: missionsActives.rows[0].count,
    carburantTotal: carburantMois.rows[0].total,
    nbAlertesMaint: alertesMaint.rows[0].count,
    fuelByVehicule: fuelByVehicule.rows,
    fuelTrend: fuelTrend.rows,
    missionsByDriver: missionsByDriver.rows,
  };
}

export default async function DashboardPage() {
  const data = await getData();
  const maxFuel = Math.max(...data.fuelByVehicule.map((f) => Number(f.total_l)), 1);
  const maxFuelTrend = Math.max(...data.fuelTrend.map((f) => Number(f.total)), 1);
  const maxMissionsDriver = Math.max(...data.missionsByDriver.map((m) => Number(m.total)), 1);
  const positions = data.vehicules.map((_, i) => 8 + (i * 84) / Math.max(data.vehicules.length - 1, 1));

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Tableau de bord</h1>
          <div className="sub">
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi">
          <div className="label">Véhicules</div>
          <div className="value">{String(data.vehicules.length).padStart(2, "0")}</div>
        </div>
        <div className="kpi">
          <div className="label">Chauffeurs</div>
          <div className="value">{String(data.nbChauffeurs).padStart(2, "0")}</div>
        </div>
        <div className="kpi">
          <div className="label">Missions actives</div>
          <div className="value">{String(data.nbMissionsActives).padStart(2, "0")}</div>
        </div>
        <div className="kpi accent">
          <div className="label">Carburant (mois)</div>
          <div className="value">
            {Number(data.carburantTotal).toLocaleString("fr-FR")}
            <small>FCFA</small>
          </div>
        </div>
      </div>

      {Number(data.nbAlertesMaint) > 0 && (
        <div className="alert">
          <span className="ico">⚠</span>
          <span>
            <b>{data.nbAlertesMaint} maintenance(s)</b> planifiée(s) à venir
          </span>
          <a href="/maintenance">Voir le planning →</a>
        </div>
      )}

      <div className="panel" style={{ padding: "26px 28px 30px", marginBottom: 32 }}>
        <div className="section-head">
          <h2>État de la flotte</h2>
          <div className="legend">
            <span>
              <i style={{ background: "var(--green)" }} />
              Disponible
            </span>
            <span>
              <i style={{ background: "var(--gold)" }} />
              En mission
            </span>
            <span>
              <i style={{ background: "var(--laterite)" }} />
              Maintenance
            </span>
          </div>
        </div>
        <div className="road">
          {data.vehicules.map((v, i) => (
            <div key={v.id} className={`vehicle ${v.statut}`} style={{ left: `${positions[i]}%` }}>
              <span className="tag">{STATUT_LABEL[v.statut]}</span>
              {v.statut === "maint" ? "🔧" : v.type?.includes("Camion") || v.type?.includes("3T") ? "🚚" : "🚐"}
              <span className="plate">{v.plaque}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel" style={{ padding: "24px 26px", marginBottom: 20 }}>
        <div className="section-head">
          <h2>Consommation carburant par véhicule (L) — ce mois</h2>
        </div>
        <div className="bars">
          {data.fuelByVehicule.map((f) => (
            <div className="bar-col" key={f.plaque}>
              <div className="val">{Number(f.total_l)}</div>
              <div className="bar" style={{ height: `${Math.max((Number(f.total_l) / maxFuel) * 100, 4)}%` }} />
              <div className="name">{f.plaque}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="panel" style={{ padding: "24px 26px" }}>
          <div className="section-head">
            <h2>Dépense carburant — 6 derniers mois</h2>
          </div>
          <div className="bars">
            {data.fuelTrend.map((f, i) => (
              <div className="bar-col" key={i}>
                <div className="val">{Number(f.total).toLocaleString("fr-FR")}</div>
                <div className="bar" style={{ height: `${Math.max((Number(f.total) / maxFuelTrend) * 100, 4)}%` }} />
                <div className="name">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel" style={{ padding: "24px 26px" }}>
          <div className="section-head">
            <h2>Missions par chauffeur</h2>
          </div>
          <div className="bars">
            {data.missionsByDriver.map((m, i) => (
              <div className="bar-col" key={i}>
                <div className="val">{Number(m.total)}</div>
                <div className="bar" style={{ height: `${Math.max((Number(m.total) / maxMissionsDriver) * 100, 4)}%` }} />
                <div className="name">{m.nom.split(" ")[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
