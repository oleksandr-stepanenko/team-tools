class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="site-header">
                <div class="header-container">
                    <a href="/" class="site-logo">
                        <i class="fas fa-compass"></i>
                        <span>Compass</span>
                    </a>
                    <nav class="site-nav">
                        <a href="/" class="nav-link ${this.currentPath === '/' ? 'active' : ''}">Home</a>
                        <a href="/retrospective" class="nav-link ${this.currentPath === '/retrospective' ? 'active' : ''}">Retrospective</a>
                        <a href="/planning-poker" class="nav-link ${this.currentPath === '/planning-poker' ? 'active' : ''}">Planning Poker</a>
                        <div class="theme-toggle-wrapper">
                            <label class="theme-toggle">
                                <span class="toggle-icons">
                                    <i class="fas fa-sun"></i>
                                    <i class="fas fa-moon"></i>
                                </span>
                                <input type="checkbox" id="theme-toggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </nav>
                </div>
            </header>
        `;
    }
}

customElements.define('app-header', Header);