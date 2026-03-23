import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Building2, Calendar, Users, Zap } from 'lucide-react';

export function Home() {
  const features = [
    { icon: Building2, title: 'Gestion d\'Hôtels', description: 'Gérez plusieurs propriétés facilement' },
    { icon: Calendar, title: 'Réservations', description: 'Calendrier d\'occupation en temps réel' },
    { icon: Users, title: 'Gestion Clients', description: 'CRM complet pour les clients' },
    { icon: Zap, title: 'Automatisation', description: 'Tâches automatisées et flux de travail' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-primary to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-primary/80 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-secondary">HotelManager Pro</div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link to="/register">
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Gestion Hôtelière
            <span className="text-secondary"> Simplifiée</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            La plateforme complète pour gérer vos hôtels, réservations, employés et clients. Augmentez votre efficacité et vos revenus.
          </p>
          <div className="flex gap-4 justify-center mb-12">
            <Link to="/register">
              <Button size="lg">Commencer Gratuitement</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Me connecter</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-slate-700">
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">500+</div>
              <p className="text-slate-400">Hôtels gérés</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">50K+</div>
              <p className="text-slate-400">Réservations/mois</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">99.9%</div>
              <p className="text-slate-400">Disponibilité</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Fonctionnalités</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-secondary transition-colors">
                  <Icon size={32} className="text-secondary mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-secondary to-amber-600 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Prêt à transformer votre gestion hôtelière?</h2>
          <p className="text-primary/90 mb-8">Essayez HotelManager Pro gratuitement pendant 14 jours.</p>
          <Link to="/register">
            <Button size="lg" className="bg-primary text-secondary hover:bg-slate-900">
              Créer un compte maintenant
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 px-6 py-8 text-center text-slate-400">
        <p>&copy; 2024 HotelManager Pro. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
