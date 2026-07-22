import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { nom, permis, annees_experience, vehicule_id, statut } = body;
    const { rows } = await query(
      `UPDATE chauffeurs SET nom=$1, permis=$2, annees_experience=$3, vehicule_id=$4, statut=$5
       WHERE id=$6 RETURNING *`,
      [
        nom,
        permis || null,
        parseInt(annees_experience, 10) || 0,
        vehicule_id ? parseInt(vehicule_id, 10) : null,
        statut || "dispo",
        id,
      ]
    );
    if (!rows[0]) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await query("DELETE FROM chauffeurs WHERE id=$1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
