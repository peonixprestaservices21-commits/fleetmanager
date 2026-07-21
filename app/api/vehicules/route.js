import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { rows } = await query("SELECT * FROM vehicules ORDER BY plaque");
  return NextResponse.json(rows);
}

export async function POST(req) {
  const body = await req.json();
  const { plaque, modele, type, statut, kilometrage, prochaine_visite } = body;
  const { rows } = await query(
    `INSERT INTO vehicules (plaque, modele, type, statut, kilometrage, prochaine_visite)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [plaque, modele, type, statut || "dispo", kilometrage || 0, prochaine_visite || null]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
