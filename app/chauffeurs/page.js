import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ChauffeursPage() {
  const { rows } = await query(`
    SELECT c.*, v.plaque AS vehicule_plaque
    FROM chauffeurs c
    LEFT JOIN vehicules v ON v.id = c.vehicule_id
    ORDER BY c.nom
  `);

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Chauffeurs</h1>
          <div className="sub">{rows.length} chauffeurs actifs</div>
        </div>
        <button className="btn btn-gold">+ Ajouter un chauffeur</button>
      </div>

      <div className="toolbar">
        <input className="search" placeholder="Rechercher un chauffeur…" />
        <span className="chip active">Tous</span>
        <span className="chip">En mission</span>
        <span className="chip">Disponible</span>
      </div>

      <div className="card-grid">
        {rows.map((d) => {
          const initials = d.nom
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          const enMission = d.statut === "mission";
          return (
            <div className="driver-card" key={d.id}>
              <div className="head">
                <div className="avatar">{initials}</div>
                <div>
                  <div className="name">{d.nom}</div>
                  <div className="role">
                    {d.permis} · {d.annees_experience} ans
                  </div>
                </div>
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
      </div>
    </>
  );
}
