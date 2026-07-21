-- FleetManager — schéma PostgreSQL (Neon)

CREATE TABLE IF NOT EXISTS vehicules (
  id SERIAL PRIMARY KEY,
  plaque TEXT NOT NULL UNIQUE,
  modele TEXT NOT NULL,
  type TEXT,
  statut TEXT NOT NULL DEFAULT 'dispo', -- dispo | mission | maint
  kilometrage INTEGER DEFAULT 0,
  prochaine_visite TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chauffeurs (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  permis TEXT,
  annees_experience INTEGER DEFAULT 0,
  vehicule_id INTEGER REFERENCES vehicules(id) ON DELETE SET NULL,
  statut TEXT NOT NULL DEFAULT 'dispo', -- dispo | mission
  missions_count INTEGER DEFAULT 0,
  note NUMERIC(2,1) DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS missions (
  id SERIAL PRIMARY KEY,
  reference TEXT NOT NULL,
  chauffeur_id INTEGER REFERENCES chauffeurs(id) ON DELETE SET NULL,
  vehicule_id INTEGER REFERENCES vehicules(id) ON DELETE SET NULL,
  origine TEXT NOT NULL,
  destination TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'planned', -- mission | planned | done
  horaire TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS maintenances (
  id SERIAL PRIMARY KEY,
  vehicule_id INTEGER REFERENCES vehicules(id) ON DELETE SET NULL,
  intervention TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'planned', -- cours | planned | done
  garage TEXT,
  cout_fcfa INTEGER,
  date_prevue TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS carburant_logs (
  id SERIAL PRIMARY KEY,
  vehicule_id INTEGER REFERENCES vehicules(id) ON DELETE SET NULL,
  chauffeur_id INTEGER REFERENCES chauffeurs(id) ON DELETE SET NULL,
  date_plein DATE NOT NULL DEFAULT CURRENT_DATE,
  volume_l NUMERIC(6,1) NOT NULL,
  cout_fcfa INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Données de démarrage (à remplacer par tes vraies données)

INSERT INTO vehicules (plaque, modele, type, statut, kilometrage, prochaine_visite) VALUES
('DK-1023-A', 'Toyota Hiace', 'Minibus 15 places', 'dispo', 82400, '12/09/2026'),
('TH-4471-B', 'Renault Kangoo', 'Utilitaire léger', 'dispo', 41200, '03/10/2026'),
('DK-2290-C', 'Mitsubishi Canter', 'Camion 3T', 'mission', 156800, '28/07/2026'),
('DK-0087-D', 'Toyota Hilux', 'Pick-up double cabine', 'mission', 67900, '19/08/2026'),
('TH-5512-E', 'Renault Kangoo', 'Utilitaire léger', 'maint', 98100, 'En cours')
ON CONFLICT (plaque) DO NOTHING;

INSERT INTO chauffeurs (nom, permis, annees_experience, vehicule_id, statut, missions_count, note) VALUES
('Moussa Diop', 'Permis C', 8, 3, 'mission', 142, 4.8),
('Awa Fall', 'Permis B', 5, 4, 'mission', 97, 4.9),
('Ibrahima Sarr', 'Permis C', 11, 1, 'dispo', 203, 4.7),
('Khady Ndiaye', 'Permis B', 3, 2, 'dispo', 54, 5.0),
('Ousmane Ba', 'Permis C', 6, 5, 'dispo', 118, 4.6);

INSERT INTO missions (reference, chauffeur_id, vehicule_id, origine, destination, statut, horaire) VALUES
('#M-0142', 1, 3, 'Thiès', 'Diamniadio', 'mission', 'Aujourd''hui, 08h30'),
('#M-0141', 2, 4, 'Dakar Port', 'Rufisque', 'mission', 'Aujourd''hui, 09h15'),
('#M-0140', 3, 1, 'Thiès', 'Mbour', 'planned', 'Demain, 07h00'),
('#M-0139', 4, 2, 'Thiès centre', 'Zone industrielle', 'done', 'Hier, 16h20'),
('#M-0138', 5, 5, 'Thiès', 'Saly', 'done', 'Hier, 11h05');

INSERT INTO maintenances (vehicule_id, intervention, statut, garage, cout_fcfa, date_prevue) VALUES
(5, 'Vidange + freins', 'cours', 'Garage Sarr Auto, Thiès', NULL, '—'),
(3, 'Révision 150 000 km', 'planned', 'Diamniadio', NULL, '28/07/2026'),
(1, 'Contrôle technique', 'planned', 'Thiès', NULL, '12/09/2026'),
(2, 'Changement pneus (4)', 'done', 'Garage Sarr Auto, Thiès', 180000, NULL),
(4, 'Vidange', 'done', 'Dakar', 35000, NULL);

INSERT INTO carburant_logs (vehicule_id, chauffeur_id, date_plein, volume_l, cout_fcfa) VALUES
(3, 1, CURRENT_DATE, 80, 56000),
(4, 2, CURRENT_DATE - 1, 58, 40600),
(1, 3, CURRENT_DATE - 2, 65, 45500),
(2, 4, CURRENT_DATE - 3, 41, 28700),
(5, 5, CURRENT_DATE - 5, 30, 21000);
