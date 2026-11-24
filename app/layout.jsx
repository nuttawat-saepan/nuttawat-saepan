import "./style.css";
import Cursor from "./cursor";

export const metadata = {
  title: "Nuttawat Saepan — Software Engineer",
  description: "ผลงาน Software Engineer ด้าน Web, Apps และ Robotics ของ Nuttawat Saepan",
};

// The server renders data-opening="loading" so the home loader covers the first paint. Before that
// paint, drop it on any page other than home, so a project page never flashes the loader. Home plays
// it on every full load; motion.jsx skips it when home is reached by navigating inside the site.
const skipLoader = `try{if(location.pathname!=="/")document.documentElement.removeAttribute("data-opening")}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="th" data-opening="loading" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: skipLoader }} />
      </head>
      <body>{children}<Cursor /></body>
    </html>
  );
}
