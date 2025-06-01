import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 微信风格配色
        wechat: {
          primary: '#07C160',    // 微信绿主色
          secondary: '#1AAD19',  // 微信绿辅助色
          accent: '#FA9D3B',     // 橙色强调色
          background: '#F7F7F7', // 背景灰
          surface: '#FFFFFF',    // 表面白色
          text: {
            primary: '#191919',  // 主要文字
            secondary: '#888888', // 次要文字
            muted: '#CCCCCC',    // 弱化文字
          },
          border: '#E5E5E5',     // 边框色
          divider: '#EBEBEB',    // 分割线
        },
        // 传统色彩（用于命理元素）
        traditional: {
          gold: '#FFD700',       // 金
          wood: '#228B22',       // 木
          water: '#4169E1',      // 水
          fire: '#DC143C',       // 火
          earth: '#CD853F',      // 土
          yin: '#2F4F4F',        // 阴
          yang: '#FF6347',       // 阳
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'wechat': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'modal': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config; 