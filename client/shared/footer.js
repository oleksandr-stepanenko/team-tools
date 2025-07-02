class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="site-footer">
                <div class="footer-container">
                    <div class="footer-links">
                        <a href="/" class="footer-link">Home</a>
                        <a href="/retrospective" class="footer-link">Retrospective</a>
                        <a href="/planning-poker" class="footer-link">Planning Poker</a>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('app-footer', Footer); 