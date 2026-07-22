import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { plaque, modele, type, statut, kilometrage, prochaine_visite } = body;
    const { rows } = await query(
      `UPDATE vehicules SET plaque=$1, modele=$2, type=$3, statut=$4, kilometrage=$5, prochaine_visite=$6
       WHERE id=$7 RETURNING *`,
      [plaque, modele, type || null, statut || "dispo", parseInt(kilometrage, 10) || 0, prochaine_visite || null, id]
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
    await query("DELETE FROM vehicules WHERE id=$1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
