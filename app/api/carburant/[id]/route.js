import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { vehicule_id, chauffeur_id, date_plein, volume_l, cout_fcfa } = body;
    const { rows } = await query(
      `UPDATE carburant_logs SET vehicule_id=$1, chauffeur_id=$2, date_plein=$3, volume_l=$4, cout_fcfa=$5
       WHERE id=$6 RETURNING *`,
      [
        vehicule_id ? parseInt(vehicule_id, 10) : null,
        chauffeur_id ? parseInt(chauffeur_id, 10) : null,
        date_plein || new Date().toISOString().slice(0, 10),
        parseFloat(volume_l),
        parseInt(cout_fcfa, 10),
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
    await query("DELETE FROM carburant_logs WHERE id=$1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
