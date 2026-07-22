import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { rows } = await query(`
    SELECT f.*, v.plaque AS vehicule_plaque, c.nom AS chauffeur_nom
    FROM carburant_logs f
    LEFT JOIN vehicules v ON v.id = f.vehicule_id
    LEFT JOIN chauffeurs c ON c.id = f.chauffeur_id
    ORDER BY f.date_plein DESC
  `);
  return NextResponse.json(rows);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { vehicule_id, chauffeur_id, date_plein, volume_l, cout_fcfa } = body;
    const { rows } = await query(
      `INSERT INTO carburant_logs (vehicule_id, chauffeur_id, date_plein, volume_l, cout_fcfa)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [
        vehicule_id ? parseInt(vehicule_id, 10) : null,
        chauffeur_id ? parseInt(chauffeur_id, 10) : null,
        date_plein || new Date().toISOString().slice(0, 10),
        parseFloat(volume_l),
        parseInt(cout_fcfa, 10),
      ]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
