let idleTime = 0;
let rememberMe;
const maxIdleTime = 1000 * 60 * 5;
let timer;

const checkIdle = () => {
    idleTime += 1000;
    
    if (idleTime >= maxIdleTime) {
        clearInterval(timer)
        const redirectPath = rememberMe === "true" ? "/" : "/logout";

        self.clients.matchAll().then(clients => {
            clients.forEach(client => client.postMessage(redirectPath));
        });
    }
};

self.addEventListener("message", async (e) => {
    const type = e.data.type;    
    
    if (type === "resetIdle") {
        idleTime = 0;
    } else if (type === "navigation") { 
        idleTime = 0;       
        const cookie = await cookieStore.get("rememberMe");
        rememberMe = cookie?.value;
        
        if (timer)
            clearInterval(timer);

        if (rememberMe && e.data.path !== "/login")
            timer = setInterval(checkIdle, 1000);
    }
});
