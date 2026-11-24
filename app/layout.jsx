import "./style.css";

export const metadata = {
  title: "Nuttawat Saepan — Software Engineer",
  description: "ผลงาน Software Engineer ด้าน Web, Apps และ Robotics ของ Nuttawat Saepan",
};

// The server renders data-opening="loading" so the home loader covers the first paint. Before that
// paint, drop it when this tab has already seen the loader (motion.jsx sets the flag) or when the page
// isn't home, so neither a return visit nor a project page flashes the loader.
const skipLoader = `try{if(location.pathname!=="/"||sessionStorage.getItem("ns-opened")==="1")document.documentElement.removeAttribute("data-opening")}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="th" data-opening="loading" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: skipLoader }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
