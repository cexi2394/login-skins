addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

// 这里改你的账号密码和游戏ID！其他别动！
const MY_ACCOUNT = "cexi2394"; // 你的账号，改这个！
const MY_PASSWORD = "123456";  // 你的密码，改这个！
const MY_GAME_ID = "cexi2394"; // 你的游戏ID，改这个！
const MY_SKIN_URL = "https://i.imgur.com/6zO94Mc.png"; // 皮肤链接，后面再改！

async function handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const headers = { 'Content-Type': 'application/json' };

    // 登录接口
    if (path === '/api/yggdrasil/authserver/authenticate') {
        const body = await request.json().catch(() => ({}));
        if (body.username === MY_ACCOUNT && body.password === MY_PASSWORD) {
            return new Response(JSON.stringify({
                accessToken: "TOKEN_" + Date.now(),
                clientToken: "CLIENT_TOKEN",
                selectedProfile: { id: "12345678-1234-1234-1234-123456789012", name: MY_GAME_ID },
                availableProfiles: [{ id: "12345678-1234-1234-1234-123456789012", name: MY_GAME_ID }]
            }), { headers });
        }
        return new Response(JSON.stringify({ error: "账号密码错了" }), { status: 403, headers });
    }

    // 皮肤接口
    if (path.startsWith('/api/yggdrasil/sessionserver/session/minecraft/profile/')) {
        const texture = btoa(JSON.stringify({
            timestamp: Date.now(),
            profileId: "12345678-1234-1234-1234-123456789012",
            profileName: MY_GAME_ID,
            textures: { SKIN: { url: MY_SKIN_URL } }
        }));
        return new Response(JSON.stringify({
            id: "12345678-1234-1234-1234-123456789012",
            name: MY_GAME_ID,
            properties: [{ name: "textures", value: texture }]
        }), { headers });
    }

    return new Response("接口建好了！地址是：" + url.origin + "/api/yggdrasil");
}
