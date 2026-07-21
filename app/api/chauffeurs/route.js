import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { rows } = await query(`
    SELECT c.*, v.plaque AS vehicule_plaque
    FROM chauffeurs c
    LEFT JOIN vehicules v ON v.id = c.vehicule_id
    ORDER BY c.nom
  `);
  return NextResponse.json(rows);
}

export async function POST(req) {
  const body = await req.json();
  const { nom, permis, annees_experience, vehicule_id, statut } = body;
  const { rows } = await query(
    `INSERT INTO chauffeurs (nom, permis, annees_experience, vehicule_id, statut)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [nom, permis, annees_experience || 0, vehicule_id || null, statut || "dispo"]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
