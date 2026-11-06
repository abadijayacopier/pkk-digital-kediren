const ALLOWED_METHODS = new Set([
  'login',
  'getCurrentUser',
  'getPokjaIVModules',
  'getPokjaIVSummary',
  'getPokjaIVRecords',
  'savePokjaIVRecord',
  'deletePokjaIVRecord',
  'logout',
  'getPokjaIVDashboardData',
  'createPokjaIVBackup',
  'setupPokjaIVDailyBackup'
]);

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const endpoint = process.env.GAS_WEB_APP_URL;
  if (!endpoint || !/^https:\/\/script\.google\.com\/macros\/s\//.test(endpoint)) {
    return res.status(500).json({ error: 'GAS_WEB_APP_URL belum dikonfigurasi dengan URL Web App Apps Script yang valid.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!body || typeof body !== 'object' || !ALLOWED_METHODS.has(body.method) || !Array.isArray(body.args)) {
      return res.status(400).json({ error: 'Format permintaan API tidak valid atau metode tidak diizinkan.' });
    }

    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: body.method, args: body.args }),
      redirect: 'manual'
    });

    let response = upstream;
    if ([301, 302, 303, 307, 308].includes(upstream.status)) {
      const location = upstream.headers.get('location');
      if (!location) throw new Error('Google Apps Script mengembalikan redirect tanpa alamat tujuan.');
      response = await fetch(location, { method: 'GET', redirect: 'follow' });
    }

    const raw = await response.text();
    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      throw new Error('Respons Google Apps Script bukan JSON. Pastikan doPost sudah dipasang dan Web App sudah di-deploy ulang.');
    }

    if (!response.ok) {
      return res.status(502).json({ error: payload.error || 'Google Apps Script gagal memproses permintaan.' });
    }
    return res.status(200).json(payload);
  } catch (error) {
    return res.status(502).json({
      error: error && error.message ? error.message : 'Tidak dapat terhubung ke Google Apps Script.'
    });
  }
};
