import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { vehicule_id, intervention, statut, garage, cout_fcfa, date_prevue } = body;
    const { rows } = await query(
      `UPDATE maintenances SET vehicule_id=$1, intervention=$2, statut=$3, garage=$4, cout_fcfa=$5, date_prevue=$6
       WHERE id=$7 RETURNING *`,
      [
        vehicule_id ? parseInt(vehicule_id, 10) : null,
        intervention,
        statut || "planned",
        garage || null,
        cout_fcfa ? parseInt(cout_fcfa, 10) : null,
        date_prevue || null,
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
    await query("DELETE FROM maintenances WHERE id=$1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
