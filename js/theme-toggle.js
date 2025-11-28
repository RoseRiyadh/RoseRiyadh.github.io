/*!
 * Theme Toggle - Dark Mode Implementation
 * Handles theme switching with accessibility and persistence
 */

(function () {
    'use strict';

    const THEME_KEY = 'preferred-theme';
    const LIGHT_THEME = 'light';
    const DARK_THEME = 'dark';

    // Get system preference
    const getSystemTheme = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? DARK_THEME
            : LIGHT_THEME;
    };

    // Get stored preference or system preference
    const getPreferredTheme = () => {
        const stored = localStorage.getItem(THEME_KEY);
        return stored || getSystemTheme();
    };

    // Apply theme to document
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);

        // Update toggle button state if it exists
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            const isLight = theme === LIGHT_THEME;

            icon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
            toggleBtn.setAttribute('aria-label',
                isLight ? 'Switch to dark mode' : 'Switch to light mode'
            );
            toggleBtn.setAttribute('aria-pressed', !isLight);
        }
    };

    // Toggle theme
    const toggleTheme = () => {
        const current = document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
        const newTheme = current === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;

        localStorage.setItem(THEME_KEY, newTheme);
        applyTheme(newTheme);
    };

    // Initialize theme immediately to prevent flash
    applyTheme(getPreferredTheme());

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only update if user hasn't set a preference
        if (!localStorage.getItem(THEME_KEY)) {
            applyTheme(e.matches ? DARK_THEME : LIGHT_THEME);
        }
    });

    // Setup toggle button when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleTheme);

            // Support keyboard navigation
            toggleBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
        }
    });

    // Expose toggle function globally if needed
    window.toggleTheme = toggleTheme;
})();
