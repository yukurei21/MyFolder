export class HudView {
  constructor({ root }) {
    this.root = root;
  }

  render(summaryRows) {
    this.root.innerHTML = summaryRows
      .map(([label, value, className = '']) => {
        const safeClass = className ? `hud-value ${className}` : 'hud-value';
        return `
          <div class="hud-row">
            <span class="hud-label">${label}</span>
            <span class="${safeClass}">${value}</span>
          </div>
        `;
      })
      .join('');
  }
}
