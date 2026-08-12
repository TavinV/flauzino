import Nav from "@/components/landing/Nav";
import PageLoader from "@/components/landing/PageLoader";
import Hero from "@/components/landing/Hero";
import WhoWeAre from "@/components/landing/WhoWeAre";
import WhyFlauzino from "@/components/landing/WhyFlauzino";
import ArtificialIntelligence from "@/components/landing/ArtificialIntelligence";
import TechLogoLoop from "@/components/landing/TechLogoLoop";
import Vibecoding from "@/components/landing/Vibecoding";
import Cases from "@/components/landing/Cases";
import Testimonials from "@/components/landing/Testimonials";
import ServicesQuestions from "@/components/landing/ServicesQuestions";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

/* ================================================================== */
/*  A página é lida em dois atos. O primeiro é escuro e fala do que a  */
/*  Flauzino acredita: quem somos, por que confiar, para onde a IA     */
/*  está levando as empresas. O segundo abre em claro e mostra prova:  */
/*  como o trabalho é feito, o que já está no ar, no que somos         */
/*  especialistas e por onde começar. A única troca de tema acontece   */
/*  entre a seção de IA e a fita de stack; o rodapé fecha devolvendo o */
/*  escuro da abertura. Cada seção carrega data-nav-theme para o       */
/*  header saber de que cor se pintar ao passar por ela.               */
/* ================================================================== */

export default function Home() {
  return (
    <main className="relative overflow-x-clip bg-white">
      <PageLoader />
      <Nav />

      {/* ato I */}
      <Hero />
      <WhoWeAre />
      <WhyFlauzino />
      <ArtificialIntelligence />

      {/* a fita de stack fecha o escuro e abre o claro na mesma emenda */}
      <TechLogoLoop />

      {/* ato II */}
      <Vibecoding />
      <Cases />
      <Testimonials />
      <ServicesQuestions />
      <FAQ />

      <Footer />
    </main>
  );
}
