/**
* 一个简易的主题色注入流程，只能注入css variables，不能使用 apply、import 等语法
* **/
function injectTailwindTheme() {
  const style = document.createElement('style');
  style.type = 'text/tailwindcss';
  style.textContent = `
    @theme {
      /* 基础色彩 - 温暖纸张色系 */
      --color-background: #FDF8F3;
      --color-background-paper: #FFFFFF;
      --color-foreground: #3D3D3D;
      --color-foreground-muted: #6B6B6B;
      
      /* 主色 - 柔和薄荷绿 */
      --color-primary: #7CB9A8;
      --color-primary-light: #A8D5C8;
      --color-primary-dark: #5A9687;
      --color-primary-foreground: #FFFFFF;
      
      /* 辅助色 - 淡珊瑚 */
      --color-secondary: #F4A698;
      --color-secondary-light: #F9C4BB;
      --color-secondary-dark: #D4857A;
      --color-secondary-foreground: #FFFFFF;
      
      /* 点缀色 - 暖金色 */
      --color-accent: #D4A574;
      --color-accent-light: #E4C9A8;
      --color-accent-dark: #B88A5A;
      --color-accent-foreground: #FFFFFF;
      
      /* 状态色 */
      --color-success: #7CB9A8;
      --color-warning: #E6B89C;
      --color-error: #E07A5F;
      --color-info: #8FB8C9;
      
      /* 阴影 */
      --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
      --shadow-card-hover: 0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
      
      --radius-lg: 0.75rem;
      --radius-xl: 1rem;
      --radius-2xl: 1.5rem;
    }

    @layer base {
      body {
        background-color: var(--color-background);
        color: var(--color-foreground);
        font-family: system-ui, -apple-system, sans-serif;
      }
    }
  `;
  document.head.appendChild(style);
}
// 调用函数插入样式
injectTailwindTheme();