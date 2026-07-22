import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { reference, chauffeur_id, vehicule_id, origine, destination, statut, horaire } = body;
    const { rows } = await query(
      `UPDATE missions SET reference=$1, chauffeur_id=$2, vehicule_id=$3, origine=$4, destination=$5, statut=$6, horaire=$7
       WHERE id=$8 RETURNING *`,
      [
        reference,
        chauffeur_id ? parseInt(chauffeur_id, 10) : null,
        vehicule_id ? parseInt(vehicule_id, 10) : null,
        origine,
        destination,
        statut || "planned",
        horaire || null,
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
    await query("DELETE FROM missions WHERE id=$1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
