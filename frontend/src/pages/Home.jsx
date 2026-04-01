import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Building2, Calendar, Users, Zap, Star, Shield, TrendingUp, Wifi, Coffee, Car, Dumbbell, ChevronRight, Play, ArrowRight, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../lib/api';

export function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await api.get('/hotels');
        setHotels(response.data);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        // Fallback to default hotels if API fails
        setHotels(defaultHotels);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Building2, title: "Gestion Multi-Hôtels", description: "Centralisez la gestion de toutes vos propriétés depuis un seul tableau de bord intuitif", color: 'from-blue-500 to-cyan-500' },
    { icon: Calendar, title: "Réservations Intelligentes", description: "Calendrier d'occupation en temps réel avec synchronisation automatique des disponibilités", color: 'from-purple-500 to-pink-500' },
    { icon: Users, title: "CRM Clients Avancé", description: "Profils clients complets avec historique, préférences et programme de fidélité intégré", color: 'from-orange-500 to-red-500' },
    { icon: Zap, title: "Automatisation IA", description: "Tâches automatisées, tarification dynamique et suggestions intelligentes powered by AI", color: 'from-green-500 to-emerald-500' },
    { icon: TrendingUp, title: "Analytics Puissants", description: "Tableaux de bord détaillés avec KPIs, tendances et prévisions de revenus", color: 'from-indigo-500 to-blue-500' },
    { icon: Shield, title: "Sécurité Maximale", description: "Chiffrement de bout en bout, sauvegardes automatiques et conformité RGPD", color: 'from-red-500 to-rose-500' },
  ];

  const testimonials = [
    {
      quote: "HotelManager Pro a transformé notre façon de travailler. Nous avons augmenté notre taux d'occupation de 35% en seulement 3 mois.",
      author: 'Amira Ben Salah',
      role: 'Directrice Générale, Hôtel Carthage',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop'
    },
    {
      quote: "L'interface est intuitive et les fonctionnalités sont exactement ce dont nous avions besoin. Le support client est exceptionnel.",
      author: 'Mohamed Trabelsi',
      role: 'Propriétaire, Trabelsi Hotels Group',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop'
    },
    {
      quote: "Grâce à l'automatisation, nous avons réduit notre temps de gestion administrative de 60%. Un investissement qui se rentabilise rapidement.",
      author: 'Leila Mansouri',
      role: "Manager, Resort Djerba Sun",
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop'
    },
  ];

  const amenities = [
    { icon: Wifi, label: 'WiFi Haut Débit' },
    { icon: Coffee, label: 'Room Service 24/7' },
    { icon: Car, label: 'Parking Privé' },
    { icon: Dumbbell, label: 'Centre de Fitness' },
  ];

  // Default hotels if API fails
  const defaultHotels = [
    {
      _id: '1',
      name: 'Laico Tunis Hotel',
      location: 'Tunis, Tunisie',
      address: { city: 'Tunis' },
      rating: 5,
      starRating: 5,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      rooms: 250,
      totalRooms: 250,
      price: '450 TND'
    },
    {
      _id: '2',
      name: 'Dar Hayet Resort',
      location: 'Hammamet, Tunisie',
      address: { city: 'Hammamet' },
      rating: 5,
      starRating: 5,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
      rooms: 180,
      totalRooms: 180,
      price: '380 TND'
    },
    {
      _id: '3',
      name: 'Sahara Palace',
      location: 'Tozeur, Tunisie',
      address: { city: 'Tozeur' },
      rating: 4,
      starRating: 4,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
      rooms: 120,
      totalRooms: 120,
      price: '320 TND'
    },
    {
      _id: '4',
      name: 'Monastir Beach Hotel',
      location: 'Monastir, Tunisie',
      address: { city: 'Monastir' },
      rating: 4,
      starRating: 4,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop',
      rooms: 85,
      totalRooms: 85,
      price: '220 TND'
    },
  ];

  const stats = [
    { value: '500+', label: "Hôtels Partenaires", icon: Building2 },
    { value: '50K+', label: 'Réservations / mois', icon: Calendar },
    { value: '99.9%', label: 'Disponibilité', icon: Zap },
    { value: '24/7', label: 'Support Client', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-primary/20 to-slate-950 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMTAgNjAgTSAwIDEwIEwgNjAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-secondary/5 border-b border-slate-800' 
          : 'bg-transparent'
      } px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20">
              <Building2 className="text-primary text-xl" />
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-secondary to-amber-400 bg-clip-text text-transparent">
              HotelManager Pro
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                Connexion
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-secondary to-amber-600 hover:from-amber-500 hover:to-amber-700 text-primary font-semibold shadow-lg shadow-secondary/25 transition-all hover:scale-105">
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full">
              <Star className="w-4 h-4 text-secondary fill-secondary" />
              <span className="text-sm text-secondary font-medium">N°1 de la gestion hôtelière en Tunisie</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Révolutionnez
              <span className="block bg-gradient-to-r from-secondary via-amber-400 to-secondary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Votre Gestion Hôtelière
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
              La plateforme tout-en-un pour gérer vos hôtels avec élégance. 
              Augmentez votre efficacité de 60% et vos revenus de 35%.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-secondary to-amber-600 hover:from-amber-500 hover:to-amber-700 text-primary font-semibold px-8 py-6 text-lg shadow-2xl shadow-secondary/30 transition-all hover:scale-105 hover:shadow-secondary/40">
                  Commencer Gratuitement
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="lg" className="border-slate-700 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg group">
                  <Play className="mr-2 w-5 h-5 text-secondary" />
                  Voir la Démo
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-gradient-to-br from-slate-700 to-slate-600 overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=100&auto=format&fit=crop`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="text-white font-semibold">500+ hôtels nous font confiance</div>
                <div className="text-slate-500">Rejoignez l'élite hôtelière</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="relative hidden lg:block">
            <div className="relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-2xl shadow-secondary/20 transform hover:scale-105 transition-transform duration-500">
                    <img 
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop" 
                      alt="Luxury Hotel" 
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl shadow-secondary/20 transform hover:scale-105 transition-transform duration-500">
                    <img 
                      src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop" 
                      alt="Hotel Lobby" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-2xl shadow-secondary/20 transform hover:scale-105 transition-transform duration-500">
                    <img 
                      src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop" 
                      alt="Hotel Room" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl shadow-secondary/20 transform hover:scale-105 transition-transform duration-500">
                    <img 
                      src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop" 
                      alt="Resort Pool" 
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-secondary to-amber-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-primary text-2xl" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">+127%</div>
                    <div className="text-sm text-slate-400">Croissance moyenne</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative px-6 py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center group hover:bg-slate-800/50 rounded-2xl p-6 transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-secondary/20 to-amber-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-secondary" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary to-amber-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Portfolio</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
              Hôtels <span className="bg-gradient-to-r from-secondary to-amber-400 bg-clip-text text-transparent">Exceptionnels</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Découvrez les établissements qui nous font confiance pour leur gestion quotidienne
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeletons
              [...Array(4)].map((_, idx) => (
                <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-800"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-slate-800 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            ) : hotels.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Building2 className="mx-auto mb-4 text-slate-600" size={48} />
                <p className="text-slate-400">Aucun hôtel disponible pour le moment</p>
              </div>
            ) : (
              hotels.slice(0, 4).map((hotel, idx) => (
                <div key={hotel._id || idx} className="group bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-secondary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop'}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                      {[...Array(hotel.starRating || 4)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    {hotel.address?.city && (
                      <div className="absolute bottom-3 left-3 bg-gradient-to-r from-secondary to-amber-600 px-3 py-1 rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="text-primary font-bold text-xs">{hotel.address.city}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-secondary transition-colors">{hotel.name}</h3>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Building2 className="w-4 h-4" />
                      <span>{hotel.totalRooms || hotel.rooms || 0} chambres</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{hotel.address?.city || hotel.location || 'Tunisie'}</span>
                    </div>
                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="pt-3 border-t border-slate-800 flex gap-2">
                        {hotel.amenities.slice(0, 3).map((amenityId, i) => {
                          const amenity = amenities.find(a => a.id === amenityId);
                          if (!amenity) return null;
                          const AmenityIcon = amenity.icon;
                          return (
                            <div key={i} className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center" title={amenity.label}>
                              <AmenityIcon className="w-4 h-4 text-secondary" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link to="/hotels">
              <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-primary group">
                Voir tous les hôtels
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Fonctionnalités</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
              Tout ce dont vous avez <span className="bg-gradient-to-r from-secondary to-amber-400 bg-clip-text text-transparent">besoin</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Une suite complète d'outils professionnels pour optimiser chaque aspect de votre exploitation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx} 
                  className="group relative bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <div className={`w-14 h-14 mb-6 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-secondary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 bg-slate-900/30 border-y border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ce que disent nos <span className="bg-gradient-to-r from-secondary to-amber-400 bg-clip-text text-transparent">clients</span>
          </h2>
          <p className="text-xl text-slate-400 mb-12">Des hôteliers satisfaits à travers toute la Tunisie</p>
          
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 md:p-12">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-secondary to-amber-600 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-5.437c0-1.088-.446-1.66-1.369-1.66h-.979v-5.05h2.346v-5.05h-5.01v5.05h-2.346v5.05h-.979c-.923 0-1.369.572-1.369 1.66v5.437h9.706zm-9.706 0v-5.437c0-1.088-.446-1.66-1.369-1.66h-.979v-5.05h2.346v-5.05h-5.01v5.05h-2.346v5.05h-.979c-.923 0-1.369.572-1.369 1.66v5.437h9.706z"/>
              </svg>
            </div>
            
            <div className="transition-all duration-500">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              
              <blockquote className="text-xl md:text-2xl text-white font-medium mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              
              <div className="flex items-center justify-center gap-4">
                <img 
                  src={testimonials[currentTestimonial].avatar} 
                  alt={testimonials[currentTestimonial].author}
                  className="w-14 h-14 rounded-full object-cover border-2 border-secondary"
                />
                <div className="text-left">
                  <div className="text-white font-bold">{testimonials[currentTestimonial].author}</div>
                  <div className="text-slate-400 text-sm">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentTestimonial 
                      ? 'w-8 bg-secondary' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Tarification</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
              Des prix <span className="bg-gradient-to-r from-secondary to-amber-400 bg-clip-text text-transparent">transparents</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Choisissez le plan adapté à la taille de votre établissement
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Starter', price: '99', hotels: '1-5', features: ['Jusqu\'à 50 chambres', 'Réservations illimitées', 'Support email', 'Rapports de base'], popular: false },
              { name: 'Professional', price: '199', hotels: '5-15', features: ["Jusqu'à 200 chambres", 'Analytics avancés', 'Support prioritaire 24/7', 'API accès', 'Formation incluse'], popular: true },
              { name: 'Enterprise', price: 'Sur mesure', hotels: '15+', features: ['Chambres illimitées', 'Solution white-label', 'Manager dédié', 'SLA garanti', 'Personnalisation complète'], popular: false },
            ].map((plan, idx) => (
              <div 
                key={idx} 
                className={`relative rounded-3xl p-8 ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-secondary/20 to-amber-600/20 border-2 border-secondary scale-105 shadow-2xl shadow-secondary/20' 
                    : 'bg-slate-900/50 border border-slate-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-secondary to-amber-600 text-primary px-4 py-1 rounded-full text-sm font-bold">
                    Plus populaire
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-secondary mb-2">
                    €{plan.price}
                    {plan.price !== 'Sur mesure' && <span className="text-lg text-slate-400">/mois</span>}
                  </div>
                  <div className="text-slate-400">{plan.hotels} hôtels</div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div className="w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-secondary to-amber-600 hover:from-amber-500 hover:to-amber-700 text-primary' 
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    Commencer
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-r from-secondary via-amber-500 to-secondary bg-[length:200%_100%] animate-gradient rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-2xl shadow-secondary/30">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMTAgNjAgTSAwIDEwIEwgNjAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">
                Prêt à transformer votre gestion hôtelière?
              </h2>
              <p className="text-xl text-primary/90 mb-8 max-w-2xl mx-auto">
                Rejoignez les 500+ hôtels qui font confiance à HotelManager Pro. 
                Essayez gratuitement pendant 14 jours, sans carte de crédit.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-primary text-secondary hover:bg-slate-900 font-bold px-8 py-6 text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105">
                    Créer un compte maintenant
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg">
                    Contacter l'équipe
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-primary/80 text-sm">
                <span className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Sans carte de crédit
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Configuration en 5 min
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Support 24/7 inclus
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary to-amber-600 rounded-xl flex items-center justify-center">
                  <Building2 className="text-primary text-xl" />
                </div>
                <div className="text-xl font-bold text-white">HotelManager Pro</div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                La solution complète pour la gestion hôtelière professionnelle.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/features" className="hover:text-secondary transition-colors">Fonctionnalités</Link></li>
                <li><Link to="/pricing" className="hover:text-secondary transition-colors">Tarifs</Link></li>
                <li><Link to="/demo" className="hover:text-secondary transition-colors">Démo</Link></li>
                <li><Link to="/integrations" className="hover:text-secondary transition-colors">Intégrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/about" className="hover:text-secondary transition-colors">À propos</Link></li>
                <li><Link to="/blog" className="hover:text-secondary transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-secondary transition-colors">Carrières</Link></li>
                <li><Link to="/contact" className="hover:text-secondary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/privacy" className="hover:text-secondary transition-colors">Confidentialité</Link></li>
                <li><Link to="/terms" className="hover:text-secondary transition-colors">Conditions</Link></li>
                <li><Link to="/security" className="hover:text-secondary transition-colors">Sécurité</Link></li>
                <li><Link to="/gdpr" className="hover:text-secondary transition-colors">RGPD</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              &copy; 2024 HotelManager Pro. Tous droits réservés.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map((social) => (
                <a key={social} href="#" className="text-slate-500 hover:text-secondary transition-colors text-sm">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
