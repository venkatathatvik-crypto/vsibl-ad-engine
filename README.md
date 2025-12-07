# VSIBL Ad Engine

**VSIBL - Bold. Urban. Interactive.**

A modern digital advertising platform for urban autorickshaw screens, enabling dynamic ad deployment with real-time tracking and token-based billing.

## 🚀 Features

### Client Dashboard
- **Real-time Analytics**: Track active screens, impressions, and campaign performance
- **Upload Ads**: Easy drag-and-drop ad creative upload with scheduling
- **Token-based Billing**: Flexible pay-per-screen-time model
- **Live Map**: Track ad deployment across urban areas in real-time
- **Transaction History**: Monitor token usage and purchases
- **Ad Management**: View and manage all active, pending, and expired campaigns

### Admin Dashboard
- **System Overview**: Monitor total clients, active screens, and revenue
- **Ad Approvals**: Review and approve/reject pending ad submissions
- **Client Management**: Oversee all registered clients
- **Screen Management**: Track and manage all connected display screens
- **Pricing Configuration**: Set and adjust token pricing
- **System Logs**: View detailed activity logs and system events

## 🎨 Design Features

- **Doto Font**: Modern geometric typeface for headings (ExtraBold 800)
- **Dark Theme**: Premium dark maroon color scheme (#4A0025)
- **Smooth Animations**: Framer Motion for polished interactions
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Glass Morphism**: Modern UI with backdrop blur effects
- **Scroll Navigation**: Sidebar buttons smoothly scroll to sections

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom Design System
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **State Management**: TanStack Query
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Doto, Inter, Space Grotesk)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/venkatathatvik-crypto/vsibl-ad-engine.git

# Navigate to project directory
cd vsibl-ad-engine

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎯 Usage

### Demo Credentials

**Client Login:**
- Email: `demo@vsibl.com`
- Password: any password

**Admin Login:**
- Email: `admin@vsibl.com`
- Password: any password

### Navigation

The application features a collapsible sidebar with smooth scroll navigation:
- Dashboard sections scroll smoothly when clicking sidebar links
- All sections are accessible via hash anchors (e.g., `/dashboard#upload`)

## 🏗️ Project Structure

```
src/
├── components/
│   ├── dashboard/        # Dashboard-specific components
│   ├── layout/          # Layout components (Sidebar, Navbar, Logo)
│   └── ui/              # Reusable UI components (shadcn/ui)
├── pages/
│   ├── admin/           # Admin dashboard pages
│   └── dashboard/       # Client dashboard pages
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── assets/              # Images and static assets
└── index.css            # Global styles and design tokens
```

## 🎨 Design Tokens

### Colors
- **Primary**: Deep Maroon `hsl(330 100% 15%)`
- **Background**: Dark `hsl(300 8% 7%)`
- **Foreground**: Light `hsl(0 0% 97%)`

### Typography
- **Headings**: Doto (800 weight)
- **Body**: Inter
- **Display**: Space Grotesk (fallback)

## 📱 Responsive Breakpoints

- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

## 🔧 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit
```

## 📝 License

This project is proprietary software developed for VSIBL.

## 👥 Contact

For questions or support, please contact the VSIBL team.

---

**Built with ❤️ by VSIBL Team**
