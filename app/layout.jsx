import "./style.css";

export const metadata = {
  title: "Nuttawat Saepan — Software Engineer",
  description: "ผลงาน Software Engineer ด้าน Web, Apps และ Robotics ของ Nuttawat Saepan",
};

export default function RootLayout({ children }) {
  return <html lang="th"><body>{children}</body></html>;
}
