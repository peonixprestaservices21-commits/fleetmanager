import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

const BADGE = {
  dispo: ["badge-dispo", "Disponible"],
  mission: ["badge-mission", "En mission"],
  maint: ["badge-maint", "Maintenance"],
};

export default async function VehiculesPage() {
  const { rows } = await query("SELECT * FROM vehicules ORDER BY plaque");

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Véhicules</h1>
          <div className="sub">{rows.length} véhicules enregistrés</div>
        </div>
        <button className="btn btn-gold">+ Ajouter un véhicule</button>
      </div>

      <div className="toolbar">
        <input className="search" placeholder="Rechercher une plaque, un modèle…" />
        <span className="chip active">Tous</span>
        <span className="chip">Disponible</span>
        <span className="chip">En mission</span>
        <span className="chip">Maintenance</span>
      </div>

      <div className="panel" style={{ padding: "22px 8px" }}>
        <table>
          <thead>
            <tr>
              <th style={{ paddingLeft: 16 }}>Plaque</th>
              <th>Modèle</th>
              <th>Statut</th>
              <th>Kilométrage</th>
              <th>Prochaine visite</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => {
              const [bcls, blabel] = BADGE[v.statut] || BADGE.dispo;
              return (
                <tr key={v.id}>
                  <td className="mono">{v.plaque}</td>
                  <td>
                    {v.modele}
                    <br />
                    <span style={{ color: "var(--stone)", fontSize: 11 }}>{v.type}</span>
                  </td>
                  <td>
                    <span className={`badge ${bcls}`}>{blabel}</span>
                  </td>
                  <td className="mono">{Number(v.kilometrage).toLocaleString("fr-FR")} km</td>
                  <td className="mono">{v.prochaine_visite}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
