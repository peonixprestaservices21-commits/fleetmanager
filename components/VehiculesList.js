"use client";
import EntityModal from "@/components/EntityModal";
import SearchFilter from "@/components/SearchFilter";

const BADGE = {
  dispo: ["badge-dispo", "Disponible"],
  mission: ["badge-mission", "En mission"],
  maint: ["badge-maint", "Maintenance"],
};

const CHIPS = [
  { value: "", label: "Tous" },
  { value: "dispo", label: "Disponible" },
  { value: "mission", label: "En mission" },
  { value: "maint", label: "Maintenance" },
];

export default function VehiculesList({ rows, fields }) {
  return (
    <SearchFilter
      rows={rows}
      matchFields={["plaque", "modele", "type"]}
      chips={CHIPS}
      statusKey="statut"
      placeholder="Rechercher une plaque, un modèle…"
    >
      {(filtered) => (
        <div className="panel" style={{ padding: "22px 8px" }}>
          <table>
            <thead>
              <tr>
                <th style={{ paddingLeft: 16 }}>Plaque</th>
                <th>Modèle</th>
                <th>Statut</th>
                <th>Kilométrage</th>
                <th>Prochaine visite</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => {
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
                    <td>
                      <EntityModal
                        mode="edit"
                        label={`Modifier ${v.plaque}`}
                        endpoint="/api/vehicules"
                        id={v.id}
                        fields={fields}
                        initialValues={{
                          plaque: v.plaque,
                          modele: v.modele,
                          type: v.type || "",
                          statut: v.statut,
                          kilometrage: v.kilometrage,
                          prochaine_visite: v.prochaine_visite || "",
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "var(--stone)", padding: "24px 0" }}>
                    Aucun véhicule ne correspond à cette recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </SearchFilter>
  );
}
