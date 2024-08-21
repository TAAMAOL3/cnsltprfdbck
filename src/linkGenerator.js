class LinkGenerator {
    // Funktion zur Erzeugung einer zufälligen Zeichenkette
    static randomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Extrahiert den URL-Code nach dem '?' Zeichen
    static rawUrlCode(url, forFeedbackHashcode = false) {
        let urlCode = url.split('?')[1] || '';
        if (forFeedbackHashcode) {
            // Entfernt Sonderzeichen, um einen sauberen Feedback-Code zu erstellen
            urlCode = urlCode.replace(/[^\w\s]/gi, '');
        }
        return urlCode;
    }

    // Extrahiert und dekodiert den Kunden-Namen aus der URL
    static getCustomerForProjectName(url) {
        const customerName = url.split('&')[0];
        return decodeURIComponent(customerName);
    }
}

// Korrigierter Export für Node.js mit CommonJS
module.exports = LinkGenerator;
