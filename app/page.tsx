import Link from "next/link"
import { Button } from "@/components/ui/button"
import PublicNavbar from "@/components/navbar"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function LandingPage() {
  
  const supabase = await createClient()
  
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (user) {
      redirect('/table')
    }
  

  return (
    <div className="bg-background">
      <PublicNavbar />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-primary mb-6 tracking-tight">
            AI Powered Table Generator
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-8 leading-relaxed">
            Streamline your workflow, gain valuable insights, and make data-driven decisions with our powerful, intuitive platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform duration-300">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform duration-300">
              <Link href="/examples">Explore Examples</Link>
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Trusted by over 10,000+ companies worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
              {['Company A', 'Company B', 'Company C', 'Company D'].map((company, index) => (
                <span key={index} className="font-semibold">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}