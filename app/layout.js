import "./globals.css";

export const metadata = {
  title: "FleetManager — AfrikaStudio",
  description: "Gestion de flotte pour PME sénégalaises",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta name="theme-color" content="#14120F" />
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
