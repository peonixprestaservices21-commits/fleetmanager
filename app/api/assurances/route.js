import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { rows } = await query(`
    SELECT a.*, v.plaque AS vehicule_plaque,
      CASE
        WHEN a.date_fin < CURRENT_DATE THEN 'expiree'
        WHEN a.date_fin <= CURRENT_DATE + INTERVAL '30 days' THEN 'bientot'
        ELSE 'active'
      END AS statut_calc
    FROM assurances a
    LEFT JOIN vehicules v ON v.id = a.vehicule_id
    ORDER BY a.date_fin ASC
  `);
  return NextResponse.json(rows);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { vehicule_id, assureur, numero_police, type, date_debut, date_fin, cout_fcfa } = body;
    const { rows } = await query(
      `INSERT INTO assurances (vehicule_id, assureur, numero_police, type, date_debut, date_fin, cout_fcfa)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [
        vehicule_id ? parseInt(vehicule_id, 10) : null,
        assureur,
        numero_police || null,
        type || null,
        date_debut || null,
        date_fin,
        cout_fcfa ? parseInt(cout_fcfa, 10) : null,
      ]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
