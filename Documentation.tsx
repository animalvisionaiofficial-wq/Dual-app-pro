
import React from 'react';
import { Terminal, Copy, Check, BookOpen, Smartphone, ShieldCheck, Database, Layout } from 'lucide-react';

const DOC_SECTIONS = [
  {
    id: 'architecture',
    title: 'System Architecture (MVVM)',
    icon: Layout,
    desc: 'The application is built on modern Android Architecture Components.',
    code: `// DualSpace Pro Project Structure
app/
├── src/main/kotlin/com/dualspace/pro/
│   ├── data/
│   │   ├── local/ (Room DB for App List & User Settings)
│   │   ├── repository/ (AppRepository.kt)
│   ├── ui/
│   │   ├── dashboard/ (DashboardViewModel.kt, DashboardFragment.kt)
│   │   ├── cloner/ (ClonerService.kt, VirtualProcessManager.kt)
│   │   ├── security/ (VaultViewModel.kt, FingerprintHandler.kt)
│   ├── utils/
│   │   ├── ContextWrapper.kt (The key to process isolation)
│   │   ├── FileProviderUtils.kt
├── build.gradle (Project level)
├── AndroidManifest.xml`
  },
  {
    id: 'cloning',
    title: 'The Core: Virtual Sandbox',
    icon: Smartphone,
    desc: 'How DualSpace Pro clones apps without actually duplicating the APK.',
    code: `// Simplified conceptual logic for Virtual Context
class VirtualContext(base: Context, val cloneId: Int) : ContextWrapper(base) {
    override fun getFilesDir(): File {
        // Redirect standard files dir to a unique isolated path
        return File(baseContext.filesDir, "clones/$cloneId")
    }

    override fun getDatabasePath(name: String): File {
        return File(File(baseContext.filesDir, "clones/$cloneId/databases"), name)
    }
    
    // Similarly wrap other sensitive storage paths
}`
  },
  {
    id: 'storage',
    title: 'Data Persistence (Room)',
    icon: Database,
    desc: 'Managing cloned application metadata and session tokens securely.',
    code: `@Entity(tableName = "cloned_apps")
data class ClonedApp(
    @PrimaryKey val id: String,
    val packageName: String,
    val appName: String,
    val cloneIndex: Int,
    val createdAt: Long = System.currentTimeMillis(),
    val isLocked: Boolean = false
)

@Dao
interface AppDao {
    @Query("SELECT * FROM cloned_apps")
    fun getAllClones(): LiveData<List<ClonedApp>>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertClone(app: ClonedApp)
}`
  },
  {
    id: 'security',
    title: 'Security Implementation',
    icon: ShieldCheck,
    desc: 'Using BiometricPrompt and encrypted storage for the Vault.',
    code: `// Biometric implementation
val biometricPrompt = BiometricPrompt(activity, executor, callback)
val promptInfo = BiometricPrompt.PromptInfo.Builder()
    .setTitle("DualSpace Pro Security")
    .setSubtitle("Authenticate to access your private apps")
    .setNegativeButtonText("Use Pattern")
    .build()

biometricPrompt.authenticate(promptInfo)`
  }
];

export const Documentation: React.FC = () => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold uppercase tracking-widest">
          <BookOpen size={16} />
          Developer Guide
        </div>
        <h1 className="text-4xl md:text-5xl font-black">Build & Deployment</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Comprehensive guide for compiling, testing, and publishing DualSpace Pro to the Google Play Store.
        </p>
      </div>

      <div className="space-y-16">
        {DOC_SECTIONS.map((section) => (
          <div key={section.id} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white">
                <section.icon size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
                <p className="text-slate-500">{section.desc}</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute right-4 top-4 z-10">
                <button 
                  onClick={() => copyToClipboard(section.code, section.id)}
                  className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-slate-400 hover:text-white transition-all"
                >
                  {copiedId === section.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
              <pre className="bg-slate-900 rounded-2xl p-6 overflow-x-auto border border-slate-800 shadow-2xl">
                <code className="text-sm font-mono text-slate-300 leading-relaxed">
                  {section.code}
                </code>
              </pre>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 border border-slate-800 shadow-2xl">
        <h2 className="text-2xl font-bold mb-8">Play Store Readiness Checklist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "Generate Signed App Bundle (AAB)",
            "Setup Privacy Policy URL (Required for sensitive permissions)",
            "Configure AdMob App IDs & Banner IDs",
            "Prepare 1024x500 Feature Graphic",
            "Define 'Query All Packages' permission justification",
            "Target SDK 34+ (Android 14)",
            "Enable ProGuard / R8 Obfuscation",
            "Implement Billing Library for Subscriptions"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                <Check size={14} strokeWidth={3} />
              </div>
              <span className="text-slate-300 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
