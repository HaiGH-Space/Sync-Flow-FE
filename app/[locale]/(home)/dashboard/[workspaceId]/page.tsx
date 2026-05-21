import { getTranslations } from "next-intl/server";

export default async function SidebarProjectPage() {
  const t = await getTranslations("dashboard");
  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-semibold">{t("selectProject.title")}</h1>
    </div>
  );
}
