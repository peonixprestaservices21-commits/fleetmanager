-- Migration : ajout du module Assurances
-- À exécuter dans l'éditeur SQL de Neon (une seule fois)

CREATE TABLE IF NOT EXISTS assurances (
  id SERIAL PRIMARY KEY,
  vehicule_id INTEGER REFERENCES vehicules(id) ON DELETE SET NULL,
  assureur TEXT NOT NULL,
  numero_police TEXT,
  type TEXT,
  date_debut DATE,
  date_fin DATE NOT NULL,
  cout_fcfa INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Données de départ (à adapter avec tes vraies polices d'assurance)
INSERT INTO assurances (vehicule_id, assureur, numero_police, type, date_debut, date_fin, cout_fcfa) VALUES
(1, 'AXA Sénégal', 'AX-2026-01023', 'Tous risques', '2026-01-15', '2027-01-14', 185000),
(2, 'NSIA Assurances', 'NS-2025-04471', 'Tiers + vol/incendie', '2025-10-01', '2026-09-30', 95000),
(3, 'SUNU Assurances', 'SU-2026-02290', 'Tous risques', '2026-03-01', '2026-08-15', 210000),
(4, 'AXA Sénégal', 'AX-2026-00087', 'Tous risques', '2026-02-01', '2027-01-31', 195000),
(5, 'NSIA Assurances', 'NS-2025-05512', 'Tiers', '2025-08-01', '2026-07-31', 65000);
