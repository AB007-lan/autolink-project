import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 rounded-2xl mb-4">
            <FileText className="w-7 h-7 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Conditions d'utilisation</h1>
          <p className="text-gray-500 mt-2">Dernière mise à jour : Janvier 2025</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptation des conditions</h2>
            <p>
              En accédant à la plateforme Autolink et en l'utilisant, vous acceptez d'être lié par
              les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez
              ne pas utiliser notre service. Autolink est une marketplace de pièces détachées
              automobiles opérant en Mauritanie, développée par SMART MS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Description du service</h2>
            <p className="mb-3">
              Autolink est une plateforme en ligne qui met en relation des acheteurs et des vendeurs
              de pièces détachées automobiles à Nouakchott et en Mauritanie. Nous fournissons :
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Un catalogue de pièces auto recherchables par véhicule</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Un système de boutiques vérifiées pour les vendeurs professionnels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Une messagerie directe entre acheteurs et vendeurs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Un système de commandes et de paiements sécurisés</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Comptes utilisateurs</h2>
            <p className="mb-3">En créant un compte, vous vous engagez à :</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Fournir des informations exactes et à jour</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Maintenir la confidentialité de vos identifiants de connexion</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Être responsable de toutes les activités effectuées sous votre compte</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Nous notifier immédiatement en cas d'utilisation non autorisée</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Règles pour les vendeurs (boutiques)</h2>
            <p className="mb-3">Les boutiques sur Autolink doivent respecter les règles suivantes :</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Toutes les pièces listées doivent être authentiques et conformes à leur description</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Les prix affichés doivent être exacts et en Ouguiya mauritanienne (MRU)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Les commandes doivent être honorées dans les délais annoncés</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Il est interdit de vendre des pièces contrefaites ou dangereuses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>La boutique doit obtenir l'approbation d'Autolink avant toute publication</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Règles pour les acheteurs</h2>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Les commandes passées constituent un engagement d'achat ferme</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>L'annulation d'une commande doit être effectuée avant sa confirmation par le vendeur</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Tout abus ou comportement frauduleux entraîne la suspension du compte</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Paiements</h2>
            <p className="mb-3">
              Autolink accepte les moyens de paiement suivants : Bankily, Masrvi, Sedad,
              et paiement à la livraison. En effectuant un paiement :
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Vous confirmez que vous êtes autorisé à utiliser le moyen de paiement choisi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Toute contestation doit être signalée dans les 48h suivant la livraison</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Responsabilités et limites</h2>
            <p className="mb-3">
              Autolink agit en tant qu'intermédiaire entre acheteurs et vendeurs. À ce titre :
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Nous ne sommes pas responsables de la qualité des pièces vendues par les boutiques</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Nous facilitons la résolution des litiges mais ne pouvons garantir leur résolution</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span>Nous vérifions les boutiques mais ne certifions pas chaque produit individuellement</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Propriété intellectuelle</h2>
            <p>
              Tout le contenu de la plateforme Autolink (logos, design, textes, code) est protégé
              par les droits de propriété intellectuelle de SMART MS. Les boutiques restent
              propriétaires de leurs photos et descriptions de produits.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Suspension et résiliation</h2>
            <p>
              Autolink se réserve le droit de suspendre ou résilier tout compte qui viole ces
              conditions d'utilisation, sans préavis et sans remboursement des frais éventuels.
              Les motifs de suspension incluent notamment la fraude, la publication de faux
              produits, ou le harcèlement d'autres utilisateurs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Modification des conditions</h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les
              utilisateurs seront notifiés par email lors de modifications importantes.
              La poursuite de l'utilisation de la plateforme après modification vaut acceptation
              des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Droit applicable</h2>
            <p>
              Les présentes conditions sont régies par le droit mauritanien. Tout litige relatif
              à l'utilisation de la plateforme sera soumis à la juridiction des tribunaux compétents
              de Nouakchott, Mauritanie.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Contact</h2>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p><strong>Autolink – SMART MS</strong></p>
              <p className="text-gray-600">Nouakchott, Mauritanie</p>
              <p className="text-gray-600">
                Email :{' '}
                <a href="mailto:support@autolink.mr" className="text-blue-600 hover:underline">
                  support@autolink.mr
                </a>
              </p>
            </div>
          </section>
        </div>

        <div className="mt-6 text-center">
          <Link href="/privacy" className="text-blue-600 hover:underline text-sm">
            ← Politique de confidentialité
          </Link>
          <span className="mx-3 text-gray-300">|</span>
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            Retour à l'accueil →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
