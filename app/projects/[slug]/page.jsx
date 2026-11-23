import { notFound } from "next/navigation";
import Sidebar from "../../sidebar";
import CaseView from "../case-view";
import { projectSlug, projects } from "../../projects";
import "../projects.css";

// One page per project, prerendered at build time; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: projectSlug(project.name) }));
}

const find = (slug) => projects.findIndex((project) => projectSlug(project.name) === slug);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects[find(slug)];
  if (!project) return {};
  return { title: `${project.name} — What's inside · Nuttawat Saepan`, description: project.summary };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const index = find(slug);
  if (index < 0) notFound();
  return (
    <>
      <a className="skip-link" href="#main">ข้ามไปยังเนื้อหา</a>
      <Sidebar theme="ink" home={false} />
      <main id="main" className="pj" data-theme="ink">
        <CaseView index={index} />
      </main>
    </>
  );
}
