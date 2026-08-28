// Render Bot URL'leri (Aktif PixelCore)
const BOTS = [
    {
        id: 'pixelcore',
        name: 'PixelCore',
        url: 'https://pxdbot.onrender.com/api/status'
    }
];

async function checkBotStatus(bot) {
    const startTime = Date.now();
    try {
        const response = await fetch(bot.url, { cache: 'no-store' });
        const httpLatency = Date.now() - startTime;

        if (response.ok) {
            const data = await response.json();
            const pingValue = data.ping !== undefined ? data.ping : httpLatency;

            updateCardUI(bot.id, true, pingValue, data.uptime || 'Aktif');
            return true;
        } else {
            updateCardUI(bot.id, false);
            return false;
        }
    } catch (error) {
        updateCardUI(bot.id, false);
        return false;
    }
}

function updateCardUI(id, isOnline, ping = 0, uptime = '--') {
    const badge = document.getElementById(`badge-${id}`);
    const pingEl = document.getElementById(`ping-${id}`);
    const uptimeEl = document.getElementById(`uptime-${id}`);

    if (isOnline) {
        badge.className = 'badge online';
        badge.textContent = 'Çevrim içi';
        pingEl.textContent = `${ping} ms`;
        uptimeEl.textContent = uptime;
    } else {
        badge.className = 'badge offline';
        badge.textContent = 'Çevrim dışı';
        pingEl.textContent = 'N/A';
        uptimeEl.textContent = 'Erişilemiyor';
    }
}

async function updateAllStatuses() {
    const results = await Promise.all(BOTS.map(bot => checkBotStatus(bot)));

    const globalStatusText = document.getElementById('globalStatusText');
    const globalStatusDot = document.querySelector('.global-status .status-dot');

    const allOnline = results.every(status => status === true);

    if (allOnline) {
        globalStatusDot.className = 'status-dot online';
        globalStatusText.textContent = 'Aktif Sistemler Çalışıyor';
    } else {
        globalStatusDot.className = 'status-dot offline';
        globalStatusText.textContent = 'PixelCore Kesinti Var';
    }

    document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString('tr-TR');
}

// İlk çalıştırma ve 10 saniyede bir otomatik yenileme
updateAllStatuses();
setInterval(updateAllStatuses, 10000);
