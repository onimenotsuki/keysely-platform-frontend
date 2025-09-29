import Header from '../components/Header';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedSpaces from '../components/FeaturedSpaces';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
import ScrollAnimations from '../components/ScrollAnimations';

const Index = () => {
  return (
    <div className="min-h-screen">
      <ScrollAnimations />
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedSpaces />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
