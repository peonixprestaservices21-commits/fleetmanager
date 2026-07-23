import { query } from "@/lib/db";
import EntityModal from "@/components/EntityModal";
import VehiculesList from "@/components/VehiculesList";

export const dynamic = "force-dynamic";

const VEHICULE_FIELDS = [
  { name: "plaque", fieldLabel: "Plaque", required: true, placeholder: "DK-1234-A" },
  { name: "modele", fieldLabel: "Modèle", required: true, placeholder: "Toyota Hiace" },
  { name: "type", fieldLabel: "Type", placeholder: "Minibus 15 places" },
  {
    name: "statut",
    fieldLabel: "Statut",
    type: "select",
    options: [
      { value: "dispo", label: "Disponible" },
      { value: "mission", label: "En mission" },
      { value: "maint", label: "Maintenance" },
    ],
  },
  { name: "kilometrage", fieldLabel: "Kilométrage", type: "number" },
  { name: "prochaine_visite", fieldLabel: "Prochaine visite", placeholder: "12/09/2026" },
];

export default async function VehiculesPage() {
  const { rows } = await query("SELECT * FROM vehicules ORDER BY plaque");

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Véhicules</h1>
          <div className="sub">{rows.length} véhicules enregistrés</div>
        </div>
        <EntityModal
          mode="create"
          label="Nouveau véhicule"
          triggerLabel="+ Ajouter un véhicule"
          endpoint="/api/vehicules"
          fields={VEHICULE_FIELDS}
        />
      </div>

      <VehiculesList rows={rows} fields={VEHICULE_FIELDS} />
    </>
  );
}
