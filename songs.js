// Datei: /api/songs.js
// Bei Vercel gilt: JEDE Datei im /api-Ordner wird automatisch zu einer URL-Route.
// Diese Datei hier wird automatisch erreichbar unter: https://deine-seite.vercel.app/api/songs

import { createClient } from '@supabase/supabase-js';

// Verbindung zur Datenbank aufbauen.
// Die beiden Werte kommen NICHT aus dem Code selbst (Sicherheitsrisiko!),
// sondern aus "Environment Variables" - Einstellungen, die man im Vercel-Dashboard
// hinterlegt und die dann zur Laufzeit hier automatisch verfügbar sind.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Das ist die eigentliche Funktion, die läuft, sobald jemand /api/songs aufruft.
// "req" = die eingehende Anfrage (request), "res" = die Antwort, die wir zurückschicken (response)
export default async function handler(req, res) {

  // GET-Anfrage = "gib mir die Songliste" (genau wie /api/state in NA3RIS)
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('songs')           // Tabelle "songs" in der Datenbank
      .select('*')             // alle Spalten
      .order('title');         // sortiert nach Titel

    if (error) {
      return res.status(500).json({ error: 'db_error' });
    }

    // "data" ist jetzt genau das, was songs.map(...) in viewer.js später
    // in HTML-Cards verwandelt - ein Array von Objekten.
    return res.status(200).json({ songs: data });
  }

  // POST-Anfrage = "füge einen neuen Song hinzu" (genau wie /api/request)
  if (req.method === 'POST') {
    const { title, artist, tuning, strings } = req.body;

    // Genau wie bei deinen JS-Bugs heute: NIE ungeprüfte Eingaben durchlassen.
    if (!title || !artist) {
      return res.status(400).json({ error: 'missing_fields' });
    }

    const { data, error } = await supabase
      .from('songs')
      .insert([{ title, artist, tuning, strings }])
      .select();

    if (error) {
      return res.status(500).json({ error: 'db_error' });
    }

    return res.status(201).json({ song: data[0] });
  }

  // Jede andere Methode (DELETE, PUT, ...) wird hier abgelehnt.
  return res.status(405).json({ error: 'method_not_allowed' });
}
