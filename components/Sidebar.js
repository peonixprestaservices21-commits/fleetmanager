"use client";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { label: "Tableau de bord", href: "/" },
  { label: "Véhicules", href: "/vehicules" },
  { label: "Chauffeurs", href: "/chauffeurs" },
  { label: "Missions", href: "/missions" },
  { label: "Maintenance", href: "/maintenance" },
  { label: "Assurances", href: "/assurances" },
  { label: "Carburant", href: "/carburant" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="mark">🚐</span>FleetManager
      </div>
      <nav className="route-nav">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={active ? "nav-item active" : "nav-item"}
            >
              <span className="dot">{active ? "●" : ""}</span>
              {item.label}
            </a>
          );
        })}
      </nav>
      <div className="sidebar-foot">
        AfrikaStudio
        <br />
        Gestion Flotte PME · Sénégal
        <br />
        <button
          type="button"
          onClick={handleLogout}
          style={{
            background: "none",
            border: "none",
            color: "var(--gold)",
            cursor: "pointer",
            fontSize: "11.5px",
            padding: 0,
            marginTop: 8,
          }}
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

