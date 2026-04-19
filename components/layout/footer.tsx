import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="text-sm text-muted-foreground">Sentrix Scan</span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              {t("chain")}
            </Link>
            <a href="https://sentrix.sentriscloud.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              {t("docs")}
            </a>
            <a href="https://github.com/sentrix-labs/sentrix" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              {t("github")}
            </a>
          </nav>

          <p className="text-xs text-muted-foreground">{t("copyright", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
