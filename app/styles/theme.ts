// theme.ts

export const theme = {
  colors: {
    background: "#F8F9FC",
    surface: "#FFFFFF",

    primary: "#5B7FFF",
    primaryDark: "#4267F5",

    secondary: "#FFD66B",

    success: "#4CAF50",
    danger: "#FF6B6B",
    warning: "#FFB74D",

    text: "#1E293B",
    textSecondary: "#64748B",
    textLight: "#94A3B8",

    border: "#E5E7EB",

    gradientStart: "#FBC2EB",
    gradientEnd: "#A6C1EE",

    white: "#FFFFFF",
    black: "#000000",
  },

  typography: {
    logo: {
      fontFamily: "Inter-Bold",
      fontSize: 34,
    },

    h1: {
      fontFamily: "Inter-SemiBold",
      fontSize: 28,
    },

    h2: {
      fontFamily: "Inter-SemiBold",
      fontSize: 22,
    },

    h3: {
      fontFamily: "Inter-SemiBold",
      fontSize: 18,
    },

    body: {
      fontFamily: "Inter-Regular",
      fontSize: 16,
    },

    bodySmall: {
      fontFamily: "Inter-Regular",
      fontSize: 14,
    },

    caption: {
      fontFamily: "Inter-Regular",
      fontSize: 12,
    },

    mono: {
      fontFamily: "JetBrainsMono-Regular",
      fontSize: 14,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },

  radius: {
    sm: 8,
    md: 14,
    lg: 20,
    xl: 28,
    round: 999,
  },

  shadow: {
    card: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      elevation: 4,
    },
  },
};