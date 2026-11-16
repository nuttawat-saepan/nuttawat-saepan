import "./style.css";
import "./editorial.css";

export const metadata = {
  title: "Nuttawat Saepan — Software Engineer",
  description: "ผลงานด้าน Frontend, Mobile และ Robotics",
};

export default function RootLayout({ children }) {
  return <html lang="th"><body id="top">{children}</body></html>;
}
