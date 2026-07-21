import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { rows } = await query(`
    SELECT m.*, c.nom AS chauffeur_nom, v.plaque AS vehicule_plaque
    FROM missions m
    LEFT JOIN chauffeurs c ON c.id = m.chauffeur_id
    LEFT JOIN vehicules v ON v.id = m.vehicule_id
    ORDER BY m.created_at DESC
  `);
  return NextResponse.json(rows);
}

export async function POST(req) {
  const body = await req.json();
  const { reference, chauffeur_id, vehicule_id, origine, destination, statut, horaire } = body;
  const { rows } = await query(
    `INSERT INTO missions (reference, chauffeur_id, vehicule_id, origine, destination, statut, horaire)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [reference, chauffeur_id || null, vehicule_id || null, origine, destination, statut || "planned", horaire || null]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
