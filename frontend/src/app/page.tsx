import Link from "next/link";
import { Dumbbell, Activity, BrainCircuit, ChevronRight, LayoutDashboard } from "lucide-react";
import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
      <div className="flex flex-col min-h-screen bg-gray-50 font-sans dark:bg-gray-950 text-gray-900 dark:text-gray-100">

        <Header />

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="max-w-3xl mx-auto space-y-8">

            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 px-4 py-1.5 text-sm text-blue-700 dark:text-blue-400">
              <BrainCircuit className="h-4 w-4" />
              <span>Умные рекомендации на основе твоих целей</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
              Твой путь к идеальной форме <br />
              <span className="text-blue-500">начинается здесь</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 leading-8">
              Платформа для генерации персональных программ тренировок, трекинга прогресса и умного подбора упражнений.
              Забудь о рутине — сосредоточься на результате.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                  href="/register"
                  className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gray-900 dark:bg-white px-8 text-base font-medium text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors shadow-lg shadow-gray-900/10"
              >
                Создать аккаунт
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                  href="/exercises"
                  className="flex h-12 w-full sm:w-auto items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 px-8 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
        <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-20">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} FitPlatform. Pet-project для практики Event-Driven архитектуры и микросервисов.
          </div>
        </footer>
      </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
      <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-6">{description}</p>
      </div>
  );
}