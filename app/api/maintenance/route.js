import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { rows } = await query(`
    SELECT ma.*, v.plaque AS vehicule_plaque
    FROM maintenances ma
    LEFT JOIN vehicules v ON v.id = ma.vehicule_id
    ORDER BY ma.created_at DESC
  `);
  return NextResponse.json(rows);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { vehicule_id, intervention, statut, garage, cout_fcfa, date_prevue } = body;
    const { rows } = await query(
      `INSERT INTO maintenances (vehicule_id, intervention, statut, garage, cout_fcfa, date_prevue)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [
        vehicule_id ? parseInt(vehicule_id, 10) : null,
        intervention,
        statut || "planned",
        garage || null,
        cout_fcfa ? parseInt(cout_fcfa, 10) : null,
        date_prevue || null,
      ]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
