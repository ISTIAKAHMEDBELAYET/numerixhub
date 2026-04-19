import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorsDirectory from '@/components/CalculatorsDirectory';

export default function CalculatorsPage() {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CalculatorsDirectory />
      </main>
      <Footer />
    </div>
  );
}
