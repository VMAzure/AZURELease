document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("jwt");
    console.log("🔍 DEBUG: Token nel localStorage all'avvio:", token);

    document.querySelectorAll("a").forEach(link => {
        if (link.href && link.href.includes("html")) { // 🔹 Solo i link interni
            link.addEventListener("click", function (event) {
                event.preventDefault();
                const url = new URL(link.href, window.location.origin);
                if (token) {
                    url.searchParams.set("token", token);
                    console.log(`✅ DEBUG: Navigazione verso: ${url}`);
                }
                window.location.href = url.toString();
            });
        }
    });
});
