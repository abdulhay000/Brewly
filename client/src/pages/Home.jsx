import Navbar from "../components/layout/Navbar";
import Hero from "../features/home/components/Hero";
import About from "../features/home/components/About";
import Services from "../features/home/components/Services";
import Menu from "../features/home/components/Menu";
import Testimonials from "../features/home/components/Testimonials";
import Footer from "../components/layout/Footer";

function Home() {
  return (
    <>
      <div className="img">
        <Navbar />
        <Hero />
      </div>
      <About />
      <Services />
      <Menu />
      <Testimonials />
      <Footer />
    </>
  );
}

export default Home;
