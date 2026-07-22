import { NextResponse } from "next/server";

export async function POST(req) {
  const { password } = await req.json();

  if (!process.env.APP_PASSWORD) {
    return NextResponse.json(
      { error: "APP_PASSWORD n'est pas configuré côté serveur" },
      { status: 500 }
    );
  }

  if (password && password === process.env.APP_PASSWORD) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("fleet_auth", "1", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  }

  return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
}
