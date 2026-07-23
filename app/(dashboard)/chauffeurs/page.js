import { query } from "@/lib/db";
import EntityModal from "@/components/EntityModal";
import ChauffeursList from "@/components/ChauffeursList";

export const dynamic = "force-dynamic";

export default async function ChauffeursPage() {
  const [{ rows }, vehiculesRes] = await Promise.all([
    query(`
      SELECT c.*, v.plaque AS vehicule_plaque
      FROM chauffeurs c
      LEFT JOIN vehicules v ON v.id = c.vehicule_id
      ORDER BY c.nom
    `),
    query("SELECT id, plaque FROM vehicules ORDER BY plaque"),
  ]);

  const vehiculeOptions = vehiculesRes.rows.map((v) => ({ value: v.id, label: v.plaque }));

  const chauffeurFields = [
    { name: "nom", fieldLabel: "Nom complet", required: true, placeholder: "Moussa Diop" },
    { name: "permis", fieldLabel: "Permis", placeholder: "Permis B" },
    { name: "annees_experience", fieldLabel: "Années d'expérience", type: "number" },
    { name: "vehicule_id", fieldLabel: "Véhicule assigné", type: "select", options: vehiculeOptions },
    {
      name: "statut",
      fieldLabel: "Statut",
      type: "select",
      options: [
        { value: "dispo", label: "Disponible" },
        { value: "mission", label: "En mission" },
      ],
    },
  ];

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Chauffeurs</h1>
          <div className="sub">{rows.length} chauffeurs actifs</div>
        </div>
        <EntityModal
          mode="create"
          label="Nouveau chauffeur"
          triggerLabel="+ Ajouter un chauffeur"
          endpoint="/api/chauffeurs"
          fields={chauffeurFields}
        />
      </div>

      <ChauffeursList rows={rows} fields={chauffeurFields} />
    </>
  );
}
