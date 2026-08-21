import Link from "next/link";
import { Dumbbell, Activity, BrainCircuit, ChevronRight, LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
      <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">

        {/* Navbar */}
        <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Dumbbell className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold tracking-tight">FitPlatform</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                  href="/login"
                  className="text-sm font-medium hover:text-emerald-500 transition-colors"
              >
                Войти
              </Link>
              <Link
                  href="/register"
                  className="flex h-9 items-center justify-center rounded-full bg-emerald-500 px-4 text-sm font-medium text-white hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-500/20"
              >
                Начать бесплатно
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="max-w-3xl mx-auto space-y-8">

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-4 py-1.5 text-sm text-emerald-700 dark:text-emerald-400">
              <BrainCircuit className="h-4 w-4" />
              <span>Умные рекомендации на основе твоих целей</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
              Твой путь к идеальной форме <br />
              <span className="text-emerald-500">начинается здесь</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400 leading-8">
              Платформа для генерации персональных программ тренировок, трекинга прогресса и умного подбора упражнений.
              Забудь о рутине — сосредоточься на результате.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                  href="/register"
                  className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-zinc-900 dark:bg-white px-8 text-base font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-zinc-900/10"
              >
                Создать аккаунт
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                  href="/catalog"
                  className="flex h-12 w-full sm:w-auto items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-8 text-base font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Смотреть каталог упражнений
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="max-w-5xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <FeatureCard
                icon={<Dumbbell className="h-6 w-6" />}
                title="Каталог упражнений"
                description="База упражнений с подробной техникой выполнения, видео и фильтрацией по группам мышц и инвентарю."
            />
            <FeatureCard
                icon={<Activity className="h-6 w-6" />}
                title="Трекинг прогресса"
                description="Отслеживай веса, подходы и объемы тренировок. Визуализируй свой прогресс в удобных графиках."
            />
            <FeatureCard
                icon={<LayoutDashboard className="h-6 w-6" />}
                title="Генерация программ"
                description="Получи персонализированную программу тренировок на основе твоих целей, опыта и доступного инвентаря."
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 mt-20">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm text-zinc-500">
            © {new Date().getFullYear()} FitPlatform. Pet-project для практики Event-Driven архитектуры и микросервисов.
          </div>
        </footer>
      </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
      <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-6">{description}</p>
      </div>
  );
}