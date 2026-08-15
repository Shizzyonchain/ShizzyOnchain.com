"use client";

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="route-error" role="alert">
          <p>ShizzyUnchained</p>
          <h1>The site could not finish loading.</h1>
          <span>Please retry. No wallet keys or funds are ever handled by this site.</span>
          <button type="button" onClick={retry}>Reload site</button>
        </main>
      </body>
    </html>
  );
}
