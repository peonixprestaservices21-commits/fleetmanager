import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { vehicule_id, assureur, numero_police, type, date_debut, date_fin, cout_fcfa } = body;
    const { rows } = await query(
      `UPDATE assurances SET vehicule_id=$1, assureur=$2, numero_police=$3, type=$4, date_debut=$5, date_fin=$6, cout_fcfa=$7
       WHERE id=$8 RETURNING *`,
      [
        vehicule_id ? parseInt(vehicule_id, 10) : null,
        assureur,
        numero_police || null,
        type || null,
        date_debut || null,
        date_fin,
        cout_fcfa ? parseInt(cout_fcfa, 10) : null,
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
    await query("DELETE FROM assurances WHERE id=$1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
